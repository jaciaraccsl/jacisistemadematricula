// ===== Tipos do domínio =====

export type Setor = "Comercial" | "Financeiro" | "Pedagógico" | "Secretaria" | "Admin" | "SAAD";

// ---- Etapas (pipeline configurável) ----
export type Etapa = { id: string; nome: string; cor: string };

export const ETAPAS_PADRAO: Etapa[] = [
  { id: "cadastro", nome: "Cadastro", cor: "#64748b" },
  { id: "financeiro", nome: "Financeiro", cor: "#f59e0b" },
  { id: "secretaria", nome: "Secretaria", cor: "#0ea5e9" },
  { id: "pedagogico", nome: "Pedagógico", cor: "#8b5cf6" },
  { id: "concluida", nome: "Concluída", cor: "#10b981" },
];

export const CORES_ETAPA = [
  "#0d9488", "#f59e0b", "#0ea5e9", "#8b5cf6", "#10b981",
  "#ef4444", "#ec4899", "#14b8a6", "#6366f1", "#f97316",
];

// ---- Matrícula ----
export type Enrollment = {
  id: string;
  nomeCliente: string;
  email: string;
  cpf: string;
  telefone: string;
  nomeCurso: string;
  turmaMes: string;
  vendedor: string;
  valorMatricula: string;
  mensalidade: string;
  valorCurso: string;
  dataMatricula: string; // ISO
  origemLead: string;
  vencimento?: string;
  observacao?: string;
  documentos?: string[];
  driveUrl?: string;
  situacao?: "ativa" | "pendencia" | "cancelada";
  etapaId: string;
};

export type Turma = {
  id: string;
  curso: string;
  turmaMes: string;
  vagasTotais: number;
};

// ---- Colaboradores / Equipes / Cursos ----
export type Colaborador = {
  id: string;
  nome: string;
  email: string;
  setor: Setor;
  equipe?: string;
  ativo: boolean;
  metaMes?: number;
};

export type Team = {
  id: string;
  nome: string;
  supervisor: string;
  ativo: boolean;
  metaMes?: number;
};

export type Course = {
  id: string;
  codigo: string;
  nome: string;
  cargaHoraria?: number;
  valorMatricula: string;
  ativo: boolean;
};

// ---- SAAD (chamados) ----
export type UrgenciaTicket = "Baixa" | "Média" | "Alta" | "Crítica";
export type StatusTicket = "Aberto" | "Aguardando retorno" | "Respondido" | "Resolvido" | "Atrasado";

export type Ticket = {
  id: string;
  departamento: Setor;
  responsavel: string;
  urgencia: UrgenciaTicket;
  dataSolicitacao: string; // ISO
  dataLimite?: string;
  nomeAluno?: string;
  descricao: string;
  status: StatusTicket;
};

export const URGENCIA_STYLE: Record<UrgenciaTicket, string> = {
  "Baixa": "#64748b",
  "Média": "#0ea5e9",
  "Alta": "#f59e0b",
  "Crítica": "#ef4444",
};

export const TICKET_STATUS_STYLE: Record<StatusTicket, { bg: string; text: string; dot: string }> = {
  "Aberto": { bg: "#dbeafe", text: "#1e40af", dot: "#3b82f6" },
  "Aguardando retorno": { bg: "#fef9c3", text: "#854d0e", dot: "#eab308" },
  "Respondido": { bg: "#e0e7ff", text: "#3730a3", dot: "#6366f1" },
  "Resolvido": { bg: "#dcfce7", text: "#166534", dot: "#22c55e" },
  "Atrasado": { bg: "#fee2e2", text: "#991b1b", dot: "#ef4444" },
};
