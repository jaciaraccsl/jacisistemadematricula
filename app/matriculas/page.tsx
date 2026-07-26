"use client";

import { useMemo, useState } from "react";
import { List, LayoutGrid, Plus, Download, Search } from "lucide-react";
import { Shell } from "@/components/Shell";
import { useStore } from "@/lib/store";
import { MatriculaRow, KanbanBoard, MatriculaModal } from "@/components/matriculas";
import { NovaMatriculaModal, ExportModal } from "@/components/matricula-forms";

export default function MatriculasPage() {
  const { etapas, enrollments, courses, moverMatricula, addEnrollment, addEtapa, renomearEtapa, removerEtapa } = useStore();
  const [busca, setBusca] = useState("");
  const [curso, setCurso] = useState("all");
  const [vendedor, setVendedor] = useState("all");
  const [filtroEtapa, setFiltroEtapa] = useState("all");
  const [view, setView] = useState<"lista" | "quadro">("lista");
  const [abertaId, setAbertaId] = useState<string | null>(null);
  const [nova, setNova] = useState(false);
  const [exportar, setExportar] = useState(false);
  const aberta = enrollments.find((e) => e.id === abertaId) ?? null;

  const cursos = useMemo(() => Array.from(new Set(enrollments.map((e) => e.nomeCurso))), [enrollments]);
  const vendedores = useMemo(() => Array.from(new Set(enrollments.map((e) => e.vendedor))), [enrollments]);

  const lista = useMemo(() => enrollments.filter((e) => {
    if (curso !== "all" && e.nomeCurso !== curso) return false;
    if (vendedor !== "all" && e.vendedor !== vendedor) return false;
    if (filtroEtapa !== "all" && e.etapaId !== filtroEtapa) return false;
    if (busca) {
      const t = busca.toLowerCase();
      return e.nomeCliente.toLowerCase().includes(t) || e.cpf.includes(t) || e.email.toLowerCase().includes(t);
    }
    return true;
  }), [enrollments, busca, curso, vendedor, filtroEtapa]);

  const selectCls = "rounded-full border border-white/60 bg-white/60 px-4 py-1.5 text-xs text-slate-700 outline-none backdrop-blur transition focus:border-teal-300";

  return (
    <Shell titulo="Matrículas" subtitulo="Acompanhe o fluxo de cada matrícula">
      <div className="space-y-6">
        {/* Pendentes por departamento/etapa */}
        <section className="flex flex-wrap gap-3">
          {etapas.map((et) => {
            const n = enrollments.filter((e) => e.etapaId === et.id).length;
            return (
              <div key={et.id} className="glass flex items-center gap-3 rounded-2xl px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: et.cor }} />
                <div>
                  <p className="text-xl font-bold leading-none text-slate-900">{n}</p>
                  <p className="text-[11px] text-slate-500">{et.nome}</p>
                </div>
              </div>
            );
          })}
        </section>

        {/* FILTROS (separado da planilha) */}
        <section className="glass rounded-3xl p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar aluno, CPF, e-mail..." className={`${selectCls} w-56 pl-8`} />
            </div>
            <select value={curso} onChange={(e) => setCurso(e.target.value)} className={selectCls}>
              <option value="all">Todos os cursos</option>
              {cursos.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={vendedor} onChange={(e) => setVendedor(e.target.value)} className={selectCls}>
              <option value="all">Todos os vendedores</option>
              {vendedores.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
            <select value={filtroEtapa} onChange={(e) => setFiltroEtapa(e.target.value)} className={selectCls}>
              <option value="all">Todas as etapas</option>
              {etapas.map((et) => <option key={et.id} value={et.id}>{et.nome}</option>)}
            </select>
            <button onClick={() => setExportar(true)} className="ml-auto flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/70 px-4 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-white"><Download size={14} /> Exportar</button>
          </div>
        </section>

        {/* Ações: Lista/Quadro + Status (esquerda) · Nova Matrícula (direita) */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="glass flex items-center gap-1 rounded-full p-1">
            <button onClick={() => setView("lista")} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${view === "lista" ? "bg-teal-600 text-white shadow" : "text-slate-500 hover:text-slate-700"}`}><List size={14} /> Lista</button>
            <button onClick={() => setView("quadro")} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${view === "quadro" ? "bg-teal-600 text-white shadow" : "text-slate-500 hover:text-slate-700"}`}><LayoutGrid size={14} /> Quadro</button>
          </div>
          <button onClick={addEtapa} className="flex items-center gap-1.5 rounded-full border border-teal-200 bg-white/70 px-4 py-2 text-xs font-medium text-teal-700 transition hover:bg-teal-50"><Plus size={14} /> Status</button>

          <button onClick={() => setNova(true)} className="ml-auto flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-200 ring-1 ring-white/40 transition hover:-translate-y-0.5 hover:shadow-xl active:scale-95" style={{ background: "linear-gradient(135deg,#0d9488,#0e7490)" }}>
            <span className="grid h-6 w-6 place-items-center rounded-full bg-white/20"><Plus size={16} /></span>
            Nova Matrícula
          </button>
        </div>

        {/* PLANILHA (separado dos filtros) */}
        <section className="glass rounded-3xl p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Planilha de matrículas</h2>
            <span className="text-xs text-slate-400">{lista.length} matrícula(s)</span>
          </div>
          {lista.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-500">Nenhuma matrícula encontrada com esses filtros.</p>
          ) : view === "lista" ? (
            <div className="space-y-2">
              {lista.map((e) => <MatriculaRow key={e.id} e={e} etapas={etapas} onMove={moverMatricula} onOpen={setAbertaId} />)}
            </div>
          ) : (
            <KanbanBoard itens={lista} etapas={etapas} onMove={moverMatricula} onAdd={addEtapa} onRename={renomearEtapa} onRemove={removerEtapa} onOpen={setAbertaId} />
          )}
        </section>
      </div>

      {aberta && <MatriculaModal e={aberta} etapas={etapas} onMove={moverMatricula} onClose={() => setAbertaId(null)} />}
      {nova && <NovaMatriculaModal courses={courses} vendedores={vendedores.length ? vendedores : ["—"]} onSave={addEnrollment} onClose={() => setNova(false)} />}
      {exportar && <ExportModal itens={lista} etapas={etapas} onClose={() => setExportar(false)} />}
    </Shell>
  );
}
