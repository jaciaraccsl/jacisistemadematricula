import { Enrollment, Colaborador, Team, Course, Ticket, Turma } from "./types";

// ===== Dados FICTÍCIOS (nunca dados reais) =====

export const ENROLLMENTS_EXEMPLO: Enrollment[] = [
  { id: "1", nomeCliente: "Ana Souza", email: "ana@exemplo.com", cpf: "111.111.111-11", telefone: "(11) 90000-0001", nomeCurso: "Pós — Gestão Escolar", turmaMes: "2026-02", vendedor: "Marina (equipe A)", valorMatricula: "300,00", mensalidade: "500,00", valorCurso: "6.000,00", dataMatricula: "2026-07-08", origemLead: "Ação Marketing", driveUrl: "https://drive.google.com/exemplo", etapaId: "cadastro" },
  { id: "2", nomeCliente: "Bruno Lima", email: "bruno@exemplo.com", cpf: "222.222.222-22", telefone: "(11) 90000-0002", nomeCurso: "Pós — Gestão Escolar", turmaMes: "2026-02", vendedor: "Marina (equipe A)", valorMatricula: "300,00", mensalidade: "500,00", valorCurso: "6.000,00", dataMatricula: "2026-07-07", origemLead: "Ex-aluno", driveUrl: "https://drive.google.com/exemplo", etapaId: "financeiro" },
  { id: "3", nomeCliente: "Carla Dias", email: "carla@exemplo.com", cpf: "333.333.333-33", telefone: "(11) 90000-0003", nomeCurso: "Curso Livre — Marketing Digital", turmaMes: "2026-03", vendedor: "Rafael (equipe B)", valorMatricula: "150,00", mensalidade: "100,00", valorCurso: "1.200,00", dataMatricula: "2026-07-06", origemLead: "Indicação", driveUrl: "https://drive.google.com/exemplo", etapaId: "concluida" },
  { id: "4", nomeCliente: "Diego Reis", email: "diego@exemplo.com", cpf: "444.444.444-44", telefone: "(11) 90000-0004", nomeCurso: "Curso Livre — Marketing Digital", turmaMes: "2026-03", vendedor: "Rafael (equipe B)", valorMatricula: "150,00", mensalidade: "100,00", valorCurso: "1.200,00", dataMatricula: "2026-07-05", origemLead: "Ação Marketing", driveUrl: "https://drive.google.com/exemplo", etapaId: "secretaria" },
  { id: "5", nomeCliente: "Elisa Nunes", email: "elisa@exemplo.com", cpf: "555.555.555-55", telefone: "(11) 90000-0005", nomeCurso: "Pós — Gestão Escolar", turmaMes: "2026-02", vendedor: "Marina (equipe A)", valorMatricula: "300,00", mensalidade: "500,00", valorCurso: "6.000,00", dataMatricula: "2026-07-04", origemLead: "Ação Comercial", driveUrl: "https://drive.google.com/exemplo", etapaId: "concluida" },
  { id: "6", nomeCliente: "Felipe Aro", email: "felipe@exemplo.com", cpf: "666.666.666-66", telefone: "(11) 90000-0006", nomeCurso: "Curso Livre — Marketing Digital", turmaMes: "2026-03", vendedor: "Rafael (equipe B)", valorMatricula: "150,00", mensalidade: "100,00", valorCurso: "1.200,00", dataMatricula: "2026-07-03", origemLead: "Ação Marketing", driveUrl: "https://drive.google.com/exemplo", etapaId: "financeiro" },
  { id: "7", nomeCliente: "Gabriela Melo", email: "gabi@exemplo.com", cpf: "777.777.777-77", telefone: "(11) 90000-0007", nomeCurso: "Pós — Gestão Escolar", turmaMes: "2026-02", vendedor: "Marina (equipe A)", valorMatricula: "300,00", mensalidade: "500,00", valorCurso: "6.000,00", dataMatricula: "2026-07-02", origemLead: "Ex-aluno", driveUrl: "https://drive.google.com/exemplo", etapaId: "pedagogico" },
];

