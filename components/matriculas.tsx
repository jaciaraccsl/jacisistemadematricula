"use client";

import { useEffect } from "react";
import {
  Check, Plus, X, Mail, Phone, Calendar, DollarSign, FolderOpen,
  ExternalLink, IdCard, Hash, User, Receipt, GraduationCap, Users, FileText,
} from "lucide-react";
import { Enrollment, Etapa } from "@/lib/types";
import { corDoNome, iniciais, soft, dataBR } from "@/lib/ui";

/* ---------- Seletor de etapa (status editável) ---------- */
export function StatusSelect({
  value, etapas, onChange,
}: { value: string; etapas: Etapa[]; onChange: (id: string) => void }) {
  const atual = etapas.find((e) => e.id === value);
  const cor = atual?.cor ?? "#94a3b8";
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="cursor-pointer appearance-none rounded-full border-0 px-3 py-1.5 text-xs font-semibold outline-none transition hover:brightness-95"
      style={{ background: soft(cor, 0.16), color: cor }}
      title="Mudar etapa"
    >
      {etapas.map((et) => (
        <option key={et.id} value={et.id} style={{ color: "#0f172a" }}>{et.nome}</option>
      ))}
    </select>
  );
}

/* ---------- Passo a passo dinâmico ---------- */
export function Stepper({ etapas, atualId }: { etapas: Etapa[]; atualId: string }) {
  const atualIdx = etapas.findIndex((e) => e.id === atualId);
  return (
    <div className="flex items-center overflow-x-auto">
      {etapas.map((et, i) => {
        const done = i < atualIdx;
        const active = i === atualIdx;
        const on = done || active;
        return (
          <div key={et.id} className="flex items-center">
            <div className="flex w-[70px] flex-col items-center gap-1">
              <span
                className="grid h-7 w-7 place-items-center rounded-full text-[10px] font-bold text-white transition-all duration-300"
                style={{
                  background: on ? et.cor : "#e2e8f0",
                  color: on ? "#fff" : "#94a3b8",
                  boxShadow: active ? `0 0 0 3px ${soft(et.cor, 0.3)}` : "none",
                }}
              >
                {done ? <Check size={13} /> : i + 1}
              </span>
              <span
                className="max-w-[68px] truncate text-[9px]"
                style={{ color: active ? et.cor : done ? "#475569" : "#94a3b8", fontWeight: active ? 600 : 400 }}
              >
                {et.nome}
              </span>
            </div>
            {i < etapas.length - 1 && (
              <span className="mb-4 h-0.5 w-4 rounded" style={{ background: done ? et.cor : "#e2e8f0" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Linha da lista ---------- */
export function MatriculaRow({
  e, etapas, onMove, onOpen,
}: { e: Enrollment; etapas: Etapa[]; onMove: (id: string, etapaId: string) => void; onOpen: (id: string) => void }) {
  const atual = etapas.find((x) => x.id === e.etapaId);
  const pendencia = e.situacao === "pendencia";
  const cancelada = e.situacao === "cancelada";
  return (
    <div
      onClick={() => onOpen(e.id)}
      className={`relative flex cursor-pointer items-center gap-4 rounded-2xl border py-3 pl-5 pr-3 transition-all duration-200 ${
        cancelada ? "border-transparent bg-slate-100/60 opacity-60 grayscale"
          : pendencia ? "border-red-200 bg-red-50/40 hover:bg-red-50/70"
          : "border-transparent hover:border-white/70 hover:bg-white/60"
      }`}
    >
      <span className="absolute left-1.5 top-2.5 bottom-2.5 w-1.5 rounded-full" style={{ background: cancelada ? "#cbd5e1" : pendencia ? "#ef4444" : atual?.cor ?? "#cbd5e1" }} />
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-sm font-semibold text-white shadow-sm" style={{ background: corDoNome(e.nomeCliente) }}>
        {iniciais(e.nomeCliente)}
      </span>
      <div className="min-w-0 flex-1 md:w-52 md:flex-none">
        <p className="truncate font-medium text-slate-900">{e.nomeCliente}</p>
        <p className="truncate text-xs text-slate-500">{e.nomeCurso} · Turma {e.turmaMes}</p>
      </div>
      {pendencia && <span className="hidden shrink-0 rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-semibold text-red-700 sm:inline">⚠ Pendência</span>}
      {cancelada && <span className="hidden shrink-0 rounded-full bg-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-500 sm:inline">Inativa</span>}
      <div className="hidden md:flex flex-1 items-center justify-center">
        <Stepper etapas={etapas} atualId={e.etapaId} />
      </div>
      <div onClick={(ev) => ev.stopPropagation()}>
        <StatusSelect value={e.etapaId} etapas={etapas} onChange={(id) => onMove(e.id, id)} />
      </div>
    </div>
  );
}

/* ---------- Quadro Kanban ---------- */
export function KanbanBoard({
  itens, etapas, onMove, onAdd, onRename, onRemove, onOpen,
}: {
  itens: Enrollment[];
  etapas: Etapa[];
  onMove: (id: string, etapaId: string) => void;
  onAdd: () => void;
  onRename: (id: string, nome: string) => void;
  onRemove: (id: string) => void;
  onOpen: (id: string) => void;
}) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {etapas.map((et) => {
        const cards = itens.filter((e) => e.etapaId === et.id);
        return (
          <div key={et.id} className="w-72 shrink-0 rounded-2xl bg-white/40 p-3">
            <div className="group mb-3 flex items-center gap-2 px-1">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: et.cor }} />
              <input
                value={et.nome}
                onChange={(ev) => onRename(et.id, ev.target.value)}
                className="min-w-0 flex-1 border-0 bg-transparent text-sm font-semibold text-slate-800 outline-none focus:rounded focus:bg-white/70 focus:px-1"
                title="Clique para renomear"
              />
              <span className="rounded-full bg-white/70 px-2 py-0.5 text-xs font-medium text-slate-600">{cards.length}</span>
              <button onClick={() => onRemove(et.id)} className="text-slate-300 opacity-0 transition hover:text-red-500 group-hover:opacity-100" title="Remover etapa">
                <X size={14} />
              </button>
            </div>
            <div className="min-h-[80px] space-y-2">
              {cards.map((e) => <KanbanCard key={e.id} e={e} etapas={etapas} onMove={onMove} onOpen={onOpen} />)}
              {cards.length === 0 && <p className="py-6 text-center text-xs text-slate-400">— vazio —</p>}
            </div>
          </div>
        );
      })}
      <button
        onClick={onAdd}
        className="flex w-56 shrink-0 items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 text-sm font-medium text-slate-400 transition hover:border-teal-400 hover:text-teal-600"
      >
        <Plus size={16} /> Adicionar status
      </button>
    </div>
  );
}

function KanbanCard({ e, etapas, onMove, onOpen }: { e: Enrollment; etapas: Etapa[]; onMove: (id: string, etapaId: string) => void; onOpen: (id: string) => void }) {
  const atual = etapas.find((x) => x.id === e.etapaId);
  return (
    <div onClick={() => onOpen(e.id)} className="relative cursor-pointer rounded-xl bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <span className="absolute left-0 top-3 bottom-3 w-1 rounded-full" style={{ background: atual?.cor ?? "#cbd5e1" }} />
      <div className="flex items-center gap-2 pl-2">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-xs font-semibold text-white" style={{ background: corDoNome(e.nomeCliente) }}>
          {iniciais(e.nomeCliente)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-900">{e.nomeCliente}</p>
          <p className="truncate text-[11px] text-slate-500">{e.nomeCurso}</p>
        </div>
      </div>
      <div className="mt-2.5 flex items-center gap-2 pl-2" onClick={(ev) => ev.stopPropagation()}>
        <StatusSelect value={e.etapaId} etapas={etapas} onChange={(id) => onMove(e.id, id)} />
        <span className="ml-auto text-[10px] text-slate-400">Turma {e.turmaMes}</span>
      </div>
    </div>
  );
}

/* ---------- Pop-up de detalhes ---------- */
export function MatriculaModal({
  e, etapas, onMove, onClose,
}: { e: Enrollment; etapas: Etapa[]; onMove: (id: string, etapaId: string) => void; onClose: () => void }) {
  useEffect(() => {
    const h = (ev: KeyboardEvent) => { if (ev.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div onClick={onClose} className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div onClick={(ev) => ev.stopPropagation()} className="modal-pop glass flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl">
        {/* Cabeçalho azul escuro */}
        <div className="relative bg-gradient-to-br from-[#0b1f4d] to-[#16336b] px-6 py-6 text-white">
          <button onClick={onClose} className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full bg-white/15 text-white/90 transition hover:bg-white/25">
            <X size={18} />
          </button>
          <div className="flex items-center gap-4 pr-10">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-lg font-semibold text-white shadow-lg ring-2 ring-white/20" style={{ background: corDoNome(e.nomeCliente) }}>
              {iniciais(e.nomeCliente)}
            </span>
            <div className="min-w-0">
              <h3 className="text-lg font-bold">{e.nomeCliente}</h3>
              <p className="truncate text-sm text-white/70">{e.nomeCurso} · Turma {e.turmaMes}</p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-white/60"><User size={12} /> Vendedor: {e.vendedor}</p>
            </div>
          </div>
        </div>

        {/* Corpo */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-medium text-slate-500">Etapa atual</span>
            <StatusSelect value={e.etapaId} etapas={etapas} onChange={(id) => onMove(e.id, id)} />
          </div>
          <div className="mt-3 flex justify-center overflow-x-auto rounded-2xl bg-white/40 py-4">
            <Stepper etapas={etapas} atualId={e.etapaId} />
          </div>

          <Secao titulo="Dados pessoais">
            <InfoItem icon={IdCard} label="CPF" value={e.cpf} />
            <InfoItem icon={Mail} label="E-mail" value={e.email} />
            <InfoItem icon={Phone} label="Telefone" value={e.telefone} />
          </Secao>
          <Secao titulo="Dados do curso">
            <InfoItem icon={GraduationCap} label="Curso" value={e.nomeCurso} />
            <InfoItem icon={Hash} label="Turma" value={e.turmaMes} />
            <InfoItem icon={Calendar} label="Data da matrícula" value={dataBR(e.dataMatricula)} />
          </Secao>
          <Secao titulo="Valores">
            <InfoItem icon={DollarSign} label="Matrícula" value={`R$ ${e.valorMatricula}`} />
            <InfoItem icon={Receipt} label="Mensalidade" value={`R$ ${e.mensalidade}`} />
          </Secao>

          {/* Documentos — anexos do Comercial e do Financeiro no mesmo lugar */}
          <div className="mt-5">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Documentos anexados</h4>
            <div className="rounded-2xl border border-slate-100 bg-white p-2">
              {e.documentos && e.documentos.length > 0 ? (
                <ul className="space-y-1">
                  {e.documentos.map((d, i) => (
                    <li key={`${d}-${i}`} className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600"><FileText size={14} /> {d}</li>
                  ))}
                </ul>
              ) : (
                <p className="px-3 py-2 text-sm text-slate-400">Nenhum documento anexado ainda.</p>
              )}
            </div>
          </div>

          {e.driveUrl && (
            <a href={e.driveUrl} target="_blank" rel="noreferrer" className="mt-5 flex items-center gap-2 rounded-2xl border border-teal-200 bg-teal-50/70 px-4 py-3 text-sm font-medium text-teal-700 transition hover:bg-teal-50">
              <FolderOpen size={16} /> Pasta de documentos no Drive <ExternalLink size={13} className="ml-auto" />
            </a>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-white/40 bg-white/30 px-6 py-4">
          <button onClick={onClose} className="rounded-full border border-slate-200 bg-white/70 px-5 py-2 text-sm text-slate-600 transition hover:bg-white">Fechar</button>
          <button className="rounded-full px-5 py-2 text-sm font-medium text-white shadow-md transition hover:brightness-110" style={{ background: "linear-gradient(135deg,#0d9488,#0e7490)" }}>Editar dados</button>
        </div>
      </div>
    </div>
  );
}

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{titulo}</h4>
      <div className="rounded-2xl border border-slate-100 bg-white px-4 py-1 shadow-sm">
        <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">{children}</div>
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-500"><Icon size={16} /></span>
      <div className="min-w-0">
        <p className="text-[11px] text-slate-400">{label}</p>
        <p className="truncate text-sm font-medium text-slate-800">{value}</p>
      </div>
    </div>
  );
}

export { Users };
