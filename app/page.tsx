"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  TrendingUp, Loader2, CheckCircle2, Percent, ArrowRight, ArrowUp, ArrowDown,
  Headphones, Trophy, DollarSign, Receipt, Sparkles, BookOpen, Armchair,
  Calendar, SlidersHorizontal,
} from "lucide-react";
import { Shell, KpiCard } from "@/components/Shell";
import { Stepper } from "@/components/matriculas";
import { AreaComparison, BarList, ChartCard } from "@/components/dashboard";
import { useStore } from "@/lib/store";
import { corDoNome, iniciais, dataBR, parseMoney, fmtMoney } from "@/lib/ui";
import { TICKET_STATUS_STYLE } from "@/lib/types";

const PREV_FACTOR = [0.75, 0.9, 1.15, 0.8, 1.2];
const serie = (final: number, expo: number) => Array.from({ length: 30 }, (_, i) => Math.round(final * Math.pow((i + 1) / 30, expo)));

type VisKey = "funil" | "area" | "origem" | "ranking" | "cursos" | "ocupacao" | "chamados" | "recentes";
const CHART_LIST: { key: VisKey; label: string }[] = [
  { key: "funil", label: "Funil de matrículas" },
  { key: "area", label: "Matrículas no mês" },
  { key: "origem", label: "Origem dos leads" },
  { key: "ranking", label: "Ranking de vendedores" },
  { key: "cursos", label: "Cursos mais vendidos" },
  { key: "ocupacao", label: "Ocupação de turmas" },
  { key: "chamados", label: "Chamados recentes" },
  { key: "recentes", label: "Matrículas recentes" },
];
const DEFAULT_VIS: Record<VisKey, boolean> = { funil: true, area: true, origem: true, ranking: true, cursos: true, ocupacao: true, chamados: true, recentes: true };

