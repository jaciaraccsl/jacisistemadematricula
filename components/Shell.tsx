"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { Search, Bell, AlertCircle } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { useStore } from "@/lib/store";

export function Shell({ titulo, subtitulo, children }: { titulo: string; subtitulo?: string; children: ReactNode }) {
  const { enrollments } = useStore();
  const pendencias = enrollments.filter((e) => e.situacao === "pendencia");

  return (
    <div className="relative flex min-h-screen text-slate-800">
      <div className="aurora"><span /></div>
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center gap-4 px-6 py-5">
          <div>
            <h1 className="text-xl font-bold text-slate-900">{titulo}</h1>
            {subtitulo && <p className="text-sm text-slate-700">{subtitulo}</p>}
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                placeholder="Buscar..."
                className="glass w-64 rounded-full py-2.5 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-500 focus:ring-4 focus:ring-white/40"
              />
            </div>
            <button className="glass relative grid h-10 w-10 place-items-center rounded-full text-slate-600 transition hover:text-teal-600">
              <Bell size={18} />
              {pendencias.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">{pendencias.length}</span>
              )}
            </button>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-teal-500 to-blue-900 text-sm font-semibold text-white shadow-lg">F</span>
          </div>
        </header>

        {/* Alerta global de pendências — aparece em todos os departamentos */}
        {pendencias.length > 0 && (
          <Link href="/financeiro" className="mx-6 mb-2 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-100">
            <AlertCircle size={16} />
            {pendencias.length} matrícula(s) com pendência precisam de atenção
            <span className="ml-auto text-xs font-normal text-red-500">ver →</span>
          </Link>
        )}

        <div className="flex-1 px-6 pb-10">{children}</div>
      </main>
    </div>
  );
}

/* Card de vidro reutilizável */
export function GlassCard({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`glass rounded-3xl ${className}`}>{children}</div>;
}

/* Card de indicador (KPI) */
export function KpiCard({
  icon: Icon, label, value, from, to,
}: { icon: React.ElementType; label: string; value: number | string; from: string; to: string }) {
  return (
    <div className="glass group relative flex items-center gap-3 overflow-hidden rounded-2xl px-4 py-3 transition-all duration-300 hover:-translate-y-0.5">
      <span
        className="relative grid h-9 w-9 shrink-0 place-items-center rounded-xl text-white shadow-md transition-transform duration-300 group-hover:scale-110"
        style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      >
        <Icon size={16} />
      </span>
      <div className="relative min-w-0">
        <p className="truncate text-xl font-bold leading-none tracking-tight text-slate-900">{value}</p>
        <p className="mt-1 text-[11px] leading-tight text-slate-600">{label}</p>
      </div>
    </div>
  );
}
