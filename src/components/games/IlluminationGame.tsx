'use client';

import { useGameStore } from '@/store/gameStore';
import { AnimatePresence, motion } from 'framer-motion';
import { Shield, Heart, RotateCcw } from 'lucide-react';
import { useRef, useState, useCallback, useEffect } from 'react';

// ===== تعريف المتاهة =====
// كل خلية: 0 = ممر، 1 = حيط، 2 = بداية، 3 = نهاية (الدرع)
const MAZE_COLS = 11;
const MAZE_ROWS = 15;

const MAZE_GRID = [
  [1,1,1,1,1,1,1,1,1,1,1],
  [1,2,0,0,0,1,0,0,0,0,1],
  [1,1,1,1,0,1,0,1,1,0,1],
  [1,0,0,1,0,0,0,1,0,0,1],
  [1,0,1,1,1,1,0,1,0,1,1],
  [1,0,0,0,0,1,0,0,0,1,1],
  [1,1,1,0,1,1,1,1,0,1,1],
  [1,0,0,0,0,0,0,1,0,0,1],
  [1,0,1,1,1,0,1,1,1,0,1],
  [1,0,1,0,0,0,0,0,0,0,1],
  [1,0,1,0,1,1,1,1,1,1,1],
  [1,0,0,0,1,0,0,0,0,0,1],
  [1,1,1,0,1,0,1,1,0,1,1],
  [1,0,0,0,0,0,1,0,0,3,1],
  [1,1,1,1,1,1,1,1,1,1,1],
];

const START_COL = 1;
const START_ROW = 1;
const MAX_LIVES = 3;

