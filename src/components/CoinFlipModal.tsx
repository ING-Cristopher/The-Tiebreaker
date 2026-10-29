import React, { useState } from 'react';
import { HelpCircle, Sparkles, RefreshCw } from 'lucide-react';

interface CoinFlipModalProps {
  options: string[];
  isOpen: boolean;
  onClose: () => void;
}

export const CoinFlipModal: React.FC<CoinFlipModalProps> = ({
  options,
  isOpen,
  onClose,
}) => {
  const [optionA, setOptionA] = useState(options[0] || 'Opción A');
  const [optionB, setOptionB] = useState(options[1] || 'Opción B');
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<'A' | 'B' | null>(null);
  const [flipCount, setFlipCount] = useState(0);

  if (!isOpen) return null;

  const handleFlip = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setResult(null);

    const randomPick = Math.random() > 0.5 ? 'A' : 'B';

    setTimeout(() => {
      setResult(randomPick);
      setIsFlipping(false);
      setFlipCount((prev) => prev + 1);
    }, 2200);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow backdrop */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-950/80 border border-amber-800/60 flex items-center justify-center text-amber-400">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                La Moneda de la Verdad
              </h3>
              <div className="text-xs text-amber-400">
                El desempate psicológico de Freud
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

        {/* Psychology quote */}
        <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-300 leading-relaxed italic">
          «Cuando lances la moneda, presta atención a tu estómago: en el instante en que esté en el aire, sabrás de repente qué resultado estás deseando en secreto.»
        </div>

        {/* Options Setup */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <label className="text-slate-400 font-semibold block">Cara (Opción A):</label>
            <input
              type="text"
              value={optionA}
              onChange={(e) => setOptionA(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-slate-400 font-semibold block">Cruz (Opción B):</label>
            <input
              type="text"
              value={optionB}
              onChange={(e) => setOptionB(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Coin Flip Interactive Stage */}
        <div className="py-6 flex flex-col items-center justify-center space-y-5">
          <div
            className={`w-28 h-28 rounded-full border-4 border-amber-400/80 bg-gradient-to-tr from-amber-600 via-yellow-500 to-amber-300 shadow-xl shadow-amber-500/20 flex items-center justify-center text-slate-950 font-black text-2xl select-none transition-transform duration-700 ${
              isFlipping ? 'animate-bounce [transform:rotateY(1440deg)_rotateX(720deg)]' : ''
            }`}
          >
            {isFlipping ? (
              <RefreshCw className="w-8 h-8 animate-spin text-slate-950/70" />
            ) : result ? (
              result === 'A' ? 'CARA' : 'CRUZ'
            ) : (
              '?'
            )}
          </div>

          {isFlipping && (
            <div className="text-xs font-medium text-amber-300 animate-pulse">
              Girando... ¡Siente cuál quieres que salga!
            </div>
          )}

          {result && !isFlipping && (
            <div className="text-center space-y-2 animate-in zoom-in-95">
              <div className="text-xs uppercase tracking-wider text-slate-400">
                La moneda cayó en {result === 'A' ? 'CARA' : 'CRUZ'}:
              </div>
              <div className="text-lg font-bold text-white bg-slate-950 px-4 py-2 rounded-xl border border-amber-500/40">
                {result === 'A' ? optionA : optionB}
              </div>

              {/* Gut check question */}
              <div className="text-xs text-indigo-300 max-w-xs mx-auto pt-2">
                ¿Sentiste alivio o decepción?
                <br />
                <span className="text-slate-400">
                  Si sentiste alivio, confirma esta opción. Si sentiste decepción, tu respuesta es la contraria.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Flip CTA */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <span className="text-xs text-slate-500 font-mono">
            {flipCount > 0 ? `Lanzamientos: ${flipCount}` : 'Listo para lanzar'}
          </span>

          <button
            onClick={handleFlip}
            disabled={isFlipping}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition shadow-lg shadow-amber-500/30 flex items-center gap-2 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isFlipping ? 'Lanzando...' : 'Lanzar Moneda'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
