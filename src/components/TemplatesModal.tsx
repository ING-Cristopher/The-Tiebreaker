import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { DECISION_TEMPLATES, DecisionTemplate } from '../data/templates';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: DecisionTemplate) => void;
}

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  if (!isOpen) return null;

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
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Ejemplos Guiados de Decisiones Complejas
              </h3>
              <div className="text-xs text-slate-400">
                Carga plantillas realistas prediseñadas para explorar la metodología
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

        <div className="space-y-4">
          {DECISION_TEMPLATES.map((tpl) => (
            <div
              key={tpl.id}
              onClick={() => {
                onSelectTemplate(tpl);
                onClose();
              }}
              className="group p-5 bg-slate-950 border border-slate-800 hover:border-indigo-500 rounded-2xl transition cursor-pointer text-left space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 font-mono">
                  {tpl.category}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {tpl.timeHorizon}
                </span>
              </div>

              <h4 className="text-base font-bold text-slate-100 group-hover:text-white leading-snug">
                {tpl.title}
              </h4>

              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                {tpl.context}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-900 text-xs">
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="font-medium text-slate-300">Opciones:</span>
                  <span>{tpl.options.join(' vs ')}</span>
                </div>

                <span className="text-indigo-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Cargar y explorar <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
