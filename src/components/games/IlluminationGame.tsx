'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, RotateCw } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';

// 0: مسار فارغ، 1: خط مستقيم، 2: زاوية، 3: مصدر، 4: هدف
const INITIAL_GRID = [
  [3, 1, 0],
  [0, 2, 0],
  [0, 1, 4],
];

export default function ConnectionGame({ onClose }: { onClose: () => void }) {
  const [grid, setGrid] = useState([
    { id: 0, type: 3, rotation: 0 }, { id: 1, type: 1, rotation: 0 }, { id: 2, type: 0, rotation: 0 },
    { id: 3, type: 0, rotation: 0 }, { id: 4, type: 2, rotation: 90 }, { id: 5, type: 0, rotation: 0 },
    { id: 6, type: 0, rotation: 0 }, { id: 7, type: 1, rotation: 90 }, { id: 8, type: 4, rotation: 0 },
  ]);
  const [won, setWon] = useState(false);
  const { completeGame } = useGameStore();

  const rotatePiece = (id: number) => {
    if (won) return;
    const newGrid = grid.map(p => 
      p.id === id ? { ...p, rotation: (p.rotation + 90) % 360 } : p
    );
    setGrid(newGrid);
  };

  // التحقق من الفوز (بسيط: يجب أن تكون الزوايا والخطوط في اتجاهات محددة)
  useEffect(() => {
    const isSolved = 
      grid[1].rotation === 90 && // القطعة 1
      grid[4].rotation === 180 && // القطعة 4
      grid[7].rotation === 0;   // القطعة 7
    
    if (isSolved) {
      setWon(true);
      setTimeout(() => completeGame?.('illumination', 7), 1500);
    }
  }, [grid, completeGame]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-stone-950 text-stone-200">
      {!won ? (
        <div className="grid grid-cols-3 gap-3">
          {grid.map((p) => (
            <button
              key={p.id}
              onClick={() => rotatePiece(p.id)}
              className="w-20 h-20 bg-stone-800 rounded-xl flex items-center justify-center border-2 border-stone-700 active:scale-95 transition-all"
            >
              <motion.div animate={{ rotate: p.rotation }}>
                {p.type === 3 && <Zap className="text-yellow-400" size={32} />}
                {p.type === 4 && <Shield className="text-amber-500" size={32} />}
                {p.type === 1 && <div className="w-12 h-2 bg-stone-500 rounded-full" />}
                {p.type === 2 && <div className="w-10 h-10 border-t-4 border-l-4 border-stone-500 rounded-tl-xl" />}
              </motion.div>
            </button>
          ))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-stone-900 border-2 border-amber-500 rounded-3xl"
        >
          <Shield size={80} className="text-amber-500 mx-auto mb-4 animate-pulse" />
          <h2 className="text-3xl font-black text-white mb-2">مبروك يا أبطال!</h2>
          <p className="text-stone-400 mb-6">لقد وصلتم الطاقة للدرع بنجاح</p>
          <div className="text-6xl font-black text-amber-500 mb-8">7</div>
          <button onClick={onClose} className="px-8 py-3 bg-amber-600 rounded-xl font-bold text-white">العودة للمعبد</button>
        </motion.div>
      )}
      <p className="mt-8 text-stone-600 text-sm">اضغط على القطع لتدويرها وتوصيل المسار</p>
    </div>
  );
}