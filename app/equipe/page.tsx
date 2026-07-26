"use client";

import { Target, Users } from "lucide-react";
import { Shell } from "@/components/Shell";
import { useStore } from "@/lib/store";
import { corDoNome, iniciais } from "@/lib/ui";

const SETOR_COR: Record<string, string> = {
  Comercial: "#0d9488", Financeiro: "#f59e0b", Secretaria: "#0ea5e9",
  Pedagógico: "#8b5cf6", SAAD: "#ec4899", Admin: "#1e3a8a",
};

export default function EquipePage() {
  const { teams, colaboradores } = useStore();

  return (
    <Shell titulo="Equipe" subtitulo="Colaboradores, equipes e metas">
      <div className="space-y-6">
        {/* Equipes */}
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Equipes comerciais</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {teams.map((t) => (
              <div key={t.id} className="glass rounded-3xl p-5">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-teal-500 to-blue-900 text-white shadow">
                    <Users size={20} />
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900">{t.nome}</p>
                    <p className="text-xs text-slate-500">Supervisor: {t.supervisor}</p>
                  </div>
                  <span className="ml-auto flex items-center gap-1 rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
                    <Target size={13} /> Meta {t.metaMes}/mês
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Colaboradores */}
        <section className="glass rounded-3xl p-5">
          <h2 className="mb-4 text-base font-semibold text-slate-900">Colaboradores</h2>
          <div className="space-y-2">
            {colaboradores.map((c) => (
              <div key={c.id} className="flex items-center gap-3 rounded-2xl border border-transparent p-3 transition hover:border-white/70 hover:bg-white/60">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-sm font-semibold text-white shadow-sm" style={{ background: corDoNome(c.nome) }}>
                  {iniciais(c.nome)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-slate-900">{c.nome}</p>
                  <p className="truncate text-xs text-slate-500">{c.email}{c.equipe ? ` · ${c.equipe}` : ""}</p>
                </div>
                <span className="rounded-full px-3 py-1 text-xs font-medium" style={{ background: `${SETOR_COR[c.setor]}1a`, color: SETOR_COR[c.setor] }}>
                  {c.setor}
                </span>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${c.ativo ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"}`}>
                  {c.ativo ? "Ativo" : "Inativo"}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Shell>
  );
}
