"use client";

import { useRef, useState, ReactNode } from "react";
import { X } from "lucide-react";

/* ---------- Card de gráfico (com título e botão ocultar) ---------- */
export function ChartCard({
  titulo, icon: Icon, iconCor, right, subtitulo, onHide, className = "", children,
}: {
  titulo: string;
  icon?: React.ElementType;
  iconCor?: string;
  right?: ReactNode;
  subtitulo?: string;
  onHide: () => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={`glass rounded-3xl p-6 ${className}`}>
      <div className="flex items-center gap-2">
        {Icon && <Icon size={18} style={{ color: iconCor }} />}
        <h2 className="text-base font-semibold text-slate-900">{titulo}</h2>
        <div className="ml-auto flex items-center gap-2">
          {right}
          <button onClick={onHide} title="Ocultar gráfico" className="grid h-7 w-7 place-items-center rounded-full text-slate-300 transition hover:bg-slate-100 hover:text-slate-500">
            <X size={15} />
          </button>
        </div>
      </div>
      {subtitulo && <p className="mt-1 mb-4 text-xs text-slate-500">{subtitulo}</p>}
      {!subtitulo && <div className="mb-4" />}
      {children}
    </section>
  );
}

/* ---------- Gráfico de área: mês atual vs. anterior ---------- */
export function AreaComparison({
  atual, anterior, hoje,
}: { atual: number[]; anterior: number[]; hoje: number }) {
  const dias = atual.length;
  const W = 720, H = 240, padL = 32, padR = 12, padT = 12, padB = 26;
  const max = Math.max(1, ...atual, ...anterior);
  const [hi, setHi] = useState<number | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const xFor = (i: number) => padL + (i / (dias - 1)) * (W - padL - padR);
  const yFor = (v: number) => H - padB - (v / max) * (H - padT - padB);

  const linePath = (arr: number[], from = 0, to = dias - 1) => {
    let d = "";
    for (let i = from; i <= to; i++) d += `${i === from ? "M" : "L"} ${xFor(i).toFixed(1)} ${yFor(arr[i]).toFixed(1)} `;
    return d;
  };
  const areaPath = (arr: number[], to: number) =>
    `${linePath(arr, 0, to)} L ${xFor(to).toFixed(1)} ${(H - padB).toFixed(1)} L ${xFor(0).toFixed(1)} ${(H - padB).toFixed(1)} Z`;

  const onMove = (e: React.MouseEvent) => {
    const r = wrapRef.current?.getBoundingClientRect();
    if (!r) return;
    const frac = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    setHi(Math.round(frac * (dias - 1)));
  };

  return (
    <div>
      <div className="mb-2 flex items-center gap-4 text-xs">
        <span className="flex items-center gap-1.5 text-slate-600"><span className="h-2.5 w-2.5 rounded-full bg-teal-600" /> Este mês</span>
        <span className="flex items-center gap-1.5 text-slate-600"><span className="h-2.5 w-2.5 rounded-full bg-slate-400" /> Mês anterior</span>
        <span className="ml-auto text-slate-400">acumulado no mês</span>
      </div>

      <div ref={wrapRef} className="relative" onMouseMove={onMove} onMouseLeave={() => setHi(null)}>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: "auto" }}>
          <defs>
            <linearGradient id="gradAtual" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0d9488" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0d9488" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* grade horizontal discreta */}
          {[0, 0.5, 1].map((f) => (
            <line key={f} x1={padL} x2={W - padR} y1={yFor(max * f)} y2={yFor(max * f)} stroke="#e2e8f0" strokeWidth="1" />
          ))}
          {/* rótulos Y */}
          <text x={4} y={yFor(max) + 4} fontSize="9" fill="#94a3b8">{max}</text>
          <text x={4} y={yFor(0) + 4} fontSize="9" fill="#94a3b8">0</text>

          {/* mês anterior (linha cinza) */}
          <path d={linePath(anterior)} fill="none" stroke="#94a3b8" strokeWidth="2" />

          {/* este mês: área + linha sólida até hoje, projeção tracejada depois */}
          <path d={areaPath(atual, hoje)} fill="url(#gradAtual)" />
          <path d={linePath(atual, 0, hoje)} fill="none" stroke="#0d9488" strokeWidth="2.5" strokeLinejoin="round" />
          <path d={linePath(atual, hoje, dias - 1)} fill="none" stroke="#0d9488" strokeWidth="2" strokeDasharray="4 4" opacity="0.5" />

          {/* marca "hoje" */}
          <line x1={xFor(hoje)} x2={xFor(hoje)} y1={padT} y2={H - padB} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />

          {/* rótulos X esparsos */}
          {atual.map((_, i) => (i % 5 === 0 || i === dias - 1) ? (
            <text key={i} x={xFor(i)} y={H - 8} fontSize="9" fill="#94a3b8" textAnchor="middle">{i + 1}</text>
          ) : null)}

          {/* crosshair */}
          {hi !== null && (
            <>
              <line x1={xFor(hi)} x2={xFor(hi)} y1={padT} y2={H - padB} stroke="#0f214a" strokeWidth="1" opacity="0.25" />
              <circle cx={xFor(hi)} cy={yFor(atual[hi])} r="4" fill="#0d9488" stroke="#fff" strokeWidth="2" />
              <circle cx={xFor(hi)} cy={yFor(anterior[hi])} r="4" fill="#94a3b8" stroke="#fff" strokeWidth="2" />
            </>
          )}
        </svg>

        {/* tooltip */}
        {hi !== null && (
          <div
            className="pointer-events-none absolute -translate-x-1/2 rounded-xl border border-slate-100 bg-white px-3 py-2 text-xs shadow-lg"
            style={{ left: `${(hi / (dias - 1)) * 100}%`, top: 0 }}
          >
            <p className="mb-1 font-semibold text-slate-700">Dia {hi + 1}</p>
            <p className="flex items-center gap-1.5 text-slate-600"><span className="h-2 w-2 rounded-full bg-teal-600" /> Este mês: <b>{atual[hi]}</b></p>
            <p className="flex items-center gap-1.5 text-slate-600"><span className="h-2 w-2 rounded-full bg-slate-400" /> Anterior: <b>{anterior[hi]}</b></p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Lista de barras (magnitude, uma cor) ---------- */
export function BarList({
  dados, cor, formato,
}: { dados: { label: string; valor: number; extra?: string }[]; cor: string; formato?: (n: number) => string }) {
  const max = Math.max(1, ...dados.map((d) => d.valor));
  if (dados.length === 0) return <p className="py-6 text-center text-sm text-slate-400">Sem dados.</p>;
  return (
    <div className="space-y-3">
      {dados.map((d) => (
        <div key={d.label}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="truncate pr-2 text-slate-700">{d.label}</span>
            <span className="shrink-0 font-semibold text-slate-900">{d.extra ?? (formato ? formato(d.valor) : d.valor)}</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200/70">
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(d.valor / max) * 100}%`, background: cor }} />
          </div>
        </div>
      ))}
    </div>
  );
}
