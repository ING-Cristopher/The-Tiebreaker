import React from 'react';
import { Scale, PlusCircle, History, Sparkles, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onNewDecision: () => void;
  onOpenHistory: () => void;
  onOpenTemplates: () => void;
  onOpenCoinFlip: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onNewDecision,
  onOpenHistory,
  onOpenTemplates,
  onOpenCoinFlip,
  historyCount,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-3.5">
        {/* Zone 1: Brand Wordmark */}
        <div 
          onClick={onNewDecision}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20 group-hover:bg-indigo-500 transition-colors">
            <Scale className="w-4 h-4" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-100 whitespace-nowrap">
            The Tiebreaker
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={onNewDecision}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            Nueva Consulta
          </button>
          <button
            onClick={onOpenTemplates}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Ejemplos Guiados
          </button>
          <button
            onClick={onOpenHistory}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <History className="w-3.5 h-3.5 text-slate-400" />
            Historial ({historyCount})
          </button>
          <button
            onClick={onOpenCoinFlip}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            Moneda de la Verdad
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onNewDecision}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 active:scale-[0.98] transition-all shadow-sm shadow-indigo-600/30 flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Formular Decisión</span>
          </button>
        </div>
      </div>
    </header>
  );
};
