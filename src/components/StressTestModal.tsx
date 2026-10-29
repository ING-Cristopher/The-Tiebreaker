import React, { useState } from 'react';
import { FlaskConical, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import { DecisionAnalysis, StressTestResult } from '../types/decision';

interface StressTestModalProps {
  decision: DecisionAnalysis;
  isOpen: boolean;
  onClose: () => void;
}

const COMMON_SCENARIOS = [
  '¿Qué pasa si mis ingresos disminuyen un 30% inesperadamente?',
  '¿Qué pasa si en 1 año no se cumplen las expectativas y quiero revertirlo?',
  '¿Qué pasa si el mercado o entorno macroeconómico entra en recesión?',
  '¿Qué pasa si sufro una crisis de salud o agotamiento (burnout)?',
];

export const StressTestModal: React.FC<StressTestModalProps> = ({
  decision,
  isOpen,
  onClose,
}) => {
  const [chosenOption, setChosenOption] = useState(
    decision.tiebreakerVerdict.recommendedOption || decision.options[0]?.name || ''
  );
  const [scenario, setScenario] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<StressTestResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRunStressTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scenario.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/stress-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: decision.title,
          chosenOption,
          scenario: scenario.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Error en la simulación');
      }

      const parsed: StressTestResult = await res.json();
      setResult(parsed);
    } catch (err: any) {
      setError(err.message || 'Error al conectar con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-700/60 flex items-center justify-center text-indigo-400">
              <FlaskConical className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Simulador de Escenarios «¿Qué pasaría si...?»
              </h3>
              <div className="text-xs text-slate-400">
                Pon a prueba la resiliencia de tu decisión ante adversidades
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 text-sm rounded-lg"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleRunStressTest} className="space-y-4 text-xs sm:text-sm">
          {error && (
            <div className="p-3 bg-red-950/60 border border-red-800/60 rounded-xl text-red-200 text-xs">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold block">
              Opción bajo prueba de estrés:
            </label>
            <select
              value={chosenOption}
              onChange={(e) => setChosenOption(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {decision.options.map((opt, i) => (
                <option key={i} value={opt.name}>
                  {opt.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold block">
              Escenario adverso o pregunta extrema:
            </label>
            <textarea
              rows={2}
              required
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              placeholder="Ej.: ¿Qué pasa si me recortan el sueldo un 25% o si mi socio decide abandonar el proyecto en 6 meses?"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Quick Scenario Chips */}
          <div className="space-y-1">
            <div className="text-[11px] text-slate-400">Escenarios típicos de prueba:</div>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_SCENARIOS.map((cs, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setScenario(cs)}
                  className="px-2.5 py-1 text-[11px] bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 transition text-left"
                >
                  {cs}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isLoading || !scenario.trim()}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs sm:text-sm transition flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Simulando impacto con IA...</span>
                </>
              ) : (
                <>
                  <span>Ejecutar Simulación</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Results view */}
        {result && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-slate-100 text-sm">
                  Resultado de la Simulación de Estrés
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-slate-400">Resiliencia:</span>
                <span
                  className={`px-2 py-0.5 rounded font-bold ${
                    result.resilienceLevel === 'Alto'
                      ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-800/60'
                      : result.resilienceLevel === 'Medio'
                      ? 'text-amber-400 bg-amber-950/60 border border-amber-800/60'
                      : 'text-rose-400 bg-rose-950/60 border border-rose-800/60'
                  }`}
                >
                  {result.resilienceLevel}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Impacto directo en la viabilidad
                </div>
                <p className="text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800/60">
                  {result.impactAnalysis}
                </p>
              </div>

              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Plan de contingencia táctico
                </div>
                <ul className="space-y-1.5">
                  {result.contingencyPlan.map((cp, idx) => (
                    <li
                      key={idx}
                      className="p-2.5 bg-slate-900/40 rounded-lg border border-slate-800/60 text-slate-300 flex items-start gap-2"
                    >
                      <span className="text-indigo-400 font-bold">·</span>
                      <span>{cp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-indigo-950/40 border border-indigo-900/40 rounded-xl flex items-center justify-between text-xs">
                <span className="text-slate-300">
                  ¿Afecta al veredicto original?
                </span>
                <span className="font-bold text-indigo-300">
                  {result.verdictShift}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
