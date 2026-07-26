"use client";

import { useMemo, useState } from "react";
import { Inbox, CheckCircle2, ArrowRight } from "lucide-react";
import { Shell, KpiCard } from "@/components/Shell";
import { MatriculaRow, MatriculaModal } from "@/components/matriculas";
import { useStore } from "@/lib/store";

export function DeptView({ etapaId, titulo, subtitulo, cor }: { etapaId: string; titulo: string; subtitulo: string; cor: string }) {
  const { etapas, enrollments, moverMatricula } = useStore();
  const [abertaId, setAbertaId] = useState<string | null>(null);
  const aberta = enrollments.find((e) => e.id === abertaId) ?? null;

  const idx = etapas.findIndex((e) => e.id === etapaId);
  const proxima = etapas[idx + 1];

  const aguardando = useMemo(() => enrollments.filter((e) => e.etapaId === etapaId), [enrollments, etapaId]);

  return (
    <Shell titulo={titulo} subtitulo={subtitulo}>
      <div className="space-y-6">
        <section className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <KpiCard icon={Inbox} label={`Aguardando ${titulo}`} value={aguardando.length} from={cor} to={cor} />
          <KpiCard icon={ArrowRight} label="Próxima etapa" value={proxima?.nome ?? "—"} from="#1e3a8a" to="#3b82f6" />
          <KpiCard icon={CheckCircle2} label="Total no sistema" value={enrollments.length} from="#10b981" to="#22c55e" />
        </section>

        <section className="glass rounded-3xl p-5">
          <h2 className="mb-4 text-base font-semibold text-slate-900">Aguardando sua ação</h2>
          {aguardando.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-500">Nada pendente nesta etapa. 🎉</p>
          ) : (
            <div className="space-y-2">
              {aguardando.map((e) => (
                <div key={e.id} className="flex items-center gap-2">
                  <div className="min-w-0 flex-1">
                    <MatriculaRow e={e} etapas={etapas} onMove={moverMatricula} onOpen={setAbertaId} />
                  </div>
                  {proxima && (
                    <button
                      onClick={() => moverMatricula(e.id, proxima.id)}
                      className="hidden shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium text-white shadow transition hover:brightness-110 sm:flex"
                      style={{ background: "linear-gradient(135deg,#0d9488,#0e7490)" }}
                      title={`Avançar para ${proxima.nome}`}
                    >
                      Avançar <ArrowRight size={13} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {aberta && <MatriculaModal e={aberta} etapas={etapas} onMove={moverMatricula} onClose={() => setAbertaId(null)} />}
    </Shell>
  );
}
