'use client';

import { useGameStore } from '@/store/gameStore';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';

const GRID = [
  [1,1,1,1,1,1,1,1,1,1,1],
  [1,2,0,0,0,0,0,0,1,0,1],
  [1,0,1,1,1,1,1,0,1,0,1],
  [1,0,0,0,1,0,0,0,1,0,1],
  [1,1,1,0,1,0,1,1,1,0,1],
  [1,0,0,0,0,0,1,0,0,0,1],
  [1,0,1,1,1,0,1,0,1,1,1],
  [1,0,1,0,0,0,1,0,0,0,1],
  [1,0,1,0,1,1,1,1,1,0,1],
  [1,0,0,0,1,0,0,0,0,0,1],
  [1,1,1,0,1,0,1,1,0,1,1],
  [1,0,0,0,0,0,1,0,0,1,1],
  [1,0,1,1,1,1,1,0,1,0,1],
  [1,0,0,0,0,0,0,0,1,0,1],
  [1,1,1,1,1,1,1,1,1,3,1],
];

const SPEED = 0.12;

export default function MazeGame({ onClose }: { onClose: () => void }) {
  const { completeGame } = useGameStore();
  const [playerPos, setPlayerPos] = useState({ col: 1.5, row: 1.5 });
  const [joystick, setJoystick] = useState({ active: false, x: 0, y: 0 });
  const [lives, setLives] = useState(3);
  const [won, setWon] = useState(false);

  useEffect(() => {
    if (!joystick.active || won) return;
    
    const interval = setInterval(() => {
      setPlayerPos(prev => {
        const nx = prev.col + joystick.x * SPEED;
        const ny = prev.row + joystick.y * SPEED;
        
        // 1. التحقق من الوصول للمخرج (القيمة 3)
        const cellType = GRID[Math.floor(ny)][Math.floor(nx)];
        if (cellType === 3) {
          setWon(true);
          completeGame?.('illumination', 7);
          return prev;
        }

        // 2. التحقق من الاصطدام بالحائط (القيمة 1)
        if (cellType === 1) {
          if (lives > 1) {
            setLives(l => l - 1);
            return { col: 1.5, row: 1.5 }; // إعادة للبداية
          } else {
            // الخسارة النهائية
            setLives(0);
            return { col: 1.5, row: 1.5 };
          }
        }
        
        return { col: nx, row: ny };
      });
    }, 16);
    return () => clearInterval(interval);
  }, [joystick, lives, won, completeGame]);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-stone-950 p-4 touch-none">
      {/* عداد الأرواح */}
      <div className="flex gap-2 mb-4">
        {[...Array(3)].map((_, i) => (
          <Heart key={i} className={i < lives ? "fill-red-500 text-red-500" : "text-stone-700"} />
        ))}
      </div>

      <div className="relative w-[300px] h-[400px] bg-black border-2 border-stone-800 rounded-xl overflow-hidden">
        <svg viewBox="0 0 11 15" className="w-full h-full">
           {GRID.map((row, r) => row.map((cell, c) => {
             if (cell === 1) return <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill="#1e0f04" />;
             if (cell === 3) return <text key={`${r}-${c}`} x={c + 0.5} y={r + 0.7} fontSize="0.8" textAnchor="middle">🛡️</text>;
             return null;
           }))}
           <circle cx={playerPos.col} cy={playerPos.row} r={0.25} fill="white" />
        </svg>
      </div>

      {/* الـ Joystick */}
      <div 
        className="mt-8 w-24 h-24 rounded-full bg-stone-800/50 border-4 border-stone-700 flex items-center justify-center relative"
        onPointerDown={() => setJoystick(j => ({ ...j, active: true }))}
        onPointerMove={(e) => {
          if (!joystick.active) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const dx = (e.clientX - (rect.left + rect.width / 2)) / 50;
          const dy = (e.clientY - (rect.top + rect.height / 2)) / 50;
          setJoystick({ active: true, x: Math.max(-1, Math.min(1, dx)), y: Math.max(-1, Math.min(1, dy)) });
        }}
        onPointerUp={() => setJoystick({ active: false, x: 0, y: 0 })}
      >
        <motion.div className="w-10 h-10 bg-amber-500 rounded-full" animate={{ x: joystick.x * 30, y: joystick.y * 30 }} />
      </div>

      {won && <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white font-bold text-2xl">تم استعادة الدرع!</div>}
      {lives === 0 && <div className="absolute inset-0 flex items-center justify-center bg-red-900/80 text-white font-bold text-2xl" onClick={() => {setLives(3); setPlayerPos({col: 1.5, row: 1.5})}}>خسرت... اضغط للبدء من جديد</div>}
    </div>
  );
}