import React, { useState } from 'react';
import { Plus, Trash2, ArrowRight, Sparkles, Check, Compass, Clock, Sliders } from 'lucide-react';
import { DECISION_TEMPLATES, DecisionTemplate } from '../data/templates';
import { DecisionAnalysis } from '../types/decision';

interface DecisionFormProps {
  onSubmit: (formData: {
    title: string;
    context: string;
    options: string[];
    priorityCriteria: string[];
    timeHorizon: string;
  }) => Promise<void>;
  onLoadTemplate: (template: DecisionTemplate) => void;
  isLoading: boolean;
  activeDecision: DecisionAnalysis | null;
}

const COMMON_PRIORITIES = [
  'Retorno económico',
  'Paz mental y bienestar',
  'Crecimiento y aprendizaje',
  'Tiempo y concilación familiar',
  'Riesgo y reversibilidad',
  'Autonomía y libertad',
  'Impacto a largo plazo',
];

const TIME_HORIZONS = [
  'Corto plazo (menos de 1 año)',
  'Medio plazo (2 a 4 años)',
  'Largo plazo (5 a 10+ años)',
];

export const DecisionForm: React.FC<DecisionFormProps> = ({
  onSubmit,
  onLoadTemplate,
  isLoading,
  activeDecision,
}) => {
  const [title, setTitle] = useState('');
  const [context, setContext] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([
    'Retorno económico',
    'Paz mental y bienestar',
  ]);
  const [customPriority, setCustomPriority] = useState('');
  const [timeHorizon, setTimeHorizon] = useState(TIME_HORIZONS[1]);
  const [error, setError] = useState<string | null>(null);

  const handleAddOption = () => {
    if (options.length < 5) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index: number, val: string) => {
    const updated = [...options];
    updated[index] = val;
    setOptions(updated);
  };

  const togglePriority = (p: string) => {
    if (selectedPriorities.includes(p)) {
      setSelectedPriorities(selectedPriorities.filter((item) => item !== p));
    } else {
      setSelectedPriorities([...selectedPriorities, p]);
    }
  };

  const handleAddCustomPriority = (e: React.FormEvent) => {
    e.preventDefault();
    if (customPriority.trim() && !selectedPriorities.includes(customPriority.trim())) {
      setSelectedPriorities([...selectedPriorities, customPriority.trim()]);
      setCustomPriority('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanTitle = title.trim();
    const cleanOptions = options.map((o) => o.trim()).filter(Boolean);

    if (!cleanTitle) {
      setError('Por favor indica la pregunta o título de la decisión.');
      return;
    }

    if (cleanOptions.length < 2) {
      setError('Debes ingresar al menos 2 alternativas u opciones para contrastar.');
      return;
    }

    try {
      await onSubmit({
        title: cleanTitle,
        context: context.trim(),
        options: cleanOptions,
        priorityCriteria: selectedPriorities,
        timeHorizon,
      });
    } catch (err: any) {
      let msg = err.message || 'Error al conectar con el servidor.';
      if (typeof msg === 'string' && (msg.includes('503') || msg.includes('high demand') || msg.includes('UNAVAILABLE'))) {
        msg = 'Los servidores de IA experimentan alta demanda momentánea. Pulsa "Reintentar" para procesar con el modelo de respaldo.';
      }
      setError(msg);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-6 px-4">
      {/* Intro Hero Section */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-950/60 border border-indigo-800/40 px-3 py-1 rounded-md">
          <Compass className="w-3.5 h-3.5" />
          <span>Estrategia de Decisión Asistida por IA</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white max-w-2xl mx-auto text-balance">
          Resuelve tu dilema con rigor analítico y desempatador
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
          Plantea tu encrucijada. The Tiebreaker contrastará pros y contras ponderados, una matriz comparativa paramétrica y un análisis DAFO para emitir una recomendación concluyente.
        </p>
      </div>

      {/* Quick Template Starters */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            O prueba un caso real preconfigurado:
          </span>
          <span>1-click para cargar</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DECISION_TEMPLATES.map((tpl) => (
            <div
              key={tpl.id}
              onClick={() => {
                onLoadTemplate(tpl);
                setTitle(tpl.title);
                setContext(tpl.context);
                setOptions(tpl.options);
                setSelectedPriorities(tpl.priorityCriteria);
                setTimeHorizon(tpl.timeHorizon);
              }}
              className="group p-4 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-xl cursor-pointer transition-all text-left"
            >
              <div className="text-xs font-medium text-indigo-400 mb-1">{tpl.category}</div>
              <div className="text-sm font-semibold text-slate-200 group-hover:text-white line-clamp-2">
                {tpl.title}
              </div>
              <div className="mt-2 text-xs text-slate-400 flex items-center gap-2">
                <span>{tpl.options.length} opciones</span>
                <span>·</span>
                <span>{tpl.timeHorizon}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-8 shadow-xl shadow-black/40">
        {error && (
          <div className="p-4 rounded-xl bg-rose-950/70 border border-rose-800/80 text-rose-200 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
            <span>{error}</span>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-lg text-xs transition shrink-0"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* 1. Decision Title */}
        <div className="space-y-2">
          <label htmlFor="decision-title" className="block text-sm font-semibold text-slate-200">
            1. ¿Qué decisión o encrucijada debes resolver? <span className="text-indigo-400">*</span>
          </label>
          <input
            id="decision-title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej.: ¿Aceptar la oferta de empleo en el extranjero o quedarme en mi puesto actual?"
            className="w-full px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base transition"
          />
        </div>

        {/* 2. Options to compare */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-slate-200">
              2. Alternativas u opciones a comparar <span className="text-indigo-400">*</span>
            </label>
            <span className="text-xs text-slate-400">Mínimo 2, máximo 5</span>
          </div>

          <div className="space-y-2.5">
            {options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-7 h-7 shrink-0 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-mono font-medium text-slate-300">
                  {String.fromCharCode(65 + idx)}
                </span>
                <input
                  type="text"
                  required
                  value={opt}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  placeholder={`Opción ${String.fromCharCode(65 + idx)} (ej. ${
                    idx === 0 ? 'Quedarme en la empresa actual' : 'Aceptar nueva oferta con mayor sueldo'
                  })`}
                  className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition"
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(idx)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition"
                    title="Eliminar opción"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {options.length < 5 && (
            <button
              type="button"
              onClick={handleAddOption}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 py-1 px-2 rounded-lg hover:bg-slate-800 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Añadir otra alternativa</span>
            </button>
          )}
        </div>

        {/* 3. Context & Constraints */}
        <div className="space-y-2">
          <label htmlFor="decision-context" className="block text-sm font-semibold text-slate-200">
            3. Contexto, números y circunstancias personales
          </label>
          <textarea
            id="decision-context"
            rows={3}
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Aporta detalles relevantes: cifras salariales o costes, tiempo libre, familia o pareja, temores concretos, fecha límite para decidir, etc."
            className="w-full px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition"
          />
        </div>

        {/* 4. Priority criteria & Time horizon */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Priorities */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-200">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span>Criterios prioritarios para ti</span>
            </div>
            <p className="text-xs text-slate-400">
              Marca los factores que más peso deben tener en la evaluación:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_PRIORITIES.map((p) => {
                const isSelected = selectedPriorities.includes(p);
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => togglePriority(p)}
                    className={`px-2.5 py-1 text-xs rounded-lg border transition-all flex items-center gap-1 ${
                      isSelected
                        ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200 font-medium'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-indigo-400" />}
                    <span>{p}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Priority add */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={customPriority}
                onChange={(e) => setCustomPriority(e.target.value)}
                placeholder="Otro criterio personal..."
                className="flex-1 px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomPriority(e);
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddCustomPriority}
                className="px-2.5 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
              >
                Añadir
              </button>
            </div>
          </div>

          {/* Time Horizon */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-200">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>Horizonte temporal de impacto</span>
            </div>
            <p className="text-xs text-slate-400">
              El tiempo cambia radicalmente el peso de las decisiones:
            </p>
            <div className="space-y-2">
              {TIME_HORIZONS.map((h) => (
                <label
                  key={h}
                  className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition text-xs sm:text-sm ${
                    timeHorizon === h
                      ? 'bg-indigo-950/40 border-indigo-500/80 text-slate-100 font-medium'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="horizon"
                    checked={timeHorizon === h}
                    onChange={() => setTimeHorizon(h)}
                    className="accent-indigo-500"
                  />
                  <span>{h}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            Analiza pros y contras ponderados, matriz de decisión, DAFO y veredicto definitivo.
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Analizando con The Tiebreaker...</span>
              </>
            ) : (
              <>
                <span>Generar Análisis de Decisión</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