export default function MazeGame({ onClose }: { onClose: () => void }) {
  const { completeGame } = useGameStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);
  const stateRef = useRef({
    playerX: 0,
    playerY: 0,
    lives: MAX_LIVES,
    won: false,
    cellSize: 0,
    offsetX: 0,
    offsetY: 0,
  });

  const [lives, setLives] = useState(MAX_LIVES);
  const [won, setWon] = useState(false);
  const [dead, setDead] = useState(false);
  const [started, setStarted] = useState(false);
  const [hitFlash, setHitFlash] = useState(false);

  const getCellSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return 30;
    return Math.floor(Math.min(canvas.width / MAZE_COLS, canvas.height / MAZE_ROWS));
  }, []);

  const resetPlayer = useCallback(() => {
    const cellSize = stateRef.current.cellSize;
    stateRef.current.playerX = START_COL * cellSize + cellSize / 2;
    stateRef.current.playerY = START_ROW * cellSize + cellSize / 2;
  }, []);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    const cellSize = getCellSize();
    stateRef.current.cellSize = cellSize;
    stateRef.current.offsetX = (canvas.width - cellSize * MAZE_COLS) / 2;
    stateRef.current.offsetY = (canvas.height - cellSize * MAZE_ROWS) / 2;
    resetPlayer();
  }, [getCellSize, resetPlayer]);

  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { playerX, playerY, cellSize, offsetX, offsetY } = stateRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // خلفية سوداء
    ctx.fillStyle = '#0a0806';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // رسم المتاهة
    for (let row = 0; row < MAZE_ROWS; row++) {
      for (let col = 0; col < MAZE_COLS; col++) {
        const cell = MAZE_GRID[row][col];
        const x = offsetX + col * cellSize;
        const y = offsetY + row * cellSize;

        if (cell === 1) {
          // حيط - لون بني داكن
          ctx.fillStyle = '#2a1a0a';
          ctx.fillRect(x, y, cellSize, cellSize);
          // تفاصيل الحيط
          ctx.fillStyle = '#3d2810';
          ctx.fillRect(x + 1, y + 1, cellSize - 2, 3);
          ctx.fillRect(x + 1, y + cellSize - 4, cellSize - 2, 3);
        } else if (cell === 3) {
          // الهدف - الدرع
          ctx.fillStyle = '#0a0806';
          ctx.fillRect(x, y, cellSize, cellSize);
          ctx.save();
          ctx.shadowColor = '#f59e0b';
          ctx.shadowBlur = 15;
          ctx.fillStyle = '#f59e0b';
          ctx.font = `${cellSize * 0.7}px serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('🛡️', x + cellSize / 2, y + cellSize / 2);
          ctx.restore();
        }
      }
    }

    // تأثير الضوء حول اللاعب
    const px = offsetX + playerX;
    const py = offsetY + playerY;
    const lightRadius = cellSize * 2.5;
    const gradient = ctx.createRadialGradient(px, py, 0, px, py, lightRadius);
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(0.4, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.97)');

    // ظلام كامل أولاً
    ctx.fillStyle = 'rgba(0,0,0,0.97)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ثقب الضوء
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    const lightGrad = ctx.createRadialGradient(px, py, 0, px, py, lightRadius);
    lightGrad.addColorStop(0, 'rgba(0,0,0,1)');
    lightGrad.addColorStop(0.6, 'rgba(0,0,0,0.9)');
    lightGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = lightGrad;
    ctx.beginPath();
    ctx.arc(px, py, lightRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // رسم اللاعب (نقطة ضوء)
    ctx.save();
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 20;
    const playerGrad = ctx.createRadialGradient(px, py, 0, px, py, cellSize * 0.35);
    playerGrad.addColorStop(0, '#fff8e1');
    playerGrad.addColorStop(0.5, '#fbbf24');
    playerGrad.addColorStop(1, 'rgba(251,191,36,0)');
    ctx.fillStyle = playerGrad;
    ctx.beginPath();
    ctx.arc(px, py, cellSize * 0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    animFrameRef.current = requestAnimationFrame(drawFrame);
  }, []);

  useEffect(() => {
    initCanvas();
    animFrameRef.current = requestAnimationFrame(drawFrame);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [initCanvas, drawFrame]);

  const getPointerPos = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const isWall = (px: number, py: number, cellSize: number, offsetX: number, offsetY: number) => {
    const margin = cellSize * 0.3;
    const corners = [
      { x: px - margin, y: py - margin },
      { x: px + margin, y: py - margin },
      { x: px - margin, y: py + margin },
      { x: px + margin, y: py + margin },
    ];
    for (const pt of corners) {
      const col = Math.floor((pt.x - offsetX) / cellSize);
      const row = Math.floor((pt.y - offsetY) / cellSize);
      if (row < 0 || row >= MAZE_ROWS || col < 0 || col >= MAZE_COLS) return true;
      if (MAZE_GRID[row][col] === 1) return true;
    }
    return false;
  };

  const checkWin = (px: number, py: number, cellSize: number, offsetX: number, offsetY: number) => {
    const col = Math.floor((px - offsetX) / cellSize);
    const row = Math.floor((py - offsetY) / cellSize);
    return row >= 0 && row < MAZE_ROWS && col >= 0 && col < MAZE_COLS && MAZE_GRID[row][col] === 3;
  };

  const handleMove = useCallback((clientX: number, clientY: number) => {
    const s = stateRef.current;
    if (s.won || dead || !started) return;

    const pos = getPointerPos(clientX, clientY);
    if (!pos) return;

    const newX = pos.x - s.offsetX;
    const newY = pos.y - s.offsetY;

    if (checkWin(newX, newY, s.cellSize, 0, 0)) {
      s.won = true;
      s.playerX = newX;
      s.playerY = newY;
      setWon(true);
      setTimeout(() => completeGame?.('maze', 7), 1500);
      return;
    }

    if (isWall(newX, newY, s.cellSize, 0, 0)) {
      const newLives = s.lives - 1;
      s.lives = newLives;
      setLives(newLives);
      setHitFlash(true);
      setTimeout(() => setHitFlash(false), 400);
      if (typeof window !== 'undefined' && window.navigator.vibrate) {
        window.navigator.vibrate([100, 50, 100]);
      }
      if (newLives <= 0) {
        setDead(true);
      } else {
        resetPlayer();
      }
      return;
    }

    s.playerX = newX;
    s.playerY = newY;
  }, [dead, started, resetPlayer, completeGame]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (touch) handleMove(touch.clientX, touch.clientY);
  }, [handleMove]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (e.pointerType === 'mouse') handleMove(e.clientX, e.clientY);
  }, [handleMove]);

  const handleStart = useCallback((e: React.TouchEvent | React.PointerEvent) => {
    if (!started) setStarted(true);
    let clientX: number, clientY: number;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.PointerEvent).clientX;
      clientY = (e as React.PointerEvent).clientY;
    }
    handleMove(clientX, clientY);
  }, [started, handleMove]);

  const restart = () => {
    stateRef.current.lives = MAX_LIVES;
    stateRef.current.won = false;
    resetPlayer();
    setLives(MAX_LIVES);
    setWon(false);
    setDead(false);
    setStarted(false);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-3 select-none">
      <AnimatePresence mode="wait">
        {!won && !dead ? (
          <motion.div
            key="game"
            className="w-full max-w-sm flex flex-col gap-2"
            exit={{ opacity: 0 }}
          >
            {/* الـ Header */}
            <div className="flex items-center justify-between px-1">
              <div className="flex gap-1">
                {Array.from({ length: MAX_LIVES }).map((_, i) => (
                  <Heart
                    key={i}
                    size={20}
                    className={`transition-all duration-300 ${i < lives ? 'text-red-500 fill-red-500' : 'text-stone-700'}`}
                  />
                ))}
              </div>
              <span className="text-amber-500/70 text-xs font-bold">أوصل للدرع 🛡️</span>
            </div>

            {/* الـ Canvas */}
            <div
              ref={containerRef}
              className={`relative w-full rounded-2xl overflow-hidden border-2 transition-all duration-100 ${hitFlash ? 'border-red-500' : 'border-stone-800'}`}
              style={{ height: '480px', background: '#0a0806' }}
            >
              <canvas
                ref={canvasRef}
                className="w-full h-full"
                onPointerMove={handlePointerMove}
                onPointerDown={handleStart}
                onTouchMove={handleTouchMove}
                onTouchStart={handleStart}
                style={{ touchAction: 'none', display: 'block' }}
              />

              {/* شاشة البداية */}
              {!started && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 gap-4">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="text-5xl"
                  >
                    🔦
                  </motion.div>
                  <p className="text-amber-400 font-bold text-center text-sm px-8 leading-relaxed">
                    حرّك إصبعك داخل المتاهة{'\n'}وصل للدرع بدون ما تلمس الحيطان
                  </p>
                  <p className="text-stone-500 text-xs">عندك 3 أرواح</p>
                </div>
              )}

              {hitFlash && (
                <div className="absolute inset-0 bg-red-500/20 pointer-events-none rounded-2xl" />
              )}
            </div>
          </motion.div>
        ) : dead ? (
          <motion.div
            key="dead"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center bg-stone-900 border-2 border-red-900 rounded-3xl p-8 max-w-sm w-full text-center gap-4"
          >
            <div className="text-5xl">💀</div>
            <h2 className="text-xl font-black text-red-400">خسرت الأرواح كلها!</h2>
            <p className="text-stone-400 text-sm">الظلام ابتلعك… حاول تاني</p>
            <button
              onClick={restart}
              className="flex items-center gap-2 px-6 py-3 bg-stone-800 hover:bg-stone-700 text-amber-400 font-bold rounded-xl border border-stone-700 transition-all active:scale-95"
            >
              <RotateCcw size={18} />
              العب تاني
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="win"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center bg-stone-900 p-8 rounded-3xl shadow-[0_0_50px_rgba(251,191,36,0.2)] border-2 border-amber-500/50 max-w-sm w-full text-center"
          >
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-amber-500 blur-2xl opacity-20 animate-pulse" />
              <Shield size={80} className="text-amber-500 relative z-10" />
            </div>
            <h2 className="text-2xl font-black text-white mb-1">🛡️ استعدت الدرع!</h2>
            <p className="text-emerald-400 font-bold text-sm mb-5">+2 نقطة للفريق</p>
            <div className="text-6xl font-mono text-stone-900 bg-amber-500 px-10 py-4 rounded-2xl font-black border-b-4 border-amber-700 mb-5">
              7
            </div>
            <p className="text-stone-400 text-sm mb-6 leading-relaxed">
              شققت طريقك في الظلام ووصلت للدرع!
            </p>
            <button
              onClick={onClose}
              className="w-full py-3 bg-stone-800 hover:bg-stone-700 text-amber-500 font-bold rounded-xl border border-stone-700 transition-all active:scale-95"
            >
              العودة للمعبد
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
