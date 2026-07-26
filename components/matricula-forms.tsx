"use client";

import { useEffect, useState } from "react";
import { X, Download, FileSpreadsheet, Printer, Paperclip, FileText } from "lucide-react";

// ---- validações ----
function isValidCPF(cpf: string) {
  const c = (cpf || "").replace(/\D/g, "");
  if (c.length !== 11 || /^(\d)\1{10}$/.test(c)) return false;
  let s = 0;
  for (let i = 0; i < 9; i++) s += parseInt(c[i]) * (10 - i);
  let d = 11 - (s % 11); if (d >= 10) d = 0;
  if (d !== parseInt(c[9])) return false;
  s = 0;
  for (let i = 0; i < 10; i++) s += parseInt(c[i]) * (11 - i);
  d = 11 - (s % 11); if (d >= 10) d = 0;
  return d === parseInt(c[10]);
}
const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e || "");
const isValidPhone = (p: string) => { const n = (p || "").replace(/\D/g, ""); return n.length === 10 || n.length === 11; };
import { Enrollment, Etapa, Course } from "@/lib/types";
import { dataBR } from "@/lib/ui";

/* ==================== Nova Matrícula ==================== */
export function NovaMatriculaModal({
  courses, vendedores, onSave, onClose,
}: {
  courses: Course[];
  vendedores: string[];
  onSave: (data: Partial<Enrollment>) => void;
  onClose: () => void;
}) {
  const [f, setF] = useState<Partial<Enrollment>>({
    dataMatricula: "2026-07-16", origemLead: "Ação Marketing", vendedor: vendedores[0] ?? "",
  });
  const [erros, setErros] = useState<Record<string, string>>({});
  const set = (k: keyof Enrollment, v: string) => {
    setF((p) => ({ ...p, [k]: v }));
    setErros((e) => { const n = { ...e }; delete n[k]; return n; });
  };

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const escolherCurso = (nome: string) => {
    const c = courses.find((x) => x.nome === nome);
    setF((p) => ({ ...p, nomeCurso: nome, valorMatricula: c?.valorMatricula ?? p.valorMatricula }));
    setErros((e) => { const n = { ...e }; delete n.nomeCurso; return n; });
  };

  const salvar = () => {
    const e: Record<string, string> = {};
    if (!f.nomeCliente?.trim()) e.nomeCliente = "Informe o nome completo.";
    if (!f.nomeCurso) e.nomeCurso = "Selecione o curso.";
    if (!isValidCPF(f.cpf ?? "")) e.cpf = "CPF inválido (11 dígitos válidos).";
    if (!isValidEmail(f.email ?? "")) e.email = "E-mail inválido.";
    if (!isValidPhone(f.telefone ?? "")) e.telefone = "Telefone inválido (DDD + número).";
    setErros(e);
    if (Object.keys(e).length) return;
    onSave(f);
    onClose();
  };

  const inpBase = "w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-teal-100";
  const inp = (k?: string) => `${inpBase} ${k && erros[k] ? "border-red-400 focus:border-red-400" : "border-slate-200 focus:border-teal-300"}`;
  const lbl = "mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-400";
  const ErroMsg = ({ k }: { k: string }) => erros[k] ? <p className="mt-1 text-[11px] text-red-500">{erros[k]}</p> : null;

  return (
    <div onClick={onClose} className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div onClick={(e) => e.stopPropagation()} className="modal-pop glass flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl">
        <div className="relative bg-gradient-to-br from-[#0b1f4d] to-[#16336b] px-6 py-5 text-white">
          <button onClick={onClose} className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full bg-white/15 text-white/90 transition hover:bg-white/25"><X size={18} /></button>
          <h3 className="text-lg font-bold">Nova Matrícula</h3>
          <p className="text-sm text-white/70">Preencha os dados do aluno e as condições.</p>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          <div>
            <p className="mb-2 text-xs font-semibold text-slate-500">1 · Dados do aluno</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div><label className={lbl}>Nome completo *</label><input className={inp("nomeCliente")} value={f.nomeCliente ?? ""} onChange={(e) => set("nomeCliente", e.target.value)} /><ErroMsg k="nomeCliente" /></div>
              <div><label className={lbl}>CPF *</label><input className={inp("cpf")} placeholder="000.000.000-00" value={f.cpf ?? ""} onChange={(e) => set("cpf", e.target.value)} /><ErroMsg k="cpf" /></div>
              <div><label className={lbl}>E-mail *</label><input className={inp("email")} placeholder="nome@email.com" value={f.email ?? ""} onChange={(e) => set("email", e.target.value)} /><ErroMsg k="email" /></div>
              <div><label className={lbl}>WhatsApp / Telefone *</label><input className={inp("telefone")} placeholder="(11) 90000-0000" value={f.telefone ?? ""} onChange={(e) => set("telefone", e.target.value)} /><ErroMsg k="telefone" /></div>
              <div><label className={lbl}>Data da matrícula</label><input type="date" className={`${inp()} [color-scheme:light]`} value={f.dataMatricula ?? ""} onChange={(e) => set("dataMatricula", e.target.value)} /></div>
              <div><label className={lbl}>Origem do lead</label>
                <select className={inp()} value={f.origemLead ?? ""} onChange={(e) => set("origemLead", e.target.value)}>
                  {["Ação Marketing", "Ex-aluno", "Ação Comercial", "Indicação", "Outros"].map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold text-slate-500">2 · Curso e condições</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2"><label className={lbl}>Curso *</label>
                <select className={inp("nomeCurso")} value={f.nomeCurso ?? ""} onChange={(e) => escolherCurso(e.target.value)}>
                  <option value="">Selecione o curso...</option>
                  {courses.map((c) => <option key={c.id} value={c.nome}>{c.nome}</option>)}
                </select>
                <ErroMsg k="nomeCurso" />
              </div>
              <div><label className={lbl}>Turma / mês</label><input className={inp()} placeholder="2026-03" value={f.turmaMes ?? ""} onChange={(e) => set("turmaMes", e.target.value)} /></div>
              <div><label className={lbl}>Vendedor</label>
                <select className={inp()} value={f.vendedor ?? ""} onChange={(e) => set("vendedor", e.target.value)}>
                  {vendedores.map((v) => <option key={v}>{v}</option>)}
                </select>
              </div>
              <div><label className={lbl}>Taxa de matrícula (R$)</label><input className={inp()} value={f.valorMatricula ?? ""} onChange={(e) => set("valorMatricula", e.target.value)} /></div>
              <div><label className={lbl}>Mensalidade (R$)</label><input className={inp()} value={f.mensalidade ?? ""} onChange={(e) => set("mensalidade", e.target.value)} /></div>
              <div><label className={lbl}>Vencimento da mensalidade</label><input type="date" className={`${inp()} [color-scheme:light]`} value={f.vencimento ?? ""} onChange={(e) => set("vencimento", e.target.value)} /></div>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold text-slate-500">3 · Documentos e observações</p>
            <label className={lbl}>Documentação do aluno</label>
            <input
              id="docs-input" type="file" multiple className="hidden"
              onChange={(e) => setF((p) => ({ ...p, documentos: Array.from(e.target.files ?? []).map((x) => x.name) }))}
            />
            <label htmlFor="docs-input" className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 py-4 text-sm text-slate-500 transition hover:border-teal-400 hover:text-teal-600">
              <Paperclip size={16} /> Anexar documentos (RG, comprovante, contrato...)
            </label>
            {f.documentos && f.documentos.length > 0 && (
              <ul className="mt-2 space-y-1">
                {f.documentos.map((d) => (
                  <li key={d} className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-1.5 text-xs text-slate-600"><FileText size={13} /> {d}</li>
                ))}
              </ul>
            )}

            <label className={`${lbl} mt-3`}>Observação</label>
            <textarea className={`${inp()} resize-none`} rows={3} placeholder="Detalhes sobre negociação, isenção de taxa, etc." value={f.observacao ?? ""} onChange={(e) => set("observacao", e.target.value)} />
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-white/40 bg-white/30 px-6 py-4">
          <button onClick={onClose} className="rounded-full border border-slate-200 bg-white/70 px-5 py-2 text-sm text-slate-600 transition hover:bg-white">Cancelar</button>
          <button onClick={salvar} className="rounded-full px-5 py-2 text-sm font-medium text-white shadow-md transition hover:brightness-110" style={{ background: "linear-gradient(135deg,#0d9488,#0e7490)" }}>Salvar matrícula</button>
        </div>
      </div>
    </div>
  );
}

/* ==================== Exportar ==================== */
type Campo = { key: string; label: string; get: (e: Enrollment) => string };

export function ExportModal({
  itens, etapas, onClose,
}: { itens: Enrollment[]; etapas: Etapa[]; onClose: () => void }) {
  const nomeEtapa = (id: string) => etapas.find((e) => e.id === id)?.nome ?? "";
  const CAMPOS: Campo[] = [
    { key: "nome", label: "Nome do Aluno", get: (e) => e.nomeCliente },
    { key: "cpf", label: "CPF", get: (e) => e.cpf },
    { key: "email", label: "E-mail", get: (e) => e.email },
    { key: "telefone", label: "Telefone/WhatsApp", get: (e) => e.telefone },
    { key: "curso", label: "Curso", get: (e) => e.nomeCurso },
    { key: "turma", label: "Turma/Período", get: (e) => e.turmaMes },
    { key: "vendedor", label: "Vendedor", get: (e) => e.vendedor },
    { key: "data", label: "Data de Matrícula", get: (e) => dataBR(e.dataMatricula) },
    { key: "matricula", label: "Taxa de Matrícula", get: (e) => e.valorMatricula },
    { key: "mensalidade", label: "Mensalidade", get: (e) => e.mensalidade },
    { key: "origem", label: "Origem do Lead", get: (e) => e.origemLead },
    { key: "status", label: "Status", get: (e) => nomeEtapa(e.etapaId) },
  ];
  const [sel, setSel] = useState<Record<string, boolean>>(
    Object.fromEntries(CAMPOS.map((c) => [c.key, ["nome", "cpf", "email", "curso", "turma", "vendedor", "data", "status"].includes(c.key)])),
  );
  const [formato, setFormato] = useState<"csv" | "print">("csv");

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const campos = CAMPOS.filter((c) => sel[c.key]);

  const exportar = () => {
    if (formato === "print") { window.print(); return; }
    const header = campos.map((c) => c.label).join(";");
    const linhas = itens.map((e) => campos.map((c) => `"${(c.get(e) || "").replace(/"/g, '""')}"`).join(";"));
    const csv = "﻿" + [header, ...linhas].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "matriculas.csv"; a.click();
    URL.revokeObjectURL(url);
    onClose();
  };

  return (
    <div onClick={onClose} className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div onClick={(e) => e.stopPropagation()} className="modal-pop w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="text-base font-bold text-slate-900">Exportar dados</h3>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100"><X size={16} /></button>
        </div>

        <div className="space-y-4 p-6">
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Formato</p>
            <div className="flex gap-2">
              <button onClick={() => setFormato("csv")} className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${formato === "csv" ? "border-teal-400 bg-teal-50 text-teal-700" : "border-slate-200 text-slate-600"}`}><FileSpreadsheet size={15} /> Excel (.csv)</button>
              <button onClick={() => setFormato("print")} className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${formato === "print" ? "border-teal-400 bg-teal-50 text-teal-700" : "border-slate-200 text-slate-600"}`}><Printer size={15} /> PDF (imprimir)</button>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Campos a incluir</p>
              <div className="flex gap-2 text-[11px]">
                <button onClick={() => setSel(Object.fromEntries(CAMPOS.map((c) => [c.key, true])))} className="text-teal-600 hover:underline">Todos</button>
                <button onClick={() => setSel(Object.fromEntries(CAMPOS.map((c) => [c.key, false])))} className="text-slate-400 hover:underline">Nenhum</button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {CAMPOS.map((c) => (
                <label key={c.key} className="flex cursor-pointer items-center gap-2 rounded-lg px-1 py-1.5 text-sm text-slate-700 hover:bg-slate-50">
                  <input type="checkbox" checked={sel[c.key]} onChange={() => setSel((s) => ({ ...s, [c.key]: !s[c.key] }))} className="accent-teal-600" />
                  {c.label}
                </label>
              ))}
            </div>
          </div>

          <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">{itens.length} registro(s) serão exportados com os filtros atuais.</p>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 px-6 py-4">
          <button onClick={onClose} className="rounded-full border border-slate-200 px-5 py-2 text-sm text-slate-600 hover:bg-slate-50">Cancelar</button>
          <button onClick={exportar} disabled={campos.length === 0} className="flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium text-white shadow-md transition hover:brightness-110 disabled:opacity-40" style={{ background: "linear-gradient(135deg,#0b1f4d,#16336b)" }}>
            <Download size={15} /> Exportar {itens.length} registro(s)
          </button>
        </div>
      </div>
    </div>
  );
}
