'use client';

import { useGameStore } from '@/store/gameStore';
import { motion } from 'framer-motion';
import { useState } from 'react';

// أيقونات المعبد (يمكنك تغييرها)
const ICONS = ['🛡️', '⚡', '🗝️', '🧭'];
const CARDS = [...ICONS, ...ICONS].sort(() => Math.random() - 0.5);

export default function MemoryGame({ onClose }: { onClose: () => void }) {
  const [opened, setOpened] = useState<number[]>([]);
  const [solved, setSolved] = useState<number[]>([]);
  const [won, setWon] = useState(false);
  const { completeGame } = useGameStore();

  const handleCardClick = (index: number) => {
    if (opened.length === 2 || solved.includes(index) || opened.includes(index)) return;
    
    const newOpened = [...opened, index];
    setOpened(newOpened);

    if (newOpened.length === 2) {
      if (CARDS[newOpened[0]] === CARDS[newOpened[1]]) {
        setSolved([...solved, ...newOpened]);
        setOpened([]);
        if (solved.length + 2 === CARDS.length) {
          setWon(true);
          completeGame?.('illumination', 7);
        }
      } else {
        setTimeout(() => setOpened([]), 1000);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-stone-950 p-4">
      {!won ? (
        <div className="grid grid-cols-4 gap-3">
          {CARDS.map((icon, i) => (
            <motion.button
              key={i}
              onClick={() => handleCardClick(i)}
              className="w-16 h-20 bg-stone-800 rounded-lg border-2 border-stone-700 flex items-center justify-center text-2xl"
              animate={{ rotateY: solved.includes(i) || opened.includes(i) ? 0 : 180 }}
            >
              {(solved.includes(i) || opened.includes(i)) ? icon : '?'}
            </motion.button>
          ))}
        </div>
      ) : (
        <div className="bg-stone-900 p-8 rounded-xl text-center border-2 border-[#cbb382]">
            <h3 className="text-2xl font-bold text-[#ead8b0] mb-4">🛡️لقد حصلت على الدرع بسبب ذاكرتك القوية! أحسنت</h3>
            <p className="text-[#d7be8f] mb-6 font-bold text-lg">+2 Points Bonus</p>
            <div className="text-6xl font-mono text-amber-500 tracking-widest bg-stone-950 px-8 py-6 rounded-xl font-bold border-4 border-[#5c4033]">7</div>
            <p className="mt-6 text-sm text-stone-400 font-bold">هذا هو الرقم الخاص بالمعبد، احتفظ به.</p>
            <button onClick={onClose} className="mt-8 px-8 py-3 bg-[#5c4033] text-[#e6d0a7] rounded font-bold">أكمل المغامرة</button>
        </div>
      )}
    </div>
  );
}