'use client';

import { useGameStore } from '@/store/gameStore';
import { motion } from 'framer-motion';
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

  // منطق تحريك اللاعب بناءً على قيمة الـ Joystick
  useEffect(() => {
    if (!joystick.active) return;
    const interval = setInterval(() => {
      const moveX = joystick.x * SPEED;
      const moveY = joystick.y * SPEED;
      
      setPlayerPos(prev => {
        const nx = prev.col + moveX;
        const ny = prev.row + moveY;
        
        // التحقق من الحائط
        const hitWall = GRID[Math.floor(ny)][Math.floor(nx)] === 1;
        if (hitWall) {
           if(lives > 1) { setLives(l => l - 1); return { col: 1.5, row: 1.5 }; }
           return prev;
        }
        
        if (GRID[Math.floor(ny)][Math.floor(nx)] === 3) completeGame?.('illumination', 7);
        return { col: nx, row: ny };
      });
    }, 16);
    return () => clearInterval(interval);
  }, [joystick, lives, completeGame]);

  return (
    <div className="relative w-full h-full bg-stone-950 overflow-hidden touch-none flex flex-col items-center justify-center">
      
      {/* خريطة اللعبة */}
      <div className="relative w-[300px] h-[400px] bg-black border-2 border-stone-800 rounded-xl overflow-hidden">
        <svg viewBox="0 0 11 15" className="w-full h-full">
           {GRID.map((row, r) => row.map((cell, c) => 
             cell === 1 && <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill="#1e0f04" />
           ))}
           <circle cx={playerPos.col} cy={playerPos.row} r={0.3} fill="white" />
        </svg>
      </div>

      {/* الـ Joystick */}
      <div 
        className="mt-10 w-24 h-24 rounded-full bg-stone-800/50 border-4 border-stone-700 flex items-center justify-center relative touch-none"
        onPointerDown={(e) => setJoystick({ active: true, x: 0, y: 0 })}
        onPointerMove={(e) => {
          if (!joystick.active) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const dx = (e.clientX - (rect.left + rect.width / 2)) / 50;
          const dy = (e.clientY - (rect.top + rect.height / 2)) / 50;
          setJoystick({ ...joystick, x: Math.max(-1, Math.min(1, dx)), y: Math.max(-1, Math.min(1, dy)) });
        }}
        onPointerUp={() => setJoystick({ active: false, x: 0, y: 0 })}
      >
        <motion.div 
          className="w-10 h-10 bg-amber-500 rounded-full"
          animate={{ x: joystick.x * 30, y: joystick.y * 30 }}
        />
      </div>

      <p className="text-stone-500 mt-4 text-sm font-bold">استخدم الدائرة للتحكم</p>
    </div>
  );
}