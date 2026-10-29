import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, Plus, Sliders, CheckCircle2, XCircle } from 'lucide-react';
import { DecisionAnalysis, OptionAnalysis, ProItem, ConItem } from '../types/decision';

interface ProsConsViewProps {
  decision: DecisionAnalysis;
  onUpdateDecision: (updated: DecisionAnalysis) => void;
}

export const ProsConsView: React.FC<ProsConsViewProps> = ({
  decision,
  onUpdateDecision,
}) => {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const [newProText, setNewProText] = useState('');
  const [newProWeight, setNewProWeight] = useState(3);
  const [newConText, setNewConText] = useState('');
  const [newConWeight, setNewConWeight] = useState(3);
  const [newConMitigation, setNewConMitigation] = useState('');

  const currentOption = decision.options[selectedOptionIndex] || decision.options[0];

  const handleUpdateProWeight = (proId: string, weight: number) => {
    const updatedOptions = decision.options.map((opt, oIdx) => {
      if (oIdx !== selectedOptionIndex) return opt;
      return {
        ...opt,
        pros: opt.pros.map((p) => (p.id === proId ? { ...p, weight } : p)),
      };
    });
    onUpdateDecision({ ...decision, options: updatedOptions });
  };

  const handleToggleProExcluded = (proId: string) => {
    const updatedOptions = decision.options.map((opt, oIdx) => {
      if (oIdx !== selectedOptionIndex) return opt;
      return {
        ...opt,
        pros: opt.pros.map((p) => (p.id === proId ? { ...p, userExcluded: !p.userExcluded } : p)),
      };
    });
    onUpdateDecision({ ...decision, options: updatedOptions });
  };

  const handleUpdateConWeight = (conId: string, weight: number) => {
    const updatedOptions = decision.options.map((opt, oIdx) => {
      if (oIdx !== selectedOptionIndex) return opt;
      return {
        ...opt,
        cons: opt.cons.map((c) => (c.id === conId ? { ...c, weight } : c)),
      };
    });
    onUpdateDecision({ ...decision, options: updatedOptions });
  };

  const handleToggleConExcluded = (conId: string) => {
    const updatedOptions = decision.options.map((opt, oIdx) => {
      if (oIdx !== selectedOptionIndex) return opt;
      return {
        ...opt,
        cons: opt.cons.map((c) => (c.id === conId ? { ...c, userExcluded: !c.userExcluded } : c)),
      };
    });
    onUpdateDecision({ ...decision, options: updatedOptions });
  };

  const handleAddCustomPro = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProText.trim()) return;

    const newPro: ProItem = {
      id: `custom-p-${Date.now()}`,
      point: newProText.trim(),
      weight: newProWeight,
      rationale: 'Añadido manualmente por el usuario.',
    };

    const updatedOptions = decision.options.map((opt, oIdx) => {
      if (oIdx !== selectedOptionIndex) return opt;
      return { ...opt, pros: [...opt.pros, newPro] };
    });

    onUpdateDecision({ ...decision, options: updatedOptions });
    setNewProText('');
    setNewProWeight(3);
  };

  const handleAddCustomCon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConText.trim()) return;

    const newCon: ConItem = {
      id: `custom-c-${Date.now()}`,
      point: newConText.trim(),
      weight: newConWeight,
      mitigation: newConMitigation.trim() || 'Establecer protocolo de contingencia específico.',
    };

    const updatedOptions = decision.options.map((opt, oIdx) => {
      if (oIdx !== selectedOptionIndex) return opt;
      return { ...opt, cons: [...opt.cons, newCon] };
    });

    onUpdateDecision({ ...decision, options: updatedOptions });
    setNewConText('');
    setNewConMitigation('');
    setNewConWeight(3);
  };

  // Calculations
  const calculateOptionScore = (opt: OptionAnalysis) => {
    const activePros = opt.pros.filter((p) => !p.userExcluded);
    const activeCons = opt.cons.filter((c) => !c.userExcluded);

    const proSum = activePros.reduce((acc, p) => acc + p.weight, 0);
    const conSum = activeCons.reduce((acc, c) => acc + c.weight, 0);
    const balance = proSum - conSum;

    return { proSum, conSum, balance };
  };

  const optionScores = decision.options.map((opt) => calculateOptionScore(opt));

  return (
    <div className="space-y-8">
      {/* Option Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4">
        {decision.options.map((opt, idx) => {
          const score = optionScores[idx];
          const isSelected = idx === selectedOptionIndex;
          return (
            <button
              key={idx}
              onClick={() => setSelectedOptionIndex(idx)}
              className={`px-4 py-2.5 rounded-xl text-left border transition-all ${
                isSelected
                  ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-slate-800 text-slate-300 font-mono text-xs flex items-center justify-center">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="font-semibold text-sm">{opt.name}</span>
              </div>
              <div className="mt-1 text-xs text-slate-400 flex items-center gap-2">
                <span className="text-emerald-400 font-mono">+{score.proSum} pros</span>
                <span>/</span>
                <span className="text-rose-400 font-mono">-{score.conSum} contras</span>
                <span>/</span>
                <span className={`font-mono font-medium ${score.balance >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                  Neto: {score.balance > 0 ? `+${score.balance}` : score.balance}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Header Info for Active Option */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-indigo-400 font-medium">
            Evaluación detallada · Opción {String.fromCharCode(65 + selectedOptionIndex)}
          </div>
          <h2 className="text-xl font-bold text-white mt-0.5">{currentOption.name}</h2>
          <p className="text-sm text-slate-400 mt-1">{currentOption.tagline}</p>
        </div>

        {/* Balance Metric */}
        <div className="bg-slate-950 border border-slate-800 px-5 py-3 rounded-xl flex items-center gap-6 shrink-0 font-mono">
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wider">Impacto Pros</div>
            <div className="text-xl font-semibold text-emerald-400 tabular-nums">
              +{optionScores[selectedOptionIndex].proSum}
            </div>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wider">Riesgo Contras</div>
            <div className="text-xl font-semibold text-rose-400 tabular-nums">
              -{optionScores[selectedOptionIndex].conSum}
            </div>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wider">Balance Neto</div>
            <div className={`text-xl font-bold tabular-nums ${optionScores[selectedOptionIndex].balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {optionScores[selectedOptionIndex].balance > 0 ? `+${optionScores[selectedOptionIndex].balance}` : optionScores[selectedOptionIndex].balance}
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Pros vs Cons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* PROS (Ventajas) Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-100">
                Ventajas & Pros Ponderados
              </h3>
            </div>
            <span className="text-xs text-slate-400">
              {currentOption.pros.filter((p) => !p.userExcluded).length} activas
            </span>
          </div>

          <div className="space-y-3">
            {currentOption.pros.map((pro) => (
              <div
                key={pro.id}
                className={`p-4 rounded-xl border transition-all ${
                  pro.userExcluded
                    ? 'bg-slate-950/40 border-slate-900 opacity-50'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleProExcluded(pro.id)}
                        className="text-slate-400 hover:text-slate-200 transition"
                        title={pro.userExcluded ? 'Activar pro' : 'Descartar pro'}
                      >
                        {pro.userExcluded ? (
                          <XCircle className="w-4 h-4 text-slate-500" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        )}
                      </button>
                      <h4 className={`text-sm font-semibold ${pro.userExcluded ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                        {pro.point}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-400 mt-1.5 ml-6 leading-relaxed">
                      {pro.rationale}
                    </p>
                  </div>

                  {/* Weight Badge / Control */}
                  <div className="shrink-0 flex flex-col items-end gap-1">
                    <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-md">
                      +{pro.weight} pts
                    </span>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-[10px] text-slate-500">Peso:</span>
                      <select
                        value={pro.weight}
                        disabled={pro.userExcluded}
                        onChange={(e) => handleUpdateProWeight(pro.id, Number(e.target.value))}
                        className="bg-slate-950 border border-slate-800 rounded text-slate-300 text-xs px-1 py-0.5 focus:outline-none focus:border-indigo-500"
                      >
                        <option value={1}>1 (Leve)</option>
                        <option value={2}>2 (Moderado)</option>
                        <option value={3}>3 (Importante)</option>
                        <option value={4}>4 (Muy Alto)</option>
                        <option value={5}>5 (Crítico)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Custom Pro Form */}
          <form onSubmit={handleAddCustomPro} className="p-3.5 bg-slate-900/30 border border-dashed border-slate-800 rounded-xl space-y-2.5">
            <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span>Añadir otra ventaja personalizada</span>
            </div>
            <input
              type="text"
              value={newProText}
              onChange={(e) => setNewProText(e.target.value)}
              placeholder="Ej.: Ya conozco la cultura interna y no tendré periodo de prueba..."
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Impacto (1-5):</span>
                <select
                  value={newProWeight}
                  onChange={(e) => setNewProWeight(Number(e.target.value))}
                  className="bg-slate-950 border border-slate-800 rounded px-1.5 py-1 text-slate-200 text-xs"
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={!newProText.trim()}
                className="px-3 py-1 text-xs bg-emerald-600 hover:bg-emerald-500 text-white rounded-md font-medium transition disabled:opacity-40"
              >
                Añadir ventaja
              </button>
            </div>
          </form>
        </div>

        {/* CONS (Desventajas y Riesgos) Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-950/80 border border-rose-800/60 flex items-center justify-center text-rose-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-100">
                Desventajas & Planes de Mitigación
              </h3>
            </div>
            <span className="text-xs text-slate-400">
              {currentOption.cons.filter((c) => !c.userExcluded).length} activas
            </span>
          </div>

          <div className="space-y-3">
            {currentOption.cons.map((con) => (
              <div
                key={con.id}
                className={`p-4 rounded-xl border transition-all ${
                  con.userExcluded
                    ? 'bg-slate-950/40 border-slate-900 opacity-50'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleConExcluded(con.id)}
                        className="text-slate-400 hover:text-slate-200 transition"
                        title={con.userExcluded ? 'Activar contra' : 'Descartar contra'}
                      >
                        {con.userExcluded ? (
                          <XCircle className="w-4 h-4 text-slate-500" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-rose-400" />
                        )}
                      </button>
                      <h4 className={`text-sm font-semibold ${con.userExcluded ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                        {con.point}
                      </h4>
                    </div>

                    {/* AI Mitigation Strategy Box */}
                    <div className="mt-2.5 ml-6 p-2.5 bg-slate-950 border border-slate-800/80 rounded-lg">
                      <div className="text-[11px] font-semibold text-indigo-400 flex items-center gap-1 mb-0.5">
                        <Sliders className="w-3 h-3" />
                        <span>Estrategia de mitigación recomendada:</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {con.mitigation}
                      </p>
                    </div>
                  </div>

                  {/* Severity Badge / Control */}
                  <div className="shrink-0 flex flex-col items-end gap-1">
                    <span className="text-xs font-mono font-semibold text-rose-400 bg-rose-950/60 border border-rose-800/40 px-2 py-0.5 rounded-md">
                      -{con.weight} pts
                    </span>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-[10px] text-slate-500">Severidad:</span>
                      <select
                        value={con.weight}
                        disabled={con.userExcluded}
                        onChange={(e) => handleUpdateConWeight(con.id, Number(e.target.value))}
                        className="bg-slate-950 border border-slate-800 rounded text-slate-300 text-xs px-1 py-0.5 focus:outline-none focus:border-indigo-500"
                      >
                        <option value={1}>1 (Mínima)</option>
                        <option value={2}>2 (Baja)</option>
                        <option value={3}>3 (Moderada)</option>
                        <option value={4}>4 (Alta)</option>
                        <option value={5}>5 (Crítica)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Custom Con Form */}
          <form onSubmit={handleAddCustomCon} className="p-3.5 bg-slate-900/30 border border-dashed border-slate-800 rounded-xl space-y-2.5">
            <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-rose-400" />
              <span>Añadir otra desventaja o riesgo</span>
            </div>
            <input
              type="text"
              value={newConText}
              onChange={(e) => setNewConText(e.target.value)}
              placeholder="Desventaja o riesgo no contemplado..."
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
            <input
              type="text"
              value={newConMitigation}
              onChange={(e) => setNewConMitigation(e.target.value)}
              placeholder="Cómo planeas mitigarlo o reducir el impacto (opcional)..."
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Severidad (1-5):</span>
                <select
                  value={newConWeight}
                  onChange={(e) => setNewConWeight(Number(e.target.value))}
                  className="bg-slate-950 border border-slate-800 rounded px-1.5 py-1 text-slate-200 text-xs"
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={!newConText.trim()}
                className="px-3 py-1 text-xs bg-rose-600 hover:bg-rose-500 text-white rounded-md font-medium transition disabled:opacity-40"
              >
                Añadir desventaja
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
