'use client';

import { useGameStore } from '@/store/gameStore';
import { useCallback, useEffect, useRef, useState } from 'react';

// 2 هي نقطة البداية، 3 هي النهاية (الدرع)
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

const ROWS = GRID.length;
const COLS = GRID[0].length;
const MAX_LIVES = 3;
const START_POS = { col: 1.5, row: 1.5 };
const SPEED = 0.15; // سرعة موزونة
const LIGHT_R_FACTOR = 1.8;

export default function MazeGame({ onClose }: { onClose: () => void }) {
  const { completeGame } = useGameStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState(30);
  const cellSizeRef = useRef(30);

  const playerRef = useRef({ ...START_POS });
  const [playerPos, setPlayerPos] = useState({ ...START_POS });

  const lastTouchRef = useRef<{ x: number; y: number } | null>(null);
  const pendingMove = useRef<{ dx: number; dy: number } | null>(null);
  const rafRef = useRef<number>(0);

  const [lives, setLives] = useState(MAX_LIVES);
  const livesRef = useRef(MAX_LIVES);
  const [won, setWon] = useState(false);
  const [dead, setDead] = useState(false);
  const [started, setStarted] = useState(false);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const measure = () => {
      const el = containerRef.current;
      if (!el) return;
      const { width } = el.getBoundingClientRect();
      const cs = width / COLS;
      cellSizeRef.current = cs;
      setCellSize(cs);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const movePlayer = useCallback((dx: number, dy: number) => {
    const len = Math.hypot(dx, dy);
    if (len === 0) return;
    
    // Normalize movement
    const moveX = (dx / len) * SPEED;
    const moveY = (dy / len) * SPEED;
    
    const cur = playerRef.current;
    const nx = Math.max(0.3, Math.min(COLS - 0.3, cur.col + moveX));
    const ny = Math.max(0.3, Math.min(ROWS - 0.3, cur.row + moveY));

    // Collision & Goal
    const hitWall = [
      {c: nx-0.2, r: ny-0.2}, {c: nx+0.2, r: ny-0.2},
      {c: nx-0.2, r: ny+0.2}, {c: nx+0.2, r: ny+0.2}
    ].some(p => GRID[Math.floor(p.r)][Math.floor(p.c)] === 1);

    if (hitWall) {
      if (livesRef.current > 1) {
        livesRef.current -= 1;
        setLives(livesRef.current);
        setFlash(true);
        setTimeout(() => setFlash(false), 200);
        playerRef.current = { ...START_POS };
        setPlayerPos({ ...START_POS });
        if (navigator.vibrate) navigator.vibrate(100);
      } else {
        setDead(true);
      }
    } else if (GRID[Math.floor(ny)][Math.floor(nx)] === 3) {
      setWon(true);
      setTimeout(() => completeGame?.('illumination', 7), 1000);
    } else {
      playerRef.current = { col: nx, row: ny };
      setPlayerPos({ col: nx, row: ny });
    }
  }, [completeGame]);

  useEffect(() => {
    const tick = () => {
      if (pendingMove.current && !won && !dead) {
        movePlayer(pendingMove.current.dx, pendingMove.current.dy);
        pendingMove.current = null;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [movePlayer, won, dead]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-stone-950">
      <div 
        ref={containerRef}
        className={`relative touch-none border-2 ${flash ? 'border-red-500' : 'border-stone-800'}`}
        style={{ width: '100%', maxWidth: '400px', aspectRatio: `${COLS}/${ROWS}`, background: '#0a0806' }}
        onPointerDown={(e) => { setStarted(true); lastTouchRef.current = { x: e.clientX, y: e.clientY }; }}
        onPointerMove={(e) => {
          if (!lastTouchRef.current) return;
          pendingMove.current = { dx: e.clientX - lastTouchRef.current.x, dy: e.clientY - lastTouchRef.current.y };
          lastTouchRef.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerUp={() => lastTouchRef.current = null}
      >
        <svg width="100%" height="100%" viewBox={`0 0 ${COLS * 10} ${ROWS * 10}`}>
          <defs>
            <mask id="light">
              <rect width="100%" height="100%" fill="black" />
              <circle cx={playerPos.col * 10} cy={playerPos.row * 10} r={LIGHT_R_FACTOR * 10} fill="url(#grad)" />
            </mask>
            <radialGradient id="grad"><stop offset="0%" stopColor="white"/><stop offset="100%" stopColor="transparent"/></radialGradient>
          </defs>
          
          {GRID.map((row, ri) => row.map((cell, ci) => cell === 1 && (
            <rect key={`${ri}-${ci}`} x={ci*10} y={ri*10} width={10} height={10} fill="#1e0f04" />
          )))}
          
          <rect width="100%" height="100%" fill="black" mask="url(#light)" />
          <circle cx={playerPos.col * 10} cy={playerPos.row * 10} r={2} fill="white" />
        </svg>
      </div>
      
      {/* UI Elements... (تكملة الـ UI بنفس منطقك) */}
    </div>
  );
}