"use client";

import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import {
  Enrollment, Etapa, ETAPAS_PADRAO, CORES_ETAPA,
  Colaborador, Team, Course, Ticket, Turma,
} from "./types";
import {
  ENROLLMENTS_EXEMPLO, COLABORADORES_EXEMPLO, TEAMS_EXEMPLO, COURSES_EXEMPLO, TICKETS_EXEMPLO, TURMAS_EXEMPLO,
} from "./seed";

type Store = {
  etapas: Etapa[];
  enrollments: Enrollment[];
  colaboradores: Colaborador[];
  teams: Team[];
  courses: Course[];
  turmas: Turma[];
  tickets: Ticket[];
  moverMatricula: (id: string, etapaId: string) => void;
  addEnrollment: (data: Partial<Enrollment>) => void;
  updateEnrollment: (id: string, patch: Partial<Enrollment>) => void;
  addEtapa: () => void;
  renomearEtapa: (id: string, nome: string) => void;
  removerEtapa: (id: string) => void;
  etapaDe: (id: string) => Etapa | undefined;
};

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [etapas, setEtapas] = useState<Etapa[]>(ETAPAS_PADRAO);
  const [enrollments, setEnrollments] = useState<Enrollment[]>(ENROLLMENTS_EXEMPLO);
  const [colaboradores] = useState<Colaborador[]>(COLABORADORES_EXEMPLO);
  const [teams] = useState<Team[]>(TEAMS_EXEMPLO);
  const [courses] = useState<Course[]>(COURSES_EXEMPLO);
  const [turmas] = useState<Turma[]>(TURMAS_EXEMPLO);
  const [tickets] = useState<Ticket[]>(TICKETS_EXEMPLO);

  const moverMatricula = (id: string, etapaId: string) =>
    setEnrollments((prev) => prev.map((e) => (e.id === id ? { ...e, etapaId } : e)));

  const updateEnrollment = (id: string, patch: Partial<Enrollment>) =>
    setEnrollments((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));

  const addEnrollment = (data: Partial<Enrollment>) =>
    setEnrollments((prev) => [{
      id: `m-${Date.now()}`,
      nomeCliente: data.nomeCliente || "",
      email: data.email || "",
      cpf: data.cpf || "",
      telefone: data.telefone || "",
      nomeCurso: data.nomeCurso || "",
      turmaMes: data.turmaMes || "",
      vendedor: data.vendedor || "—",
      valorMatricula: data.valorMatricula || "0,00",
      mensalidade: data.mensalidade || "0,00",
      valorCurso: data.valorCurso || "0,00",
      dataMatricula: data.dataMatricula || "2026-07-01",
      origemLead: data.origemLead || "Outros",
      documentos: data.documentos,
      vencimento: data.vencimento,
      observacao: data.observacao,
      situacao: "ativa",
      etapaId: etapas[0]?.id || "cadastro",
    }, ...prev]);

  const addEtapa = () =>
    setEtapas((prev) => [
      ...prev,
      { id: `etapa-${Date.now()}`, nome: "Nova etapa", cor: CORES_ETAPA[prev.length % CORES_ETAPA.length] },
    ]);

  const renomearEtapa = (id: string, nome: string) =>
    setEtapas((prev) => prev.map((et) => (et.id === id ? { ...et, nome } : et)));

  const removerEtapa = (id: string) =>
    setEtapas((prev) => {
      if (prev.length <= 1) return prev;
      const idx = prev.findIndex((e) => e.id === id);
      const destino = prev[idx - 1]?.id ?? prev[idx + 1]?.id;
      setEnrollments((es) => es.map((e) => (e.etapaId === id ? { ...e, etapaId: destino } : e)));
      return prev.filter((e) => e.id !== id);
    });

  const value = useMemo<Store>(() => ({
    etapas, enrollments, colaboradores, teams, courses, turmas, tickets,
    moverMatricula, addEnrollment, updateEnrollment, addEtapa, renomearEtapa, removerEtapa,
    etapaDe: (id) => etapas.find((e) => e.id === id),
  }), [etapas, enrollments, colaboradores, teams, courses, turmas, tickets]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore precisa do StoreProvider");
  return s;
}
