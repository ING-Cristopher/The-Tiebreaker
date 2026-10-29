import React from 'react';
import { Award, Zap, ShieldAlert, Clock, CheckCircle2, ArrowRight, Share2, Printer, FlaskConical } from 'lucide-react';
import { DecisionAnalysis } from '../types/decision';

interface VerdictCardProps {
  decision: DecisionAnalysis;
  onCommitDecision: (optionName: string) => void;
  onOpenStressTest: () => void;
  onExportMarkdown: () => void;
}

export const VerdictCard: React.FC<VerdictCardProps> = ({
  decision,
  onCommitDecision,
  onOpenStressTest,
  onExportMarkdown,
}) => {
  const verdict = decision.tiebreakerVerdict;
  const isDecided = decision.status === 'decided';

  return (
    <div className="space-y-8">
      {/* Hero Verdict Banner */}
      <div className="relative overflow-hidden bg-gradient-to-b from-indigo-950/80 via-slate-900/90 to-slate-950 border border-indigo-500/50 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-indigo-950/60">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-300 bg-indigo-900/50 border border-indigo-700/60 px-3 py-1 rounded-lg">
              <Award className="w-3.5 h-3.5 text-indigo-400" />
              <span>Veredicto The Tiebreaker</span>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-slate-400">Nivel de convicción analítica:</span>
              <span className="font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2.5 py-0.5 rounded-md tabular-nums">
                {verdict.confidenceScore}% Convicción
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs uppercase tracking-wider text-slate-400">
              Opción Ganadora Recomendada:
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {verdict.recommendedOption}
            </h2>
            <p className="text-base sm:text-lg text-indigo-200/90 font-medium pt-1 max-w-2xl leading-snug">
              «{verdict.headline}»
            </p>
          </div>

          {/* Core Rationale */}
          <div className="p-5 sm:p-6 bg-slate-950/80 border border-slate-800/80 rounded-2xl space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Argumento Estratégico Maestro
            </div>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {verdict.coreRationale}
            </p>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onCommitDecision(verdict.recommendedOption)}
                className={`px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-lg ${
                  isDecided && decision.selectedWinner === verdict.recommendedOption
                    ? 'bg-emerald-600 text-white shadow-emerald-900/40'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/40'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {isDecided && decision.selectedWinner === verdict.recommendedOption
                    ? 'Decisión Confirmada'
                    : `Comprometerme con: ${verdict.recommendedOption}`}
                </span>
              </button>

              <button
                onClick={onOpenStressTest}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition flex items-center gap-2"
              >
                <FlaskConical className="w-4 h-4 text-amber-400" />
                <span>Simulador "¿Qué pasaría si...?"</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onExportMarkdown}
                className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white transition"
                title="Copiar / Exportar informe Markdown"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => window.print()}
                className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white transition"
                title="Imprimir o guardar como PDF"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* The Decisive Tiebreaker Factor & Devil's Advocate Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Factor Bisagra */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-indigo-400">
              <Zap className="w-4 h-4" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                El Factor Bisagra de Desempate
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Si aún dudas entre opciones, esta es la única pregunta o métrica determinante que disuelve el empate:
            </p>
            <div className="p-4 bg-slate-950 rounded-xl border border-indigo-900/40 text-sm font-medium text-indigo-100 leading-relaxed">
              «{verdict.decisiveTiebreakerFactor}»
            </div>
          </div>
        </div>

        {/* Abogado del Diablo */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-rose-400">
              <ShieldAlert className="w-4 h-4" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                El Abogado del Diablo
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              El contraargumento más duro contra la opción ganadora y cómo debes blindarte ante él:
            </p>
            <div className="p-4 bg-slate-950 rounded-xl border border-rose-900/40 text-xs sm:text-sm text-slate-300 leading-relaxed">
              {verdict.devilsAdvocate}
            </div>
          </div>
        </div>
      </div>

      {/* Suzy Welch's 10/10/10 Rule */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <h3 className="text-base font-bold text-white">
            La Regla 10/10/10 (Perspectiva Emocional y Temporal)
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-400">
          Desarrollada por Suzy Welch para mitigar el sesgo del presente y calibrar la repercusión a corto, medio y largo plazo.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* 10 Minutes */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              En 10 Minutos
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {verdict.tenTenTenRule.in10Minutes}
            </p>
          </div>

          {/* 10 Months */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
              En 10 Meses
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {verdict.tenTenTenRule.in10Months}
            </p>
          </div>

          {/* 10 Years */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              En 10 Años
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {verdict.tenTenTenRule.in10Years}
            </p>
          </div>
        </div>
      </div>

      {/* 72-Hour Action Plan */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-bold text-white">
              Plan de Acción Táctico Inmediato (Próximas 72 Horas)
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {verdict.actionPlan.length} pasos concretos
          </span>
        </div>

        <div className="space-y-3">
          {verdict.actionPlan.map((act) => (
            <div
              key={act.step}
              className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-indigo-950 text-indigo-300 font-mono text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">
                  {act.step}
                </span>
                <div>
                  <h4 className="text-sm font-semibold text-slate-100">
                    {act.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    {act.detail}
                  </p>
                </div>
              </div>

              <div className="shrink-0 text-xs font-mono font-medium text-amber-400 bg-amber-950/40 border border-amber-800/40 px-2.5 py-1 rounded-md">
                Plazo: {act.deadline}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
