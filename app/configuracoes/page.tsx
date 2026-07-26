"use client";

import { Plus, X, GripVertical, BookOpen } from "lucide-react";
import { Shell } from "@/components/Shell";
import { useStore } from "@/lib/store";
import { cliente } from "@/lib/config";

export default function ConfiguracoesPage() {
  const { etapas, addEtapa, renomearEtapa, removerEtapa, courses } = useStore();

  return (
    <Shell titulo="Configurações" subtitulo="Personalize o sistema para a sua instituição">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Etapas do fluxo */}
        <section className="glass rounded-3xl p-5">
          <div className="mb-1 flex items-center">
            <h2 className="text-base font-semibold text-slate-900">Etapas do fluxo de matrícula</h2>
          </div>
          <p className="mb-4 text-xs text-slate-500">Cada instituição define o próprio processo. Renomeie, adicione ou remova etapas.</p>
          <div className="space-y-2">
            {etapas.map((et) => (
              <div key={et.id} className="group flex items-center gap-3 rounded-2xl border border-white/60 bg-white/50 p-3">
                <GripVertical size={16} className="text-slate-300" />
                <span className="h-4 w-4 shrink-0 rounded-full" style={{ background: et.cor }} />
                <input
                  value={et.nome}
                  onChange={(e) => renomearEtapa(et.id, e.target.value)}
                  className="min-w-0 flex-1 rounded-lg border border-transparent bg-transparent px-2 py-1 text-sm font-medium text-slate-800 outline-none transition focus:border-teal-200 focus:bg-white"
                />
                <button onClick={() => removerEtapa(et.id)} className="text-slate-300 opacity-0 transition hover:text-red-500 group-hover:opacity-100">
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
          <button onClick={addEtapa} className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 py-3 text-sm font-medium text-slate-400 transition hover:border-teal-400 hover:text-teal-600">
            <Plus size={16} /> Adicionar etapa
          </button>
        </section>

        <div className="space-y-6">
          {/* Cursos */}
          <section className="glass rounded-3xl p-5">
            <h2 className="mb-4 text-base font-semibold text-slate-900">Cursos</h2>
            <div className="space-y-2">
              {courses.map((c) => (
                <div key={c.id} className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/50 p-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-500"><BookOpen size={16} /></span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800">{c.nome}</p>
                    <p className="text-xs text-slate-400">Cód. {c.codigo}{c.cargaHoraria ? ` · ${c.cargaHoraria}h` : ""} · Matrícula R$ {c.valorMatricula}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${c.ativo ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"}`}>
                    {c.ativo ? "Ativo" : "Inativo"}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Identidade */}
          <section className="glass rounded-3xl p-5">
            <h2 className="mb-4 text-base font-semibold text-slate-900">Identidade da instituição</h2>
            <div className="flex items-center gap-4">
              <span className="grid h-14 w-14 place-items-center rounded-2xl text-xl font-bold text-white shadow" style={{ background: cliente.cor }}>
                {cliente.nome.charAt(0)}
              </span>
              <div>
                <p className="text-sm font-medium text-slate-800">{cliente.nome}</p>
                <p className="text-xs text-slate-500">Nome e cor vêm da configuração de cada cliente</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Shell>
  );
}
