'use client';

import { useGameStore } from '@/store/gameStore';
import { AnimatePresence, motion } from 'framer-motion';
import { Shield, Zap } from 'lucide-react';
import { useState } from 'react';

// 0: مسار فارغ، 1: خط أفقي، 2: خط رأسي، 3: زاوية، 4: مصدر، 5: هدف
const INITIAL_LAYOUT = [4, 1, 3, 0, 2, 0, 0, 2, 5];

export default function ConnectionGame({ onClose }: { onClose: () => void }) {
  const [grid, setGrid] = useState(INITIAL_LAYOUT);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [won, setWon] = useState(false);
  const { completeGame } = useGameStore();

  const handlePieceClick = (index: number) => {
    if (won) return;
    
    if (selectedIndex === null) {
      setSelectedIndex(index);
    } else {
      // تبديل القطعتين
      const newGrid = [...grid];
      [newGrid[selectedIndex], newGrid[index]] = [newGrid[index], newGrid[selectedIndex]];
      setGrid(newGrid);
      setSelectedIndex(null);
      
      // تحقق من الفوز (ترتيب معين: 4-1-3-2-5)
      if (newGrid[0] === 4 && newGrid[1] === 1 && newGrid[2] === 3 && newGrid[4] === 2 && newGrid[8] === 5) {
        setWon(true);
        completeGame?.('illumination', 7);
      }
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-stone-950 p-4">
      <AnimatePresence mode="wait">
        {!won ? (
          <div className="grid grid-cols-3 gap-2">
            {grid.map((type, i) => (
              <button
                key={i}
                onClick={() => handlePieceClick(i)}
                className={`w-20 h-20 rounded-lg border-2 flex items-center justify-center transition-all
                  ${selectedIndex === i ? 'border-amber-400 bg-stone-700' : 'border-stone-700 bg-stone-800'}`}
              >
                {type === 4 && <Zap className="text-yellow-400" size={32} />}
                {type === 5 && <Shield className="text-amber-500" size={32} />}
                {type === 1 && <div className="w-12 h-2 bg-stone-400 rounded-full" />}
                {type === 2 && <div className="w-2 h-12 bg-stone-400 rounded-full" />}
                {type === 3 && <div className="w-10 h-10 border-t-4 border-l-4 border-stone-400 rounded-tl-xl" />}
              </button>
            ))}
          </div>
        ) : (
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-stone-900 p-8 rounded-xl text-center border-2 border-[#cbb382] w-full max-w-sm">
            <div className="absolute inset-0 border-2 border-[#cbb382] m-2 pointer-events-none" />
            <h3 className="text-2xl font-bold text-[#ead8b0] mb-4">🛡️ المسار اكتمل! أحسنت</h3>
            <p className="text-[#d7be8f] mb-6 font-bold text-lg">+2 Points Bonus</p>
            <div className="text-6xl font-mono text-amber-500 tracking-widest bg-stone-950 px-8 py-6 rounded-xl font-bold shadow-inner border-4 border-[#5c4033]">7</div>
            <p className="mt-6 text-sm text-stone-400 font-bold">هذا هو الرقم الخاص بلعبة الدرع، احتفظ به.</p>
            <button onClick={onClose} className="mt-8 px-8 py-3 bg-[#5c4033] text-[#e6d0a7] rounded font-bold hover:bg-[#4a3424]">أكمل المغامرة</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}