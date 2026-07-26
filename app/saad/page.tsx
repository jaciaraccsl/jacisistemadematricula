"use client";

import { useMemo } from "react";
import { Inbox, Clock, FileWarning, CheckCircle2, Plus } from "lucide-react";
import { Shell, KpiCard } from "@/components/Shell";
import { useStore } from "@/lib/store";
import { TICKET_STATUS_STYLE, URGENCIA_STYLE } from "@/lib/types";
import { dataBR } from "@/lib/ui";

export default function SaadPage() {
  const { tickets } = useStore();

  const stats = useMemo(() => ({
    abertos: tickets.filter((t) => t.status === "Aberto").length,
    aguardando: tickets.filter((t) => t.status === "Aguardando retorno").length,
    atrasados: tickets.filter((t) => t.status === "Atrasado").length,
    resolvidos: tickets.filter((t) => t.status === "Resolvido").length,
  }), [tickets]);

  return (
    <Shell titulo="SAAD — Suporte e Atendimento" subtitulo="Abertura e acompanhamento de chamados internos">
      <div className="space-y-6">
        <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          <KpiCard icon={Inbox} label="Abertos" value={stats.abertos} from="#1e3a8a" to="#3b82f6" />
          <KpiCard icon={Clock} label="Aguardando" value={stats.aguardando} from="#f59e0b" to="#eab308" />
          <KpiCard icon={FileWarning} label="Atrasados" value={stats.atrasados} from="#ef4444" to="#f87171" />
          <KpiCard icon={CheckCircle2} label="Resolvidos" value={stats.resolvidos} from="#10b981" to="#22c55e" />
        </section>

        <section className="glass rounded-3xl p-5">
          <div className="mb-4 flex items-center">
            <h2 className="text-base font-semibold text-slate-900">Chamados</h2>
            <button className="ml-auto flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium text-white shadow-md transition hover:brightness-110" style={{ background: "linear-gradient(135deg,#0d9488,#0e7490)" }}>
              <Plus size={14} /> Novo Chamado
            </button>
          </div>

          <div className="space-y-2">
            {tickets.map((t) => {
              const s = TICKET_STATUS_STYLE[t.status];
              return (
                <div key={t.id} className="flex items-start gap-3 rounded-2xl border border-white/60 bg-white/50 p-4">
                  <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: URGENCIA_STYLE[t.urgencia] }} title={`Urgência: ${t.urgencia}`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-slate-900">{t.nomeAluno ?? "Geral"}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">{t.departamento}</span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-500">{t.descricao}</p>
                    <p className="mt-1.5 text-[11px] text-slate-400">
                      Resp.: {t.responsavel}{t.dataLimite ? ` · Prazo: ${dataBR(t.dataLimite)}` : ""}
                    </p>
                  </div>
                  <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium" style={{ background: s.bg, color: s.text }}>
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.dot }} />
                    {t.status}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </Shell>
  );
}
