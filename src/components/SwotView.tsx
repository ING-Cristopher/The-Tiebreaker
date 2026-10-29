import React, { useState } from 'react';
import { Target, Zap, AlertOctagon, TrendingUp, Sparkles, CheckCircle } from 'lucide-react';
import { DecisionAnalysis } from '../types/decision';

interface SwotViewProps {
  decision: DecisionAnalysis;
}

export const SwotView: React.FC<SwotViewProps> = ({ decision }) => {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const [comparisonMode, setComparisonMode] = useState<'single' | 'side-by-side'>('single');

  const currentOption = decision.options[selectedOptionIndex] || decision.options[0];

  return (
    <div className="space-y-8">
      {/* Header and Controls */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="text-xs uppercase tracking-wider text-indigo-400 font-medium">
            Diagnóstico Estratégico Integral
          </div>
          <h2 className="text-xl font-bold text-white mt-0.5">
            Análisis DAFO / SWOT
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Desglosa las variables internas (Fortalezas y Debilidades) frente a las fuerzas del entorno (Oportunidades y Amenazas) para cada escenario.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-xl shrink-0">
          <button
            onClick={() => setComparisonMode('single')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              comparisonMode === 'single'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Vista por Opción
          </button>
          <button
            onClick={() => setComparisonMode('side-by-side')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              comparisonMode === 'side-by-side'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Comparativa Paralela
          </button>
        </div>
      </div>

      {/* Option Selector for Single View */}
      {comparisonMode === 'single' && (
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4">
          {decision.options.map((opt, idx) => {
            const isSelected = idx === selectedOptionIndex;
            return (
              <button
                key={idx}
                onClick={() => setSelectedOptionIndex(idx)}
                className={`px-4 py-2 rounded-xl text-left border transition-all flex items-center gap-2.5 ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="w-5 h-5 rounded bg-slate-800 text-slate-300 font-mono text-xs flex items-center justify-center">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="font-semibold text-sm">{opt.name}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Single Option 4-Quadrant View */}
      {comparisonMode === 'single' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Mostrando DAFO para:{' '}
              <strong className="text-white font-semibold">
                {currentOption.name}
              </strong>
            </span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                Internas: Fortalezas & Debilidades
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-cyan-500" />
                Externas: Oportunidades & Amenazas
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. FORTALEZAS (Strengths) */}
            <div className="bg-slate-900/70 border border-emerald-900/40 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-100">
                      Fortalezas
                    </h3>
                    <div className="text-[11px] text-emerald-400 font-medium">
                      Factores Internos · Positivos
                    </div>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-500">
                  {currentOption.swot.strengths.length} puntos
                </span>
              </div>

              <ul className="space-y-2.5">
                {currentOption.swot.strengths.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200 bg-slate-950/60 p-3 rounded-xl border border-slate-800/60"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 2. OPORTUNIDADES (Opportunities) */}
            <div className="bg-slate-900/70 border border-cyan-900/40 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-100">
                      Oportunidades
                    </h3>
                    <div className="text-[11px] text-cyan-400 font-medium">
                      Factores Externos · Positivos
                    </div>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-500">
                  {currentOption.swot.opportunities.length} puntos
                </span>
              </div>

              <ul className="space-y-2.5">
                {currentOption.swot.opportunities.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200 bg-slate-950/60 p-3 rounded-xl border border-slate-800/60"
                  >
                    <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. DEBILIDADES (Weaknesses) */}
            <div className="bg-slate-900/70 border border-amber-900/40 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-950/80 border border-amber-800/60 flex items-center justify-center text-amber-400">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-100">
                      Debilidades
                    </h3>
                    <div className="text-[11px] text-amber-400 font-medium">
                      Factores Internos · Vulnerabilidades
                    </div>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-500">
                  {currentOption.swot.weaknesses.length} puntos
                </span>
              </div>

              <ul className="space-y-2.5">
                {currentOption.swot.weaknesses.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200 bg-slate-950/60 p-3 rounded-xl border border-slate-800/60"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-2" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. AMENAZAS (Threats) */}
            <div className="bg-slate-900/70 border border-rose-900/40 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-rose-950/80 border border-rose-800/60 flex items-center justify-center text-rose-400">
                    <AlertOctagon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-100">
                      Amenazas
                    </h3>
                    <div className="text-[11px] text-rose-400 font-medium">
                      Factores Externos · Riesgos
                    </div>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-500">
                  {currentOption.swot.threats.length} puntos
                </span>
              </div>

              <ul className="space-y-2.5">
                {currentOption.swot.threats.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200 bg-slate-950/60 p-3 rounded-xl border border-slate-800/60"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 mt-2" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Side-by-Side Comparison Mode */}
      {comparisonMode === 'side-by-side' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {decision.options.map((opt, idx) => (
            <div
              key={idx}
              className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6"
            >
              <div className="flex items-center gap-2.5 border-b border-slate-800 pb-4">
                <span className="w-6 h-6 rounded bg-indigo-950 text-indigo-300 font-mono text-xs flex items-center justify-center font-bold">
                  {String.fromCharCode(65 + idx)}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-white">{opt.name}</h3>
                  <div className="text-xs text-slate-400">{opt.tagline}</div>
                </div>
              </div>

              {/* Mini DAFO summary for this option */}
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1.5 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5" />
                    <span>Fortalezas clave</span>
                  </div>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {opt.swot.strengths.slice(0, 3).map((s, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">·</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1.5 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Oportunidades</span>
                  </div>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {opt.swot.opportunities.slice(0, 3).map((o, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-cyan-400 font-bold">·</span>
                        <span>{o}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1.5 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Debilidades críticas</span>
                  </div>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {opt.swot.weaknesses.slice(0, 3).map((w, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold">·</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-1.5 flex items-center gap-1.5">
                    <AlertOctagon className="w-3.5 h-3.5" />
                    <span>Amenazas externas</span>
                  </div>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {opt.swot.threats.slice(0, 3).map((t, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-rose-400 font-bold">·</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Strategic CAME Cross-Matrix Takeaway */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Matriz CAME: Cómo actuar con los resultados del DAFO</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="font-bold text-emerald-400 block mb-1">
              Corregir debilidades
            </span>
            <p className="text-slate-400">
              Crea protocolos o límites para que las debilidades intrínsecas no minen tu decisión.
            </p>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="font-bold text-rose-400 block mb-1">
              Afrontar amenazas
            </span>
            <p className="text-slate-400">
              Anticipa planes de contingencia para las incertidumbres de mercado o del entorno.
            </p>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="font-bold text-indigo-400 block mb-1">
              Mantener fortalezas
            </span>
            <p className="text-slate-400">
              Asegura que tu ventaja competitiva o estabilidad personal sea la base del salto.
            </p>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="font-bold text-cyan-400 block mb-1">
              Explotar oportunidades
            </span>
            <p className="text-slate-400">
              Aprovecha las puertas que se abren para acelerar tu crecimiento personal o financiero.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