export default function DashboardPage() {
  const { etapas, enrollments, tickets, turmas } = useStore();

  const [de, setDe] = useState("2026-07-01");
  const [ate, setAte] = useState("2026-07-31");
  const [vis, setVis] = useState<Record<VisKey, boolean>>(DEFAULT_VIS);
  const [config, setConfig] = useState(false);

  // carregar/salvar preferências
  useEffect(() => { const s = localStorage.getItem("dash_vis"); if (s) setVis({ ...DEFAULT_VIS, ...JSON.parse(s) }); }, []);
  useEffect(() => { localStorage.setItem("dash_vis", JSON.stringify(vis)); }, [vis]);
  const toggle = (k: VisKey) => setVis((v) => ({ ...v, [k]: !v[k] }));

  const ultima = etapas[etapas.length - 1]?.id;
  const total = enrollments.length;
  const concluidas = enrollments.filter((e) => e.etapaId === ultima).length;
  const andamento = total - concluidas;
  const taxa = total ? Math.round((concluidas / total) * 100) : 0;
  const valorMat = enrollments.reduce((s, e) => s + parseMoney(e.valorMatricula), 0);
  const valorMens = enrollments.reduce((s, e) => s + parseMoney(e.mensalidade), 0);

  const idxOf = (id: string) => etapas.findIndex((e) => e.id === id);

  const funil = useMemo(() => etapas.map((et, i) => {
    const atingiu = enrollments.filter((e) => idxOf(e.etapaId) >= i).length;
    const anterior = Math.max(0, Math.round(atingiu * PREV_FACTOR[i % PREV_FACTOR.length]));
    return { et, atingiu, anterior };
  }), [etapas, enrollments]);

  const rank = useMemo(() => {
    const m = new Map<string, number>();
    enrollments.forEach((e) => m.set(e.vendedor, (m.get(e.vendedor) ?? 0) + 1));
    return [...m.entries()].map(([nome, n]) => ({ nome, n })).sort((a, b) => b.n - a.n);
  }, [enrollments]);
  const maxRank = rank[0]?.n || 1;

  const origem = useMemo(() => {
    const m = new Map<string, number>();
    enrollments.forEach((e) => m.set(e.origemLead, (m.get(e.origemLead) ?? 0) + 1));
    return [...m.entries()].map(([label, valor]) => ({ label, valor })).sort((a, b) => b.valor - a.valor);
  }, [enrollments]);

  const cursosTop = useMemo(() => {
    const m = new Map<string, number>();
    enrollments.forEach((e) => m.set(e.nomeCurso, (m.get(e.nomeCurso) ?? 0) + 1));
    return [...m.entries()].map(([label, valor]) => ({ label, valor })).sort((a, b) => b.valor - a.valor).slice(0, 5);
  }, [enrollments]);

  const ocupacao = useMemo(() => turmas.map((t) => {
    const preenchidas = enrollments.filter((e) => e.nomeCurso === t.curso && e.turmaMes === t.turmaMes).length;
    return { label: `${t.curso} · ${t.turmaMes}`, preenchidas, total: t.vagasTotais };
  }), [turmas, enrollments]);

  const atualSerie = serie(34, 0.85);
  const anteriorSerie = serie(28, 0.9);
  const recentes = enrollments.slice(0, 6);
  const chamados = tickets.slice(0, 4);
  const inputCls = "glass rounded-full px-3 py-1.5 text-xs text-slate-700 outline-none [color-scheme:light]";

  return (
    <Shell titulo="Olá, bem-vinda 👋" subtitulo="Visão geral do sistema hoje">
      <div className="space-y-6">
        {/* Controles: período aberto + personalizar */}
        <div className="flex flex-wrap items-center gap-2">
          <Calendar size={15} className="text-slate-400" />
          <span className="text-sm text-slate-500">Período:</span>
          <input type="date" value={de} onChange={(e) => setDe(e.target.value)} className={inputCls} />
          <span className="text-xs text-slate-400">até</span>
          <input type="date" value={ate} onChange={(e) => setAte(e.target.value)} className={inputCls} />

          <div className="relative ml-auto">
            <button onClick={() => setConfig((v) => !v)} className="glass flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium text-slate-700 transition hover:text-teal-700">
              <SlidersHorizontal size={14} /> Personalizar
            </button>
            {config && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setConfig(false)} />
                <div className="absolute right-0 z-50 mt-2 w-60 rounded-2xl border border-slate-100 bg-white p-3 shadow-xl">
                  <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Mostrar gráficos</p>
                  {CHART_LIST.map((c) => (
                    <label key={c.key} className="flex cursor-pointer items-center gap-2 rounded-lg px-1 py-1.5 text-sm text-slate-700 hover:bg-slate-50">
                      <input type="checkbox" checked={vis[c.key]} onChange={() => toggle(c.key)} className="accent-teal-600" />
                      {c.label}
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* KPIs (6) */}
        <section className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <KpiCard icon={TrendingUp} label="Total de matrículas" value={total} from="#0d9488" to="#2dd4bf" />
          <KpiCard icon={Loader2} label="Em andamento" value={andamento} from="#1e3a8a" to="#3b82f6" />
          <KpiCard icon={CheckCircle2} label="Concluídas" value={concluidas} from="#10b981" to="#22c55e" />
          <KpiCard icon={Percent} label="Taxa de conclusão" value={`${taxa}%`} from="#7c3aed" to="#a855f7" />
          <KpiCard icon={DollarSign} label="Valor matrículas" value={`R$ ${fmtMoney(valorMat)}`} from="#0e7490" to="#06b6d4" />
          <KpiCard icon={Receipt} label="Valor mensalidades" value={`R$ ${fmtMoney(valorMens)}`} from="#7c3aed" to="#a855f7" />
        </section>

        {/* FUNIL (agora primeiro) */}
        {vis.funil && (
          <ChartCard titulo="Funil de matrículas" subtitulo="Quantas chegaram a cada etapa e a conversão entre elas" right={<span className="text-xs text-slate-400">vs. mês anterior</span>} onHide={() => toggle("funil")}>
            <div className="flex items-stretch gap-2 overflow-x-auto pb-2">
              {funil.map(({ et, atingiu, anterior }, i) => (
                <Fragment key={et.id}>
                  <div className="min-w-[128px] flex-1 rounded-2xl border border-white/60 bg-white/60 p-3 text-center">
                    <p className="truncate text-[10px] font-medium uppercase tracking-wide text-slate-400">{et.nome}</p>
                    <p className="my-1 text-3xl font-bold" style={{ color: et.cor }}>{atingiu}</p>
                    <Trend atual={atingiu} anterior={anterior} />
                  </div>
                  {i < funil.length - 1 && (
                    <div className="flex flex-col items-center justify-center gap-1">
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">{atingiu > 0 ? Math.round((funil[i + 1].atingiu / atingiu) * 100) : 0}%</span>
                      <ArrowRight size={14} className="text-slate-300" />
                    </div>
                  )}
                </Fragment>
              ))}
            </div>
          </ChartCard>
        )}

        {/* Área comparativa + Origem dos leads */}
        {(vis.area || vis.origem) && (
          <div className="grid gap-6 lg:grid-cols-3">
            {vis.area && (
              <ChartCard titulo="Matrículas no mês" subtitulo="Acumulado — linha cheia = realizado, tracejado = projeção" right={<span className="text-xs text-slate-400">vs. anterior</span>} onHide={() => toggle("area")} className={vis.origem ? "lg:col-span-2" : "lg:col-span-3"}>
                <AreaComparison atual={atualSerie} anterior={anteriorSerie} hoje={16} />
              </ChartCard>
            )}
            {vis.origem && (
              <ChartCard titulo="Origem dos leads" icon={Sparkles} iconCor="#8b5cf6" onHide={() => toggle("origem")} className={vis.area ? "" : "lg:col-span-3"}>
                <BarList dados={origem} cor="#8b5cf6" />
              </ChartCard>
            )}
          </div>
        )}

        {/* Gráficos meio-a-meio (fluem e preenchem) */}
        <div className="grid gap-6 lg:grid-cols-2">
          {vis.ranking && (
            <ChartCard titulo="Ranking de vendedores" icon={Trophy} iconCor="#f59e0b" onHide={() => toggle("ranking")}>
              <div className="space-y-3">
                {rank.map((v, i) => (
                  <div key={v.nome} className="flex items-center gap-3">
                    <span className="w-5 text-center text-sm font-bold text-slate-400">{i + 1}</span>
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-xs font-semibold text-white shadow-sm" style={{ background: corDoNome(v.nome) }}>{iniciais(v.nome)}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="truncate font-medium text-slate-800">{v.nome}</span>
                        <span className="font-semibold text-slate-900">{v.n}</span>
                      </div>
                      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-200/70">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(v.n / maxRank) * 100}%`, background: "#0d9488" }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>
          )}

          {vis.cursos && (
            <ChartCard titulo="Cursos mais vendidos" icon={BookOpen} iconCor="#1e3a8a" onHide={() => toggle("cursos")}>
              <BarList dados={cursosTop} cor="#1e3a8a" />
            </ChartCard>
          )}

          {vis.ocupacao && (
            <ChartCard titulo="Ocupação de turmas" icon={Armchair} iconCor="#0d9488" onHide={() => toggle("ocupacao")}>
              <div className="space-y-4">
                {ocupacao.map((o) => {
                  const pct = o.total ? Math.round((o.preenchidas / o.total) * 100) : 0;
                  return (
                    <div key={o.label}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="truncate pr-2 text-slate-700">{o.label}</span>
                        <span className="shrink-0 text-xs font-semibold text-slate-900">{o.preenchidas}/{o.total} · {pct}%</span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200/70">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: pct >= 80 ? "#ef4444" : "#0d9488" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </ChartCard>
          )}

          {vis.chamados && (
            <ChartCard titulo="Chamados recentes" icon={Headphones} iconCor="#0d9488" onHide={() => toggle("chamados")}>
              <div className="space-y-2">
                {chamados.map((t) => {
                  const s = TICKET_STATUS_STYLE[t.status];
                  return (
                    <div key={t.id} className="rounded-2xl border border-white/60 bg-white/50 p-3">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium text-slate-800">{t.nomeAluno ?? "Geral"}</span>
                        <span className="ml-auto shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ background: s.bg, color: s.text }}>{t.status}</span>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-slate-500">{t.departamento} · {t.descricao}</p>
                    </div>
                  );
                })}
              </div>
              <Link href="/saad" className="mt-3 flex items-center justify-center gap-1 text-xs font-medium text-teal-700 hover:underline">Ver todos <ArrowRight size={13} /></Link>
            </ChartCard>
          )}
        </div>

        {/* Matrículas recentes — tabela */}
        {vis.recentes && (
          <ChartCard titulo="Matrículas recentes" right={<Link href="/matriculas" className="flex items-center gap-1 text-xs font-medium text-teal-700 hover:underline">Ver todas <ArrowRight size={13} /></Link>} onHide={() => toggle("recentes")}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-[11px] uppercase tracking-wide text-slate-400">
                    <th className="py-2 pr-3 font-medium">Aluno / CPF</th>
                    <th className="py-2 pr-3 font-medium">Curso / Turma</th>
                    <th className="py-2 pr-3 font-medium">Vendedor</th>
                    <th className="py-2 pr-3 font-medium">Data</th>
                    <th className="py-2 pr-3 font-medium">Fluxo</th>
                    <th className="py-2 pr-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentes.map((e) => {
                    const et = etapas.find((x) => x.id === e.etapaId);
                    return (
                      <tr key={e.id} className="border-b border-slate-100 transition-colors last:border-0 hover:bg-white/50">
                        <td className="py-3 pr-3">
                          <div className="flex items-center gap-2">
                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-xs font-semibold text-white shadow-sm" style={{ background: corDoNome(e.nomeCliente) }}>{iniciais(e.nomeCliente)}</span>
                            <div className="min-w-0">
                              <p className="truncate font-medium text-slate-900">{e.nomeCliente}</p>
                              <p className="truncate text-xs text-slate-400">{e.cpf}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 pr-3"><p className="text-slate-700">{e.nomeCurso}</p><p className="text-xs text-slate-400">Turma {e.turmaMes}</p></td>
                        <td className="py-3 pr-3 text-slate-600">{e.vendedor}</td>
                        <td className="py-3 pr-3 text-slate-600">{dataBR(e.dataMatricula)}</td>
                        <td className="py-3 pr-3"><div className="origin-left scale-90"><Stepper etapas={etapas} atualId={e.etapaId} /></div></td>
                        <td className="py-3 pr-3">{et && <span className="inline-block rounded-full px-3 py-1 text-xs font-medium" style={{ background: `${et.cor}1a`, color: et.cor }}>{et.nome}</span>}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </ChartCard>
        )}
      </div>
    </Shell>
  );
}

function Trend({ atual, anterior }: { atual: number; anterior: number }) {
  if (anterior === 0) return <span className="flex items-center justify-center gap-0.5 text-[10px] text-emerald-600"><ArrowUp size={11} /> novo</span>;
  const delta = atual - anterior;
  const up = delta >= 0;
  const pct = Math.round((Math.abs(delta) / anterior) * 100);
  return (
    <span className={`flex items-center justify-center gap-0.5 text-[10px] font-medium ${up ? "text-emerald-600" : "text-red-500"}`}>
      {up ? <ArrowUp size={11} /> : <ArrowDown size={11} />} {up ? "+" : "−"}{pct}% ({delta >= 0 ? "+" : ""}{delta})
    </span>
  );
}
