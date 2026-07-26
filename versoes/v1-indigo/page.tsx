"use client";

import { useMemo, useState } from "react";
import {
  LayoutDashboard, GraduationCap, Wallet, ClipboardCheck, BookOpen,
  Headphones, Users, Settings, Search, Plus, TrendingUp,
  CheckCircle2, Clock, CircleDashed, Bell,
} from "lucide-react";
import { cliente } from "@/lib/config";
import { ENROLLMENTS_EXEMPLO } from "@/lib/seed";
import { Enrollment, STATUS_GERAL_STYLE } from "@/lib/types";

const NAV = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: GraduationCap, label: "Matrículas", active: true },
  { icon: Wallet, label: "Financeiro" },
  { icon: ClipboardCheck, label: "Secretaria" },
  { icon: BookOpen, label: "Pedagógico" },
  { icon: Headphones, label: "SAAD" },
  { icon: Users, label: "Equipe" },
  { icon: Settings, label: "Configurações" },
];

const AVATAR_CORES = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#06b6d4"];
function corDoNome(nome: string) {
  const i = nome.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return AVATAR_CORES[i % AVATAR_CORES.length];
}
function iniciais(nome: string) {
  return nome.split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase();
}

export default function Home() {
  const [busca, setBusca] = useState("");
  const [curso, setCurso] = useState("all");
  const [status, setStatus] = useState("all");

  const cursos = useMemo(
    () => Array.from(new Set(ENROLLMENTS_EXEMPLO.map((e) => e.nomeCurso))),
    [],
  );

  const lista = useMemo(() => {
    return ENROLLMENTS_EXEMPLO.filter((e) => {
      if (curso !== "all" && e.nomeCurso !== curso) return false;
      if (status !== "all" && e.statusGeral !== status) return false;
      if (busca) {
        const t = busca.toLowerCase();
        return (
          e.nomeCliente.toLowerCase().includes(t) ||
          e.cpf.includes(t) ||
          e.email.toLowerCase().includes(t)
        );
      }
      return true;
    });
  }, [busca, curso, status]);

  const kpis = useMemo(() => {
    const all = ENROLLMENTS_EXEMPLO;
    return {
      total: all.length,
      ativos: all.filter((e) => e.statusGeral === "Aluno Ativo").length,
      processo: all.filter((e) => e.statusGeral === "Em Processo").length,
      pendentes: all.filter((e) => e.statusGeral === "Pendente").length,
      cancelados: all.filter((e) => e.statusGeral === "Cancelado").length,
    };
  }, []);

  return (
    <div className="relative flex min-h-screen text-slate-800">
      {/* Fundo aurora (dá cor pro vidro refletir) */}
      <div className="aurora"><span /></div>

      {/* ---------- Sidebar (vidro escuro) ---------- */}
      <aside className="hidden md:flex w-64 flex-col text-white m-3 rounded-3xl glass-dark">
        <div className="flex items-center gap-3 px-6 py-6">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/25 font-bold text-white backdrop-blur">
            {cliente.nome.charAt(0)}
          </span>
          <div>
            <p className="text-sm font-semibold leading-tight">{cliente.nome}</p>
            <p className="text-[11px] text-white/60">Gestão de Matrículas</p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-2 space-y-1">
          {NAV.map((item) => (
            <button
              key={item.label}
              className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all duration-200 ${
                item.active
                  ? "bg-white/90 text-indigo-700 font-semibold shadow-lg"
                  : "text-white/75 hover:bg-white/15 hover:text-white"
              }`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="m-3 rounded-2xl bg-white/10 p-4">
          <p className="text-xs text-white/80">🧪 Demo · dados fictícios</p>
        </div>
      </aside>

      {/* ---------- Conteúdo ---------- */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="flex items-center gap-4 px-6 py-5">
          <div>
            <h1 className="text-xl font-bold text-slate-900 drop-shadow-sm">Olá, bem-vinda 👋</h1>
            <p className="text-sm text-slate-700">Veja o fluxo das matrículas de hoje</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar aluno, CPF, e-mail..."
                className="glass w-72 rounded-full py-2.5 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-500 focus:ring-4 focus:ring-white/40"
              />
            </div>
            <button className="glass grid h-10 w-10 place-items-center rounded-full text-slate-600 transition hover:text-indigo-600">
              <Bell size={18} />
            </button>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-sm font-semibold text-white shadow-lg">
              F
            </span>
          </div>
        </header>

        <div className="flex-1 space-y-6 px-6 pb-8">
          {/* KPIs */}
          <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            <KpiCard icon={TrendingUp} label="Total de matrículas" value={kpis.total} from="#6366f1" to="#8b5cf6" />
            <KpiCard icon={Clock} label="Em processo" value={kpis.processo} from="#3b82f6" to="#06b6d4" />
            <KpiCard icon={CheckCircle2} label="Alunos ativos" value={kpis.ativos} from="#10b981" to="#22c55e" />
            <KpiCard icon={CircleDashed} label="Pendentes" value={kpis.pendentes} from="#f59e0b" to="#eab308" />
          </section>

          <div className="grid gap-6 xl:grid-cols-3">
            {/* Tabela */}
            <section className="glass xl:col-span-2 rounded-3xl p-5">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <h2 className="text-base font-semibold text-slate-900">Matrículas recentes</h2>
                <div className="ml-auto flex items-center gap-2">
                  <select
                    value={curso}
                    onChange={(e) => setCurso(e.target.value)}
                    className="rounded-full border border-white/60 bg-white/60 px-4 py-1.5 text-xs text-slate-700 outline-none backdrop-blur transition focus:border-indigo-300"
                  >
                    <option value="all">Todos os cursos</option>
                    {cursos.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="rounded-full border border-white/60 bg-white/60 px-4 py-1.5 text-xs text-slate-700 outline-none backdrop-blur transition focus:border-indigo-300"
                  >
                    <option value="all">Todos status</option>
                    <option>Pendente</option>
                    <option>Em Processo</option>
                    <option>Aluno Ativo</option>
                    <option>Cancelado</option>
                  </select>
                  <button
                    className="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium text-white shadow-md transition hover:brightness-110 active:scale-95"
                    style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
                  >
                    <Plus size={14} /> Nova
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {lista.map((e) => <Row key={e.id} e={e} />)}
                {lista.length === 0 && (
                  <p className="py-12 text-center text-sm text-slate-500">
                    Nenhuma matrícula encontrada com esses filtros.
                  </p>
                )}
              </div>
            </section>

            {/* Funil */}
            <section className="glass rounded-3xl p-6">
              <h2 className="text-base font-semibold text-slate-900">Funil de matrículas</h2>
              <p className="text-xs text-slate-600 mb-5">Onde estão as matrículas agora</p>
              <FunnelBar label="Pendentes" value={kpis.pendentes} total={kpis.total} color="#eab308" />
              <FunnelBar label="Em processo" value={kpis.processo} total={kpis.total} color="#3b82f6" />
              <FunnelBar label="Alunos ativos" value={kpis.ativos} total={kpis.total} color="#22c55e" />
              <FunnelBar label="Cancelados" value={kpis.cancelados} total={kpis.total} color="#ef4444" />

              <div className="mt-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 p-5 text-white shadow-lg">
                <p className="text-xs text-white/70">Taxa de conversão</p>
                <p className="mt-1 text-3xl font-bold">
                  {kpis.total ? Math.round((kpis.ativos / kpis.total) * 100) : 0}%
                </p>
                <p className="text-xs text-white/70">viraram Aluno Ativo</p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function KpiCard({
  icon: Icon, label, value, from, to,
}: { icon: React.ElementType; label: string; value: number; from: string; to: string }) {
  return (
    <div className="glass group rounded-3xl p-5 transition-all duration-300 hover:-translate-y-1">
      <span
        className="grid h-11 w-11 place-items-center rounded-2xl text-white shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
        style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      >
        <Icon size={20} />
      </span>
      <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
      <p className="text-xs text-slate-600">{label}</p>
    </div>
  );
}

function Row({ e }: { e: Enrollment }) {
  const s = STATUS_GERAL_STYLE[e.statusGeral];
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-transparent p-3 transition-all duration-200 hover:border-white/70 hover:bg-white/50">
      <span
        className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-sm font-semibold text-white shadow-sm"
        style={{ background: corDoNome(e.nomeCliente) }}
      >
        {iniciais(e.nomeCliente)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-slate-900">{e.nomeCliente}</p>
        <p className="truncate text-xs text-slate-500">{e.nomeCurso} · Turma {e.turmaMes}</p>
      </div>
      <div className="hidden sm:flex items-center gap-1.5">
        <FlowDot ok={e.statusFinanceiro === "Validado"} label="Fin" />
        <FlowDot ok={e.statusPedagogico === "matriculado"} label="Ped" />
        <FlowDot ok={e.secretariaConcluido} label="Sec" />
      </div>
      <span
        className="shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
        style={{ background: s.bg, color: s.text }}
      >
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.dot }} />
        {e.statusGeral}
      </span>
    </div>
  );
}

function FlowDot({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      title={label}
      className={`grid h-7 w-10 place-items-center rounded-lg text-[10px] font-semibold transition ${
        ok ? "bg-emerald-100/80 text-emerald-700" : "bg-white/50 text-slate-400"
      }`}
    >
      {label}
    </span>
  );
}

function FunnelBar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <div className="mb-4">
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-slate-700">{label}</span>
        <span className="font-semibold text-slate-900">{value}</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/40">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}
