'use client';

import { useGameStore } from '@/store/gameStore';
import { AnimatePresence, motion } from 'framer-motion';
import { Shield, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ConnectionGame({ onClose }: { onClose: () => void }) {
  // 3: مصدر، 4: هدف (درع)، 1: خط، 2: زاوية
  const [grid, setGrid] = useState([
    { id: 0, type: 3, rotation: 0 }, { id: 1, type: 1, rotation: 0 }, { id: 2, type: 0, rotation: 0 },
    { id: 3, type: 0, rotation: 0 }, { id: 4, type: 2, rotation: 90 }, { id: 5, type: 0, rotation: 0 },
    { id: 6, type: 0, rotation: 0 }, { id: 7, type: 1, rotation: 90 }, { id: 8, type: 4, rotation: 0 },
  ]);
  
  const [won, setWon] = useState(false);
  const { completeGame } = useGameStore();

  const rotatePiece = (id: number) => {
    if (won) return;
    setGrid(prev => prev.map(p => 
      p.id === id ? { ...p, rotation: (p.rotation + 90) % 360 } : p
    ));
  };

  useEffect(() => {
    // شرط الفوز بناءً على الزوايا المطلوبة
    if (grid[1].rotation === 90 && grid[4].rotation === 180 && grid[7].rotation === 0) {
      setWon(true);
      completeGame?.('illumination', 7);
    }
  }, [grid, completeGame]);

  return (
    <div className="w-full h-full flex items-center justify-center p-4 bg-stone-950 overflow-hidden">
      <AnimatePresence mode="wait">
        {!won ? (
          <motion.div key="game" exit={{ opacity: 0 }} className="grid grid-cols-3 gap-3">
            {grid.map((p) => (
              <button
                key={p.id}
                onClick={() => rotatePiece(p.id)}
                className={`w-20 h-20 rounded-xl flex items-center justify-center border-2 transition-all active:scale-95
                  ${won ? 'border-amber-500 bg-amber-900/20' : 'bg-stone-800 border-stone-700'}`}
              >
                <motion.div animate={{ rotate: p.rotation }}>
                  {p.type === 3 && <Zap className="text-yellow-400" size={32} />}
                  {p.type === 4 && <Shield className="text-amber-500" size={32} />}
                  {p.type === 1 && <div className="w-12 h-2 bg-stone-500 rounded-full" />}
                  {p.type === 2 && <div className="w-10 h-10 border-t-4 border-l-4 border-stone-500 rounded-tl-xl" />}
                </motion.div>
              </button>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="win"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-stone-900 p-8 rounded-xl shadow-2xl w-full max-w-sm text-center border-2 border-[#cbb382] relative"
          >
            <div className="absolute inset-0 border-2 border-[#cbb382] m-2 pointer-events-none" />
            
            <h3 className="text-2xl font-bold text-[#ead8b0] mb-4">🛡️ لقد استعدت الدرع! أحسنت</h3>
            <p className="text-[#d7be8f] mb-6 font-bold text-lg">+2 Points Bonus</p>
            
            <div className="text-6xl font-mono text-amber-500 tracking-widest bg-stone-950 px-8 py-6 rounded-xl font-bold shadow-inner border-4 border-[#5c4033]">
              7
            </div>
            
            <p className="mt-6 text-sm text-stone-400 font-bold">هذا هو الرقم الخاص بلعبة الدرع، احتفظ به جيداً.</p>
            
            <button 
              onClick={onClose} 
              className="mt-8 px-8 py-3 bg-[#5c4033] text-[#e6d0a7] rounded font-bold shadow-lg hover:bg-[#4a3424] transition-colors"
            >
              أكمل المغامرة
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}