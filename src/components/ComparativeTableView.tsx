import React, { useState } from 'react';
import { Sliders, Award, Plus, Info, RefreshCw } from 'lucide-react';
import { DecisionAnalysis, ComparisonCriterion } from '../types/decision';

interface ComparativeTableViewProps {
  decision: DecisionAnalysis;
  onUpdateDecision: (updated: DecisionAnalysis) => void;
}

export const ComparativeTableView: React.FC<ComparativeTableViewProps> = ({
  decision,
  onUpdateDecision,
}) => {
  const [activeComment, setActiveComment] = useState<{
    criterionName: string;
    optionName: string;
    comment: string;
  } | null>(null);

  const [newCriterionName, setNewCriterionName] = useState('');
  const [newCriterionCategory, setNewCriterionCategory] = useState('Personalizado');
  const [showAddModal, setShowAddModal] = useState(false);

  const criteria = decision.comparisonTable.criteria;

  // Handle weight change for a specific criterion
  const handleWeightChange = (criterionId: string, newWeight: number) => {
    const updatedCriteria = criteria.map((c) =>
      c.id === criterionId ? { ...c, defaultWeight: newWeight } : c
    );
    onUpdateDecision({
      ...decision,
      comparisonTable: { criteria: updatedCriteria },
    });
  };

  // Add custom criterion
  const handleAddCriterion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCriterionName.trim()) return;

    const newCriterion: ComparisonCriterion = {
      id: `crit-${Date.now()}`,
      name: newCriterionName.trim(),
      category: newCriterionCategory.trim() || 'General',
      defaultWeight: 3,
      scores: decision.options.map((opt) => ({
        optionName: opt.name,
        score: 5,
        comment: 'Puntuación inicial para criterio personalizado. Puedes ajustar la importancia.',
      })),
    };

    onUpdateDecision({
      ...decision,
      comparisonTable: { criteria: [...criteria, newCriterion] },
    });

    setNewCriterionName('');
    setShowAddModal(false);
  };

  // Reset weights to defaults (3)
  const handleResetWeights = () => {
    const resetCriteria = criteria.map((c) => ({ ...c, defaultWeight: 3 }));
    onUpdateDecision({
      ...decision,
      comparisonTable: { criteria: resetCriteria },
    });
  };

  // Calculate weighted totals for each option
  // Total = sum(score * weight)
  // Max possible = sum(10 * weight)
  const optionTotals = decision.options.map((opt) => {
    let weightedSum = 0;
    let maxPossible = 0;

    criteria.forEach((crit) => {
      const match = crit.scores.find((s) => s.optionName === opt.name);
      const score = match ? match.score : 0;
      weightedSum += score * crit.defaultWeight;
      maxPossible += 10 * crit.defaultWeight;
    });

    const percentage = maxPossible > 0 ? Math.round((weightedSum / maxPossible) * 100) : 0;

    return {
      optionName: opt.name,
      weightedSum: Math.round(weightedSum * 10) / 10,
      maxPossible,
      percentage,
    };
  });

  // Find the winning option based on current user weights
  const winningOption = [...optionTotals].sort((a, b) => b.weightedSum - a.weightedSum)[0];

  return (
    <div className="space-y-6">
      {/* Overview & Live Winner Banner */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="text-xs uppercase tracking-wider text-indigo-400 font-medium">
            Matriz de Decisión Multicriterio Ponderada
          </div>
          <h2 className="text-xl font-bold text-white mt-0.5">
            Tabla Comparativa Paramétrica
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Ajusta los deslizadores de importancia (peso de 1 a 5) según tus prioridades vitales actuales. La matriz recalcula automáticamente la opción líder en tiempo real.
          </p>
        </div>

        {/* Dynamic Leader Callout */}
        <div className="bg-slate-950 border border-indigo-500/40 rounded-xl p-4 flex items-center gap-4 shrink-0 shadow-lg shadow-indigo-950/40">
          <div className="w-10 h-10 rounded-lg bg-indigo-600/20 border border-indigo-500/50 flex items-center justify-center text-indigo-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider">
              Líder según tus pesos
            </div>
            <div className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span>{winningOption.optionName}</span>
              <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                {winningOption.percentage}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex items-center justify-between gap-4 text-xs">
        <div className="text-slate-400 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-400" />
          <span>Haz clic en cualquier puntuación para ver el razonamiento de la IA</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetWeights}
            className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:border-slate-700 transition flex items-center gap-1.5"
          >
            <RefreshCw className="w-3 h-3 text-slate-400" />
            <span>Restablecer pesos (3)</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 rounded-lg bg-indigo-600/20 border border-indigo-500/50 text-indigo-300 hover:bg-indigo-600/30 transition flex items-center gap-1.5 font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Añadir criterio</span>
          </button>
        </div>
      </div>

      {/* Main Comparative Matrix Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/80 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <th className="py-4 px-5 min-w-[220px]">Criterio de Evaluación</th>
              <th className="py-4 px-4 min-w-[170px] text-center">Peso / Importancia</th>
              {decision.options.map((opt, idx) => (
                <th key={idx} className="py-4 px-5 min-w-[190px] text-center">
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-[10px] text-indigo-400 font-mono">
                      Opción {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-slate-200 text-sm font-bold truncate max-w-[180px]">
                      {opt.name}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 text-sm">
            {criteria.map((criterion) => (
              <tr
                key={criterion.id}
                className="hover:bg-slate-800/30 transition-colors"
              >
                {/* Criterion Name & Category */}
                <td className="py-3.5 px-5">
                  <div className="font-medium text-slate-200">{criterion.name}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                    {criterion.category}
                  </div>
                </td>

                {/* Adjustable Weight Slider */}
                <td className="py-3.5 px-4">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="flex items-center justify-between w-full max-w-[140px] text-xs font-mono">
                      <span className="text-slate-500 text-[11px]">Importancia:</span>
                      <span className="font-semibold text-indigo-300">
                        {criterion.defaultWeight}x
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      step={1}
                      value={criterion.defaultWeight}
                      onChange={(e) =>
                        handleWeightChange(criterion.id, Number(e.target.value))
                      }
                      className="w-full max-w-[140px] accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                    />
                  </div>
                </td>

                {/* Option Scores */}
                {decision.options.map((opt, oIdx) => {
                  const match = criterion.scores.find((s) => s.optionName === opt.name);
                  const score = match ? match.score : 0;
                  const comment = match ? match.comment : 'Sin observaciones.';

                  // Highlighting score color
                  let scoreBadge = 'text-amber-400 bg-amber-950/40 border-amber-800/40';
                  if (score >= 7.5) {
                    scoreBadge = 'text-emerald-400 bg-emerald-950/50 border-emerald-800/50';
                  } else if (score < 5) {
                    scoreBadge = 'text-rose-400 bg-rose-950/50 border-rose-800/50';
                  }

                  return (
                    <td
                      key={oIdx}
                      className="py-3.5 px-5 text-center cursor-pointer group"
                      onClick={() =>
                        setActiveComment({
                          criterionName: criterion.name,
                          optionName: opt.name,
                          comment,
                        })
                      }
                    >
                      <div className="inline-flex flex-col items-center gap-1">
                        <div
                          className={`px-3 py-1 rounded-lg border font-mono font-bold text-sm tabular-nums group-hover:scale-105 transition-transform ${scoreBadge}`}
                        >
                          {score.toFixed(1)} / 10
                        </div>
                        <div className="text-[11px] text-slate-500 group-hover:text-slate-300 transition-colors flex items-center gap-1">
                          <Info className="w-2.5 h-2.5" />
                          <span className="truncate max-w-[140px]">{comment}</span>
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>

          {/* Table Footer: Weighted Sums & Percentages */}
          <tfoot>
            <tr className="border-t-2 border-slate-700 bg-slate-950 text-slate-200">
              <td className="py-5 px-5 font-bold">
                <div className="text-base text-white">Puntuación Total Ponderada</div>
                <div className="text-xs text-slate-400 font-mono font-normal">
                  Fórmula: Σ (Puntuación × Peso)
                </div>
              </td>
              <td className="py-5 px-4 text-center font-mono text-xs text-slate-500">
                Basado en tus {criteria.length} criterios
              </td>
              {optionTotals.map((tot, idx) => {
                const isLeader = tot.optionName === winningOption.optionName;
                return (
                  <td key={idx} className="py-5 px-5 text-center">
                    <div
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1 ${
                        isLeader
                          ? 'bg-indigo-950/50 border-indigo-500 text-white shadow-md shadow-indigo-900/30'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300'
                      }`}
                    >
                      {isLeader && (
                        <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">
                          ★ Opción Recomendada
                        </span>
                      )}
                      <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-white">
                        {tot.weightedSum}
                        <span className="text-xs text-slate-400 font-normal">
                          {' '}
                          / {tot.maxPossible}
                        </span>
                      </div>
                      <div className="text-xs font-mono font-semibold text-emerald-400">
                        {tot.percentage}% de viabilidad
                      </div>
                    </div>
                  </td>
                );
              })}
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Score Comment Details Modal */}
      {activeComment && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveComment(null)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="text-xs uppercase tracking-wider text-indigo-400 font-mono">
                  Justificación Analítica IA
                </div>
                <h4 className="text-base font-bold text-white mt-0.5">
                  {activeComment.criterionName}
                </h4>
              </div>
              <button
                onClick={() => setActiveComment(null)}
                className="text-slate-400 hover:text-white text-sm p-1 rounded"
              >
                ✕
              </button>
            </div>

            <div>
              <div className="text-xs text-slate-400 mb-1">
                Opción evaluada: <strong className="text-slate-200">{activeComment.optionName}</strong>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
                {activeComment.comment}
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveComment(null)}
                className="px-4 py-2 text-xs bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Criterion Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowAddModal(false)}
        >
          <form
            onSubmit={handleAddCriterion}
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-base font-bold text-white">
                Añadir Criterio de Comparación
              </h4>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nombre del criterio:
                </label>
                <input
                  type="text"
                  required
                  value={newCriterionName}
                  onChange={(e) => setNewCriterionName(e.target.value)}
                  placeholder="Ej.: Facilidad de renegociación, prestigio social..."
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Categoría o dimensión:
                </label>
                <input
                  type="text"
                  value={newCriterionCategory}
                  onChange={(e) => setNewCriterionCategory(e.target.value)}
                  placeholder="Ej.: Estilo de Vida, Finanzas, Riesgo..."
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition"
              >
                Guardar criterio
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
