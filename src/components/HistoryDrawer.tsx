import React, { useState } from 'react';
import { History, Trash2, CheckCircle2, Clock, Search, ArrowRight } from 'lucide-react';
import { DecisionAnalysis } from '../types/decision';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: DecisionAnalysis[];
  onSelectDecision: (decision: DecisionAnalysis) => void;
  onDeleteDecision: (id: string) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectDecision,
  onDeleteDecision,
  onClearHistory,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'decided'>('all');

  if (!isOpen) return null;

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.options.some((o) => o.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md h-full bg-slate-900 border-l border-slate-800 p-6 flex flex-col space-y-6 shadow-2xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-700/60 flex items-center justify-center text-indigo-400">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Historial de Decisiones
              </h3>
              <div className="text-xs text-slate-400">
                {history.length} análisis guardados localmente
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

        {/* Search & Filter */}
        <div className="space-y-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por título u opción..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-xl text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`flex-1 py-1 rounded-lg font-medium transition ${
                statusFilter === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Todas ({history.length})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`flex-1 py-1 rounded-lg font-medium transition ${
                statusFilter === 'pending'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Pendientes
            </button>
            <button
              onClick={() => setStatusFilter('decided')}
              className={`flex-1 py-1 rounded-lg font-medium transition ${
                statusFilter === 'decided'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Decididas
            </button>
          </div>
        </div>

        {/* List of decisions */}
        <div className="flex-1 space-y-3 overflow-y-auto pr-1">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No hay decisiones registradas en esta vista.
            </div>
          ) : (
            filteredHistory.map((item) => {
              const dateStr = new Date(item.createdAt).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              });
              const isDecided = item.status === 'decided';

              return (
                <div
                  key={item.id}
                  className="group p-4 bg-slate-950 border border-slate-800/80 hover:border-indigo-500/50 rounded-xl transition space-y-2.5 cursor-pointer text-left"
                  onClick={() => {
                    onSelectDecision(item);
                    onClose();
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-white line-clamp-2 leading-snug">
                      {item.title}
                    </h4>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteDecision(item.id);
                      }}
                      className="text-slate-600 hover:text-red-400 p-1 rounded transition shrink-0"
                      title="Eliminar de historial"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                    {isDecided ? (
                      <span className="text-emerald-400 flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        Decidida: {item.selectedWinner || item.tiebreakerVerdict.recommendedOption}
                      </span>
                    ) : (
                      <span className="text-amber-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        En deliberación
                      </span>
                    )}
                    <span>·</span>
                    <span>{dateStr}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-900">
                    <span>{item.options.length} opciones comparadas</span>
                    <span className="text-indigo-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform font-medium">
                      Abrir <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
            <button
              onClick={onClearHistory}
              className="text-slate-500 hover:text-red-400 transition"
            >
              Borrar todo el historial
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
