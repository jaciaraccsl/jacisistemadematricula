"use client";

import { useMemo, useState } from "react";
import { Inbox, AlertTriangle, XCircle, Download, Paperclip, FileText } from "lucide-react";
import { Shell, KpiCard } from "@/components/Shell";
import { ExportModal } from "@/components/matricula-forms";
import { MatriculaModal } from "@/components/matriculas";
import { useStore } from "@/lib/store";
import { corDoNome, iniciais, soft } from "@/lib/ui";

const FIN_OPCOES = ["A confirmar", "Validado", "Cadastro com pendência", "Cancelado"] as const;
const FIN_COR: Record<string, string> = {
  "A confirmar": "#64748b",
  "Validado": "#10b981",
  "Cadastro com pendência": "#ef4444",
  "Cancelado": "#94a3b8",
};

export default function FinanceiroPage() {
  const { etapas, enrollments, moverMatricula, updateEnrollment } = useStore();
  const [escopo, setEscopo] = useState<"setor" | "todas">("setor");
  const [exportar, setExportar] = useState(false);
  const [abertaId, setAbertaId] = useState<string | null>(null);
  const aberta = enrollments.find((e) => e.id === abertaId) ?? null;

  const idxFin = etapas.findIndex((e) => e.id === "financeiro");
  const proxima = etapas[idxFin + 1];

  const statusDe = (e: typeof enrollments[number]) => {
    if (e.situacao === "cancelada") return "Cancelado";
    if (e.situacao === "pendencia") return "Cadastro com pendência";
    const idxCur = etapas.findIndex((x) => x.id === e.etapaId);
    if (idxCur > idxFin) return "Validado";
    return "A confirmar";
  };

  const mudarStatus = (e: typeof enrollments[number], valor: string) => {
    if (valor === "Validado") updateEnrollment(e.id, { situacao: "ativa", etapaId: proxima ? proxima.id : e.etapaId });
    else if (valor === "Cadastro com pendência") updateEnrollment(e.id, { situacao: "pendencia" });
    else if (valor === "Cancelado") updateEnrollment(e.id, { situacao: "cancelada" });
    else updateEnrollment(e.id, { situacao: "ativa" });
  };

  const anexar = (e: typeof enrollments[number], files: FileList | null) => {
    const nomes = Array.from(files ?? []).map((f) => f.name);
    if (nomes.length) updateEnrollment(e.id, { documentos: [...(e.documentos ?? []), ...nomes] });
  };

  const lista = escopo === "setor" ? enrollments.filter((e) => e.etapaId === "financeiro") : enrollments;
  const pendencias = enrollments.filter((e) => e.situacao === "pendencia");

  const kpis = useMemo(() => ({
    aguardando: enrollments.filter((e) => e.etapaId === "financeiro" && (e.situacao ?? "ativa") === "ativa").length,
    pendencia: pendencias.length,
    canceladas: enrollments.filter((e) => e.situacao === "cancelada").length,
  }), [enrollments, pendencias.length]);

  return (
    <Shell titulo="Financeiro" subtitulo="Confirme pagamentos, valide ou sinalize pendências">
      <div className="space-y-6">
        {/* Controles */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="glass flex items-center gap-1 rounded-full p-1">
            <button onClick={() => setEscopo("setor")} className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${escopo === "setor" ? "bg-teal-600 text-white shadow" : "text-slate-500 hover:text-slate-700"}`}>Do meu setor</button>
            <button onClick={() => setEscopo("todas")} className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${escopo === "todas" ? "bg-teal-600 text-white shadow" : "text-slate-500 hover:text-slate-700"}`}>Todas as matrículas</button>
          </div>
          <button onClick={() => setExportar(true)} className="ml-auto flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/70 px-4 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-white"><Download size={14} /> Exportar</button>
        </div>

        {/* KPIs */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <KpiCard icon={Inbox} label="Aguardando confirmação" value={kpis.aguardando} from="#f59e0b" to="#fbbf24" />
          <KpiCard icon={AlertTriangle} label="Com pendência" value={kpis.pendencia} from="#ef4444" to="#f87171" />
          <KpiCard icon={XCircle} label="Canceladas" value={kpis.canceladas} from="#64748b" to="#94a3b8" />
        </section>

        {/* Lista */}
        <section className="glass rounded-3xl p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">{escopo === "setor" ? "Matrículas no Financeiro" : "Todas as matrículas"}</h2>
            <span className="text-xs text-slate-400">{lista.length} matrícula(s)</span>
          </div>

          {lista.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-500">Nada por aqui. 🎉</p>
          ) : (
            <div className="space-y-2">
              {lista.map((e) => {
                const status = statusDe(e);
                const cancelada = e.situacao === "cancelada";
                const pendencia = e.situacao === "pendencia";
                return (
                  <div
                    key={e.id}
                    className={`relative flex flex-wrap items-center gap-3 rounded-2xl border py-3 pl-5 pr-3 transition ${
                      cancelada ? "border-transparent bg-slate-100/60 opacity-60 grayscale"
                        : pendencia ? "border-red-200 bg-red-50/40"
                        : "border-transparent hover:bg-white/60"
                    }`}
                  >
                    <span className="absolute left-1.5 top-2.5 bottom-2.5 w-1.5 rounded-full" style={{ background: cancelada ? "#cbd5e1" : pendencia ? "#ef4444" : "#f59e0b" }} />
                    <button onClick={() => setAbertaId(e.id)} className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-sm font-semibold text-white shadow-sm" style={{ background: corDoNome(e.nomeCliente) }}>
                      {iniciais(e.nomeCliente)}
                    </button>
                    <button onClick={() => setAbertaId(e.id)} className="min-w-0 flex-1 text-left md:w-52 md:flex-none">
                      <p className="truncate font-medium text-slate-900">{e.nomeCliente}</p>
                      <p className="truncate text-xs text-slate-500">{e.nomeCurso} · Turma {e.turmaMes}</p>
                    </button>

                    {pendencia && <span className="rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-semibold text-red-700">⚠ Pendência</span>}
                    {cancelada && <span className="rounded-full bg-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-500">Inativa</span>}

                    <div className="ml-auto flex items-center gap-2">
                      {/* anexar arquivo */}
                      <input id={`fin-file-${e.id}`} type="file" multiple className="hidden" onChange={(ev) => anexar(e, ev.target.files)} />
                      <label htmlFor={`fin-file-${e.id}`} title="Anexar arquivo" className="flex cursor-pointer items-center gap-1 rounded-full border border-slate-200 bg-white/70 px-2.5 py-1.5 text-xs text-slate-500 transition hover:text-teal-600">
                        <Paperclip size={13} />
                        {e.documentos?.length ? <span className="flex items-center gap-0.5"><FileText size={11} /> {e.documentos.length}</span> : "Anexar"}
                      </label>

                      {/* status financeiro */}
                      <select
                        value={status}
                        onChange={(ev) => mudarStatus(e, ev.target.value)}
                        className="cursor-pointer appearance-none rounded-full border-0 px-3 py-1.5 text-xs font-semibold outline-none"
                        style={{ background: soft(FIN_COR[status], 0.16), color: FIN_COR[status] }}
                      >
                        {FIN_OPCOES.map((o) => <option key={o} value={o} style={{ color: "#0f172a" }}>{o}</option>)}
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <p className="mt-4 text-xs text-slate-400">
            💡 <b>Validado</b> segue o fluxo (vai para {proxima?.nome ?? "a próxima etapa"}) · <b>Cadastro com pendência</b> gera alerta vermelho · <b>Cancelado</b> deixa a linha inativa. O Financeiro não escolhe o setor de destino.
          </p>
        </section>
      </div>

      {aberta && <MatriculaModal e={aberta} etapas={etapas} onMove={moverMatricula} onClose={() => setAbertaId(null)} />}
      {exportar && <ExportModal itens={lista} etapas={etapas} onClose={() => setExportar(false)} />}
    </Shell>
  );
}