export const COLABORADORES_EXEMPLO: Colaborador[] = [
  { id: "u1", nome: "Marina Alves", email: "marina@exemplo.com", setor: "Comercial", equipe: "Equipe A", ativo: true, metaMes: 20 },
  { id: "u2", nome: "Rafael Souza", email: "rafael@exemplo.com", setor: "Comercial", equipe: "Equipe B", ativo: true, metaMes: 18 },
  { id: "u3", nome: "Fabíola Costa", email: "fabiola@exemplo.com", setor: "Secretaria", ativo: true },
  { id: "u4", nome: "Carina Dias", email: "carina@exemplo.com", setor: "Pedagógico", ativo: true },
  { id: "u5", nome: "Paulo Reis", email: "paulo@exemplo.com", setor: "Financeiro", ativo: true },
  { id: "u6", nome: "Juliana Melo", email: "juliana@exemplo.com", setor: "SAAD", ativo: true },
  { id: "u7", nome: "Admin", email: "admin@exemplo.com", setor: "Admin", ativo: true },
];

export const TEAMS_EXEMPLO: Team[] = [
  { id: "t1", nome: "Equipe A", supervisor: "Marina Alves", ativo: true, metaMes: 40 },
  { id: "t2", nome: "Equipe B", supervisor: "Rafael Souza", ativo: true, metaMes: 35 },
];

export const COURSES_EXEMPLO: Course[] = [
  { id: "c1", codigo: "PRF01", nome: "Pós — Gestão Escolar", cargaHoraria: 360, valorMatricula: "300,00", ativo: true },
  { id: "c2", codigo: "LIV02", nome: "Curso Livre — Marketing Digital", cargaHoraria: 80, valorMatricula: "150,00", ativo: true },
  { id: "c3", codigo: "PRF03", nome: "Pós — Neuroeducação", cargaHoraria: 400, valorMatricula: "350,00", ativo: true },
];

export const TURMAS_EXEMPLO: Turma[] = [
  { id: "tu1", curso: "Pós — Gestão Escolar", turmaMes: "2026-02", vagasTotais: 40 },
  { id: "tu2", curso: "Curso Livre — Marketing Digital", turmaMes: "2026-03", vagasTotais: 30 },
  { id: "tu3", curso: "Pós — Neuroeducação", turmaMes: "2026-04", vagasTotais: 25 },
];

export const TICKETS_EXEMPLO: Ticket[] = [
  { id: "k1", departamento: "Secretaria", responsavel: "Fabíola Costa", urgencia: "Média", dataSolicitacao: "2026-07-09", dataLimite: "2026-07-11", nomeAluno: "Ana Souza", descricao: "Rematrícula da aluna no 1º termo — turma especial (12 meses).", status: "Aberto" },
  { id: "k2", departamento: "Pedagógico", responsavel: "Carina Dias", urgencia: "Alta", dataSolicitacao: "2026-07-08", dataLimite: "2026-07-09", nomeAluno: "Elisangela Ferreira", descricao: "Aluna concluiu as atividades mas não consta nota para emissão do certificado.", status: "Respondido" },
  { id: "k3", departamento: "Secretaria", responsavel: "Fabíola Costa", urgencia: "Crítica", dataSolicitacao: "2026-07-06", dataLimite: "2026-07-07", nomeAluno: "Mayara Nicole", descricao: "Solicitação de Declaração de Matrícula sem retorno.", status: "Atrasado" },
  { id: "k4", departamento: "Financeiro", responsavel: "Paulo Reis", urgencia: "Baixa", dataSolicitacao: "2026-07-05", nomeAluno: "Bruno Lima", descricao: "Confirmar recebimento do PIX da matrícula.", status: "Resolvido" },
  { id: "k5", departamento: "Comercial", responsavel: "Marina Alves", urgencia: "Média", dataSolicitacao: "2026-07-04", nomeAluno: "Gabriela Melo", descricao: "Cliente pediu segunda via do contrato.", status: "Aguardando retorno" },
];
