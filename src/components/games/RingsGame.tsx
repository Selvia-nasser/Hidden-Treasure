'use client';

import { useGameStore } from '@/store/gameStore';
import { AnimatePresence, motion } from 'framer-motion';
import { Key } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function RingsGame({ onClose }: { onClose: () => void }) {
  // وضعية بداية موزونة ومحيرة بشكل ذكي
  const [rotations, setRotations] = useState([90, 180, 270]);
  const [won, setWon] = useState(false);
  const { completeGame } = useGameStore();

  const handleRotate = (index: number) => {
    if (won) return;
    const newRotations = [...rotations];
    
    // الدوران الثابت بمقدار 90 درجة
    newRotations[index] = (newRotations[index] + 90) % 360;
    
    // نظام التتابع العكسي (الصعوبة الوسطى)
    if (index === 0) {
      // الداخلية تحرك الوسطى في عكس الاتجاه
      newRotations[1] = (newRotations[1] - 90 + 360) % 360;
    } else if (index === 1) {
      // الوسطى تحرك الخارجية في عكس الاتجاه
      newRotations[2] = (newRotations[2] - 90 + 360) % 360;
    }
    // index === 2 (الخارجية) تدور بمفردها تماماً لتعديل اللمسات الأخيرة

    setRotations(newRotations);
  };

  useEffect(() => {
    // الفوز عند محاذاة الخطوط الذهبية رأسياً (0 أو 180 درجة)
    const isWin = rotations.every(r => r === 0 || r === 180);
    
    if (isWin && !won) {
      setWon(true);
      const timer = setTimeout(() => {
        if (completeGame) completeGame('maze', 9);
      }, 1000); 
      return () => clearTimeout(timer);
    }
  }, [rotations, won, completeGame]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 select-none">
      <AnimatePresence mode="wait">
        {!won ? (
          <motion.div 
            key="game"
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex flex-col items-center"
          >
            <h2 className="text-2xl font-black text-amber-400 mb-2 tracking-wide text-center drop-shadow">
              ⚙️ تحدي تروس المعبد
            </h2>
            <div className="relative w-64 h-64 flex items-center justify-center bg-stone-950/40 rounded-full p-2 border-2 border-stone-800 shadow-2xl">
              {/* قطعة التثبيت المركزية */}
              <div className="absolute w-12 h-12 bg-stone-800 rounded-full border-2 border-stone-700 z-40 shadow-inner flex items-center justify-center">
                <div className="w-2 h-8 bg-amber-500/40 rounded-full" />
              </div>

              {/* الحلقة الداخلية */}
              <motion.div
                animate={{ rotate: rotations[0] }}
                transition={{ type: "spring", stiffness: 180, damping: 14 }}
                onClick={() => handleRotate(0)}
                className="absolute w-28 h-28 border-[12px] border-stone-700 rounded-full z-30 cursor-pointer shadow-[0_0_15px_rgba(0,0,0,0.6)] flex items-center justify-center hover:border-stone-600 transition-colors"
              >
                <div className="absolute top-[-12px] w-4 h-6 bg-amber-400 rounded-sm shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
                <div className="absolute bottom-[-12px] w-4 h-6 bg-amber-400 rounded-sm shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
              </motion.div>

              {/* الحلقة الوسطى */}
              <motion.div
                animate={{ rotate: rotations[1] }}
                transition={{ type: "spring", stiffness: 180, damping: 14 }}
                onClick={() => handleRotate(1)}
                className="absolute w-44 h-44 border-[16px] border-stone-800 rounded-full z-20 cursor-pointer shadow-[0_0_20px_rgba(0,0,0,0.7)] flex items-center justify-center hover:border-stone-700 transition-colors"
              >
                <div className="absolute top-[-16px] w-4 h-8 bg-amber-400 rounded-sm shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
                <div className="absolute bottom-[-16px] w-4 h-8 bg-amber-400 rounded-sm shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
              </motion.div>

              {/* الحلقة الخارجية */}
              <motion.div
                animate={{ rotate: rotations[2] }}
                transition={{ type: "spring", stiffness: 180, damping: 14 }}
                onClick={() => handleRotate(2)}
                className="absolute w-64 h-64 border-[20px] border-stone-900 rounded-full z-10 cursor-pointer shadow-[0_0_25px_rgba(0,0,0,0.8)] flex items-center justify-center hover:border-stone-800 transition-colors"
              >
                <div className="absolute top-[-20px] w-4 h-10 bg-amber-400 rounded-sm shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
                <div className="absolute bottom-[-20px] w-4 h-10 bg-amber-400 rounded-sm shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
              </motion.div>
            </div>
          </motion.div>
        ) : (
          /* شاشة الفوز */
          <motion.div 
            key="reward"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center bg-stone-900 p-8 sm:p-10 rounded-2xl shadow-[0_0_50px_rgba(245,158,11,0.3)] border-2 border-amber-500/50 max-w-sm w-full mx-4 text-center"
          >
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-amber-400 blur-2xl opacity-40 animate-pulse" />
              <Key size={90} className="text-amber-400 relative z-10 drop-shadow-[0_0_15px_rgba(245,158,11,0.7)]" />
            </div>

            <h2 className="text-3xl font-black text-amber-400 mb-2 tracking-wide">
              🎉 رائع! وجدت المفتاح
            </h2>
            <p className="text-emerald-400 font-extrabold text-lg mb-6 bg-emerald-950/50 px-4 py-1 rounded-full border border-emerald-800/50">
              حصلت على: +2 نقطة إضافية
            </p>

            <div className="text-6xl font-mono text-stone-950 tracking-widest bg-gradient-to-b from-amber-300 to-amber-500 px-10 py-4 rounded-2xl font-black shadow-[inset_0_2px_4px_rgba(255,255,255,0.4)] border-b-4 border-amber-700 mb-6">
              9
            </div>

            <p className="text-stone-300 font-bold text-base mb-8 leading-relaxed">
              تطابقت الخطوط بنجاح وظهر لك مفتاح المعبد السري ورقم اللعبة الخاص بك!
            </p>

            <button 
              onClick={onClose} 
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-black text-lg rounded-xl shadow-lg shadow-amber-600/20 transition-all transform active:scale-95"
            >
              العودة للمعبد 🏰
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}