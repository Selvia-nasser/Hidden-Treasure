'use client';

import { useGameStore } from '@/store/gameStore';
import { motion } from 'framer-motion';
import { Shield, Zap } from 'lucide-react';
import { useState } from 'react';

// كل قطعة لها اتجاه (0, 90, 180, 270)
const PIECES = [
  { id: 0, type: 'source', rot: 0 },
  { id: 1, type: 'pipe', rot: 0 },
  { id: 2, type: 'corner', rot: 0 },
  { id: 3, type: 'pipe', rot: 90 },
  { id: 4, type: 'shield', rot: 0 }
];

export default function ConnectionGame({ onClose }: { onClose: () => void }) {
  const [rotations, setRotations] = useState<{ [key: number]: number }>({ 1: 0, 2: 0, 3: 90 });
  const [won, setWon] = useState(false);
  const { completeGame } = useGameStore();

  const handleRotate = (id: number) => {
    if (won || id === 0 || id === 4) return;
    setRotations(prev => {
      const newRots = { ...prev, [id]: (prev[id] + 90) % 360 };
      
      // شرط الفوز: القطعة 1 (أفقية 0 أو 180)، القطعة 2 (زاوية 90)، القطعة 3 (رأسية 0 أو 180)
      if (newRots[1] % 180 === 0 && newRots[2] === 90 && newRots[3] % 180 === 0) {
        setWon(true);
        completeGame?.('illumination', 7);
      }
      return newRots;
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-stone-950 p-6">
      {!won ? (
        <div className="flex flex-col gap-4 items-center">
          <p className="text-[#cbb382] font-bold mb-4">صل المصدر بالدرع 🛡️</p>
          <div className="flex gap-2">
            <div className="w-16 h-16 bg-stone-800 flex items-center justify-center rounded-lg"><Zap className="text-yellow-400" /></div>
            <button onClick={() => handleRotate(1)} className="w-16 h-16 bg-stone-700 flex items-center justify-center rounded-lg">
              <motion.div animate={{ rotate: rotations[1] }}><div className="w-10 h-2 bg-stone-400"/></motion.div>
            </button>
            <button onClick={() => handleRotate(2)} className="w-16 h-16 bg-stone-700 flex items-center justify-center rounded-lg">
              <motion.div animate={{ rotate: rotations[2] }}><div className="w-8 h-8 border-t-4 border-l-4 border-stone-400 rounded-tl-lg"/></motion.div>
            </button>
            <button onClick={() => handleRotate(3)} className="w-16 h-16 bg-stone-700 flex items-center justify-center rounded-lg">
              <motion.div animate={{ rotate: rotations[3] }}><div className="w-2 h-10 bg-stone-400"/></motion.div>
            </button>
            <div className="w-16 h-16 bg-stone-800 flex items-center justify-center rounded-lg"><Shield className="text-amber-500" /></div>
          </div>
        </div>
      ) : (
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-stone-900 p-8 rounded-xl text-center border-2 border-[#cbb382] relative w-full max-w-sm">
          <div className="absolute inset-0 border-2 border-[#cbb382] m-2 pointer-events-none" />
          <h3 className="text-2xl font-bold text-[#ead8b0] mb-4">🛡️ لقد استعدت الدرع! أحسنت</h3>
          <p className="text-[#d7be8f] mb-6 font-bold text-lg">+2 Points Bonus</p>
          <div className="text-6xl font-mono text-amber-500 tracking-widest bg-stone-950 px-8 py-6 rounded-xl font-bold shadow-inner border-4 border-[#5c4033]">7</div>
          <p className="mt-6 text-sm text-stone-400 font-bold">هذا هو الرقم الخاص بلعبة الدرع، احتفظ به.</p>
          <button onClick={onClose} className="mt-8 px-8 py-3 bg-[#5c4033] text-[#e6d0a7] rounded font-bold hover:bg-[#4a3424]">أكمل المغامرة</button>
        </motion.div>
      )}
    </div>
  );
}