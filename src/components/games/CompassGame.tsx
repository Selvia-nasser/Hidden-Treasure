'use client';

import { useGameStore } from '@/store/gameStore';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export default function CompassGame({ onClose }: { onClose: () => void }) {
  const [pieces, setPieces] = useState([
    { id: 1, placed: false, x: -100, y: 150 },
    { id: 2, placed: false, x: 100, y: 120 },
    { id: 3, placed: false, x: -80, y: -130 },
    { id: 4, placed: false, x: 120, y: -100 },
  ]);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [won, setWon] = useState(false);
  
  const { completeGame } = useGameStore();
  const reqRef = useRef<number | null>(null);

  const allPlaced = pieces.every(p => p.placed);

  useEffect(() => {
    if (allPlaced && !spinning && !won) {
      setTimeout(() => setSpinning(true), 500);
    }
  }, [allPlaced, spinning, won]);

  useEffect(() => {
    if (spinning) {
      let lastTime = performance.now();
      const spin = (time: number) => {
        const delta = time - lastTime;
        lastTime = time;
        // Speed equivalent to 12 degrees per 60fps frame
        const speedPerMs = 10 / (1000 / 60);
        setRotation(r => (r + delta * speedPerMs) % 360);
        reqRef.current = requestAnimationFrame(spin);
      };
      reqRef.current = requestAnimationFrame(spin);
    }
    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, [spinning]);

  const handleStop = () => {
    if (!spinning) return;
    setSpinning(false);
    if (reqRef.current) cancelAnimationFrame(reqRef.current);
    
    // North is around 0 (or 360). Give a margin of 15 degrees.
    if (rotation < 15 || rotation > 345) {
      setWon(true);
      setTimeout(() => {
        completeGame('compass', 1);
      }, 3000);
    } else {
      // Failed, resume spinning after a short penalty
      setTimeout(() => setSpinning(true), 500);
    }
  };

  const handleDragEnd = (id: number, info: any) => {
    // A simple logic: if user drags it at all, we just snap it to place for ease of use on mobile.
    // Real implementation would check coordinates, but for a smooth experience without complex bounds mapping:
    setPieces(prev => prev.map(p => p.id === id ? { ...p, placed: true } : p));
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      {!won ? (
        <>
          <h2 className="text-xl font-bold text-gold-500 mb-8">
            {!allPlaced ? 'أعد تركيب البوصلة' : 'أوقف المؤشر عند الشمال (N)'}
          </h2>

          <div className="relative w-64 h-64 bg-stone-800/50 rounded-full border-4 border-dashed border-stone-600 flex items-center justify-center">
            {/* Center Pin */}
            <div className="absolute w-4 h-4 bg-gold-600 rounded-full z-20 shadow-lg" />
            
            {/* The assembled background */}
            {allPlaced && (
              <div className="absolute inset-0 rounded-full border-8 border-[#5c4033] bg-[#2a1e16] flex items-center justify-center shadow-[inset_0_0_30px_rgba(0,0,0,0.8)]">
                <div className="absolute top-2 w-12 h-12 bg-red-900/40 rounded-full blur-md" /> {/* North Highlight */}
                <span className="absolute top-2 text-red-500 font-extrabold text-2xl drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">N</span>
                <span className="absolute bottom-3 text-stone-600 font-bold">S</span>
                <span className="absolute right-3 text-stone-600 font-bold">E</span>
                <span className="absolute left-3 text-stone-600 font-bold">W</span>
                
                {/* 360 ticks background */}
                <div className="absolute inset-0 rounded-full bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-30 mix-blend-overlay" />
              </div>
            )}

            {/* The needle */}
            {allPlaced && (
              <motion.div 
                className="absolute w-4 h-56 z-10"
                style={{ rotate: rotation }}
              >
                <div className="w-full h-1/2 flex justify-center">
                  {/* North pointer (Red) */}
                  <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[112px] border-b-red-600 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                </div>
                <div className="w-full h-1/2 flex justify-center">
                  {/* South pointer (White) */}
                  <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[112px] border-t-stone-200 drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]" />
                </div>
              </motion.div>
            )}

            {/* The Pieces */}
            {!allPlaced && pieces.map((p, i) => {
              if (p.placed) return null;
              return (
                <motion.div
                  key={p.id}
                  drag
                  dragSnapToOrigin={false}
                  onDragEnd={(e, info) => handleDragEnd(p.id, info)}
                  initial={{ x: p.x, y: p.y }}
                  className="absolute w-24 h-24 bg-stone-700 border-2 border-stone-500 rounded-lg flex items-center justify-center cursor-grab active:cursor-grabbing shadow-xl"
                >
                  <span className="text-stone-400 opacity-50">قطعة {p.id}</span>
                </motion.div>
              );
            })}
          </div>

          {spinning && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleStop}
              className="mt-12 px-8 py-4 bg-red-800 text-white font-bold rounded-full shadow-[0_0_15px_rgba(220,38,38,0.6)]"
            >
              إيقاف!
            </motion.button>
          )}
        </>
      ) : (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center bg-[#e6d0a7] p-8 rounded-sm shadow-2xl relative"
        >
          <div className="absolute inset-0 border-2 border-[#cbb382] m-2 pointer-events-none" />
          <h3 className="text-2xl font-bold text-[#5c4033] mb-4">🧭 لقد أصلحت البوصلة!  احسنت</h3>
          <p className="text-[#8b6348] mb-6 font-bold text-lg">+2 Points Bonus</p>
          <div className="text-6xl font-mono text-gold-600 tracking-widest bg-stone-900 px-8 py-6 rounded-xl font-bold shadow-inner border-4 border-[#5c4033]">
            1
          </div>
          <p className="mt-6 text-sm text-stone-500 font-bold">هذا هو الرقم الخاص بلعبة البوصلة  احتفظ به.</p>
          <button onClick={onClose} className="mt-8 px-8 py-3 bg-[#5c4033] text-[#e6d0a7] rounded font-bold shadow-lg hover:bg-[#4a3424] transition-colors">
            أكمل المغامرة
          </button>
        </motion.div>
      )}
    </div>
  );
}
