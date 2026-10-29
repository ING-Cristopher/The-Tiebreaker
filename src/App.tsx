/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Award,
  ListChecks,
  Table2,
  LayoutGrid,
  Scale,
  Sparkles,
  ArrowLeft,
  Share2,
  CheckCircle2,
  Clock,
  Printer,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';

import { Header } from './components/Header';
import { DecisionForm } from './components/DecisionForm';
import { ProsConsView } from './components/ProsConsView';
import { ComparativeTableView } from './components/ComparativeTableView';
import { SwotView } from './components/SwotView';
import { VerdictCard } from './components/VerdictCard';
import { CoinFlipModal } from './components/CoinFlipModal';
import { StressTestModal } from './components/StressTestModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { TemplatesModal } from './components/TemplatesModal';

import { DecisionAnalysis } from './types/decision';
import { DECISION_TEMPLATES, DecisionTemplate } from './data/templates';

const STORAGE_KEY = 'the_tiebreaker_history_v1';

export default function App() {
  const [history, setHistory] = useState<DecisionAnalysis[]>([]);
  const [activeDecision, setActiveDecision] = useState<DecisionAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState<'verdict' | 'proscons' | 'matrix' | 'swot'>('verdict');
  const [isLoading, setIsLoading] = useState(false);
  const [isFormView, setIsFormView] = useState(false);

  // Modals
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isCoinFlipOpen, setIsCoinFlipOpen] = useState(false);
  const [isStressTestOpen, setIsStressTestOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHistory(parsed);
          setActiveDecision(parsed[0]);
          return;
        }
      }
    } catch (e) {
      console.warn('Error reading history from storage:', e);
    }

    // Default to the first realistic template if no history
    const defaultSample = DECISION_TEMPLATES[0].sampleAnalysis;
    setHistory([defaultSample]);
    setActiveDecision(defaultSample);
  }, []);

  // Sync history to localStorage
  const saveToStorage = (updatedList: DecisionAnalysis[]) => {
    setHistory(updatedList);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    } catch (e) {
      console.warn('Error saving to storage:', e);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Handle Form Submit & API Call
  const handleAnalyzeDecision = async (formData: {
    title: string;
    context: string;
    options: string[];
    priorityCriteria: string[];
    timeHorizon: string;
  }) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Error al procesar la decisión con el servidor.');
      }

      const analyzedData = await response.json();

      const newDecision: DecisionAnalysis = {
        id: `dec-${Date.now()}`,
        title: formData.title,
        context: formData.context,
        timeHorizon: formData.timeHorizon,
        priorityCriteria: formData.priorityCriteria,
        createdAt: new Date().toISOString(),
        status: 'pending',
        summary: analyzedData.summary,
        options: analyzedData.options,
        comparisonTable: analyzedData.comparisonTable,
        tiebreakerVerdict: analyzedData.tiebreakerVerdict,
      };

      const updatedHistory = [newDecision, ...history.filter((h) => h.id !== newDecision.id)];
      saveToStorage(updatedHistory);
      setActiveDecision(newDecision);
      setIsFormView(false);
      setActiveTab('verdict');
      showToast('¡Análisis completado con éxito!');
    } finally {
      setIsLoading(false);
    }
  };

  // Update existing decision (e.g. weights adjustment)
  const handleUpdateActiveDecision = (updated: DecisionAnalysis) => {
    setActiveDecision(updated);
    const updatedHistory = history.map((item) => (item.id === updated.id ? updated : item));
    saveToStorage(updatedHistory);
  };

  // Mark decision as committed
  const handleCommitDecision = (optionName: string) => {
    if (!activeDecision) return;
    const updated: DecisionAnalysis = {
      ...activeDecision,
      status: 'decided',
      selectedWinner: optionName,
    };
    handleUpdateActiveDecision(updated);
    showToast(`Decisión confirmada: ${optionName}`);
  };

  // Load a template
  const handleLoadTemplate = (template: DecisionTemplate) => {
    setActiveDecision(template.sampleAnalysis);
    const exists = history.some((h) => h.id === template.sampleAnalysis.id);
    if (!exists) {
      saveToStorage([template.sampleAnalysis, ...history]);
    }
    setIsFormView(false);
    setActiveTab('verdict');
    showToast(`Plantilla cargada: ${template.category}`);
  };

  // Delete from history
  const handleDeleteDecision = (id: string) => {
    const updated = history.filter((h) => h.id !== id);
    saveToStorage(updated);
    if (activeDecision?.id === id) {
      setActiveDecision(updated[0] || null);
      if (updated.length === 0) {
        setIsFormView(true);
      }
    }
    showToast('Decisión eliminada del historial.');
  };

  const handleClearHistory = () => {
    if (confirm('¿Seguro que deseas vaciar todo el historial guardado?')) {
      saveToStorage([]);
      setActiveDecision(null);
      setIsFormView(true);
      showToast('Historial vaciado.');
    }
  };

  // Export as Markdown report
  const handleExportMarkdown = () => {
    if (!activeDecision) return;

    const d = activeDecision;
    let md = `# THE TIEBREAKER · INFORME DE ANÁLISIS DE DECISIÓN\n\n`;
    md += `**Pregunta / Dilema**: ${d.title}\n`;
    md += `**Fecha de análisis**: ${new Date(d.createdAt).toLocaleDateString()}\n`;
    md += `**Horizonte temporal**: ${d.timeHorizon}\n`;
    md += `**Estado**: ${d.status === 'decided' ? `Decidida (${d.selectedWinner})` : 'En deliberación'}\n\n`;

    md += `## 1. RESUMEN ESTRATÉGICO\n${d.summary}\n\n`;

    md += `## 2. VEREDICTO GANADOR THE TIEBREAKER\n`;
    md += `**Opción Ganadora**: ${d.tiebreakerVerdict.recommendedOption} (${d.tiebreakerVerdict.confidenceScore}% de convicción)\n`;
    md += `**Titular**: ${d.tiebreakerVerdict.headline}\n`;
    md += `**Razonamiento central**: ${d.tiebreakerVerdict.coreRationale}\n\n`;
    md += `**El Factor Bisagra de Desempate**: ${d.tiebreakerVerdict.decisiveTiebreakerFactor}\n\n`;
    md += `**El Abogado del Diablo**: ${d.tiebreakerVerdict.devilsAdvocate}\n\n`;

    md += `### Regla 10/10/10\n`;
    md += `- En 10 Minutos: ${d.tiebreakerVerdict.tenTenTenRule.in10Minutes}\n`;
    md += `- En 10 Meses: ${d.tiebreakerVerdict.tenTenTenRule.in10Months}\n`;
    md += `- En 10 Años: ${d.tiebreakerVerdict.tenTenTenRule.in10Years}\n\n`;

    md += `## 3. PROS Y CONTRAS PONDERADOS\n`;
    d.options.forEach((opt) => {
      md += `### ${opt.name} (${opt.tagline})\n`;
      md += `**Ventajas (Pros)**:\n`;
      opt.pros.forEach((p) => {
        md += `- [Peso: ${p.weight}/5] ${p.point} — ${p.rationale}\n`;
      });
      md += `\n**Desventajas y Mitigación**:\n`;
      opt.cons.forEach((c) => {
        md += `- [Severidad: ${c.weight}/5] ${c.point} -> Mitigación: ${c.mitigation}\n`;
      });
      md += `\n`;
    });

    md += `## 4. PLAN DE ACCIÓN INMEDIATO (72H)\n`;
    d.tiebreakerVerdict.actionPlan.forEach((step) => {
      md += `${step.step}. **${step.title}** (${step.deadline}): ${step.detail}\n`;
    });

    navigator.clipboard.writeText(md);
    showToast('¡Informe en Markdown copiado al portapapeles!');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar Header */}
      <Header
        onNewDecision={() => setIsFormView(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenTemplates={() => setIsTemplatesOpen(true)}
        onOpenCoinFlip={() => setIsCoinFlipOpen(true)}
        historyCount={history.length}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {isFormView || !activeDecision ? (
          <div className="space-y-6">
            {activeDecision && (
              <button
                onClick={() => setIsFormView(false)}
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver al análisis actual: «{activeDecision.title}»</span>
              </button>
            )}

            <DecisionForm
              onSubmit={handleAnalyzeDecision}
              onLoadTemplate={handleLoadTemplate}
              isLoading={isLoading}
              activeDecision={activeDecision}
            />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Decision Title Banner & Status Bar */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                {/* Status Indicator */}
                <div className="flex items-center gap-2">
                  {activeDecision.status === 'decided' ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-lg">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Decisión Tomada: {activeDecision.selectedWinner}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-400 bg-amber-950/60 border border-amber-800/60 px-3 py-1 rounded-lg">
                      <Clock className="w-3.5 h-3.5" />
                      <span>En Deliberación Activa</span>
                    </span>
                  )}
                  <span className="text-slate-500 font-mono">
                    · {activeDecision.timeHorizon}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsFormView(true)}
                    className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
                  >
                    Editar Planteamiento
                  </button>
                  <button
                    onClick={handleExportMarkdown}
                    className="px-3 py-1.5 text-xs bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 rounded-lg transition flex items-center gap-1.5 font-medium"
                    title="Copiar informe en Markdown"
                  >
                    <Share2 className="w-3 h-3" />
                    <span>Exportar</span>
                  </button>
                </div>
              </div>

              {/* Title & Summary */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                  {activeDecision.title}
                </h1>
                <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
                  {activeDecision.summary}
                </p>
              </div>

              {/* Decision Options Quick Ribbon */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
                <span className="text-xs text-slate-400 font-semibold">Opciones analizadas:</span>
                {activeDecision.options.map((opt, i) => (
                  <span
                    key={i}
                    className="text-xs bg-slate-950 border border-slate-800 text-slate-200 px-3 py-1 rounded-lg font-medium flex items-center gap-1.5"
                  >
                    <span className="w-4 h-4 rounded bg-slate-800 font-mono text-[10px] flex items-center justify-center text-slate-400">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span>{opt.name}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Analysis Views Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-800 overflow-x-auto pb-2 scrollbar-none">
              <button
                onClick={() => setActiveTab('verdict')}
                className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-all ${
                  activeTab === 'verdict'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Veredicto The Tiebreaker</span>
              </button>

              <button
                onClick={() => setActiveTab('proscons')}
                className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-all ${
                  activeTab === 'proscons'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <ListChecks className="w-4 h-4" />
                <span>Pros y Contras Ponderados</span>
              </button>

              <button
                onClick={() => setActiveTab('matrix')}
                className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-all ${
                  activeTab === 'matrix'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Table2 className="w-4 h-4" />
                <span>Tabla Comparativa & Matriz</span>
              </button>

              <button
                onClick={() => setActiveTab('swot')}
                className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-all ${
                  activeTab === 'swot'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span>Análisis DAFO / SWOT</span>
              </button>
            </div>

            {/* Active Tab View Rendering */}
            <div className="pt-2">
              {activeTab === 'verdict' && (
                <VerdictCard
                  decision={activeDecision}
                  onCommitDecision={handleCommitDecision}
                  onOpenStressTest={() => setIsStressTestOpen(true)}
                  onExportMarkdown={handleExportMarkdown}
                />
              )}

              {activeTab === 'proscons' && (
                <ProsConsView
                  decision={activeDecision}
                  onUpdateDecision={handleUpdateActiveDecision}
                />
              )}

              {activeTab === 'matrix' && (
                <ComparativeTableView
                  decision={activeDecision}
                  onUpdateDecision={handleUpdateActiveDecision}
                />
              )}

              {activeTab === 'swot' && <SwotView decision={activeDecision} />}
            </div>
          </div>
        )}
      </main>

      {/* Global Modals & Drawers */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectDecision={(dec) => {
          setActiveDecision(dec);
          setIsFormView(false);
          setActiveTab('verdict');
        }}
        onDeleteDecision={handleDeleteDecision}
        onClearHistory={handleClearHistory}
      />

      <TemplatesModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onSelectTemplate={handleLoadTemplate}
      />

      <CoinFlipModal
        isOpen={isCoinFlipOpen}
        onClose={() => setIsCoinFlipOpen(false)}
        options={activeDecision ? activeDecision.options.map((o) => o.name) : ['Opción A', 'Opción B']}
      />

      {activeDecision && (
        <StressTestModal
          isOpen={isStressTestOpen}
          onClose={() => setIsStressTestOpen(false)}
          decision={activeDecision}
        />
      )}
    </div>
  );
}
