'use client';

import { useGameStore } from '@/store/gameStore';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, RotateCcw, Shield } from 'lucide-react';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';

// ===== المتاهة =====
// 0=ممر  1=حيطة  2=بداية  3=نهاية
const GRID = [
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
const ROWS = GRID.length;
const COLS = GRID[0].length;
const MAX_LIVES = 3;

// موضع البداية
const START = { row: 1, col: 1 };

export default function MazeGame({ onClose }: { onClose: () => void }) {
  const { completeGame } = useGameStore();
  const svgRef = useRef<SVGSVGElement>(null);

  // أبعاد الـ SVG الفعلية
  const [svgSize, setSvgSize] = useState({ w: 330, h: 480 });

  useLayoutEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const obs = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      if (r.width > 0) setSvgSize({ w: r.width, h: r.height });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const cellW = svgSize.w / COLS;
  const cellH = svgSize.h / ROWS;

  // موضع اللاعب بالـ pixel داخل الـ SVG
  const [player, setPlayer] = useState({
    x: START.col * cellW + cellW / 2,
    y: START.row * cellH + cellH / 2,
  });

  // reset لما يتغير حجم الـ SVG
  const playerRef = useRef(player);
  playerRef.current = player;

  const [lives, setLives] = useState(MAX_LIVES);
  const [won, setWon] = useState(false);
  const [dead, setDead] = useState(false);
  const [started, setStarted] = useState(false);
  const [flash, setFlash] = useState(false);
  const livesRef = useRef(MAX_LIVES);

  const resetPlayer = useCallback(() => {
    setPlayer({
      x: START.col * cellW + cellW / 2,
      y: START.row * cellH + cellH / 2,
    });
  }, [cellW, cellH]);

  // تحويل pixel → خلية
  const pixelToCell = (px: number, py: number) => ({
    col: Math.floor(px / cellW),
    row: Math.floor(py / cellH),
  });

  const isWall = (px: number, py: number) => {
    const margin = Math.min(cellW, cellH) * 0.28;
    const pts = [
      { x: px - margin, y: py - margin },
      { x: px + margin, y: py - margin },
      { x: px - margin, y: py + margin },
      { x: px + margin, y: py + margin },
    ];
    return pts.some(pt => {
      const { col, row } = pixelToCell(pt.x, pt.y);
      if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return true;
      return GRID[row][col] === 1;
    });
  };

  const isGoal = (px: number, py: number) => {
    const { col, row } = pixelToCell(px, py);
    return row >= 0 && row < ROWS && col >= 0 && col < COLS && GRID[row][col] === 3;
  };

  // تحويل موضع اللمس/الماوس لـ SVG coordinates
  const toSVGCoords = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    return {
      x: (clientX - rect.left) * (svgSize.w / rect.width),
      y: (clientY - rect.top) * (svgSize.h / rect.height),
    };
  };

  const handleHit = useCallback(() => {
    const newLives = livesRef.current - 1;
    livesRef.current = newLives;
    setLives(newLives);
    setFlash(true);
    setTimeout(() => setFlash(false), 350);
    if (navigator.vibrate) navigator.vibrate([80, 40, 80]);
    if (newLives <= 0) {
      setDead(true);
    } else {
      resetPlayer();
    }
  }, [resetPlayer]);

  const move = useCallback((clientX: number, clientY: number) => {
    if (won || dead) return;
    const coords = toSVGCoords(clientX, clientY);
    if (!coords) return;

    const { x, y } = coords;

    // حدود الـ SVG
    if (x < 0 || y < 0 || x > svgSize.w || y > svgSize.h) return;

    if (isGoal(x, y)) {
      setPlayer({ x, y });
      setWon(true);
      setTimeout(() => completeGame?.('illumination', 7), 1200);
      return;
    }

    if (isWall(x, y)) {
      handleHit();
      return;
    }

    setPlayer({ x, y });
  }, [won, dead, svgSize, handleHit, completeGame]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (!started) setStarted(true);
    const t = e.touches[0];
    if (t) move(t.clientX, t.clientY);
  }, [started, move]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!started) setStarted(true);
    const t = e.touches[0];
    if (t) move(t.clientX, t.clientY);
  }, [started, move]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!started) setStarted(true);
    move(e.clientX, e.clientY);
  }, [started, move]);

  const restart = () => {
    livesRef.current = MAX_LIVES;
    setLives(MAX_LIVES);
    setWon(false);
    setDead(false);
    setStarted(false);
    setFlash(false);
    resetPlayer();
  };

  const LIGHT_R = Math.min(cellW, cellH) * 2.2;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-3 select-none">
      <AnimatePresence mode="wait">
        {!won && !dead ? (
          <motion.div key="game" className="w-full max-w-sm flex flex-col gap-2" exit={{ opacity: 0 }}>

            {/* شريط الأرواح */}
            <div className="flex items-center justify-between px-1">
              <div className="flex gap-1">
                {Array.from({ length: MAX_LIVES }).map((_, i) => (
                  <Heart key={i} size={20}
                    className={`transition-all duration-300 ${i < lives ? 'text-red-500 fill-red-500' : 'text-stone-700'}`} />
                ))}
              </div>
              <span className="text-amber-500/70 text-xs font-bold">أوصل للدرع 🛡️</span>
            </div>

            {/* المتاهة */}
            <div
              className={`relative rounded-2xl overflow-hidden border-2 transition-colors duration-150 ${flash ? 'border-red-500' : 'border-stone-800'}`}
              style={{ background: '#0a0806' }}
            >
              <svg
                ref={svgRef}
                width="100%"
                height="480"
                viewBox={`0 0 ${svgSize.w} ${svgSize.h}`}
                style={{ display: 'block', touchAction: 'none', cursor: 'none' }}
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
                onTouchStart={handleTouchStart}
              >
                <defs>
                  {/* قناع الضوء */}
                  <radialGradient id="light" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="white" stopOpacity="1" />
                    <stop offset="55%" stopColor="white" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="white" stopOpacity="0" />
                  </radialGradient>
                  <mask id="lightMask">
                    <rect width={svgSize.w} height={svgSize.h} fill="black" />
                    <ellipse
                      cx={player.x} cy={player.y}
                      rx={LIGHT_R} ry={LIGHT_R}
                      fill="url(#light)"
                    />
                  </mask>
                </defs>

                {/* خلفية سوداء */}
                <rect width={svgSize.w} height={svgSize.h} fill="#0a0806" />

                {/* خلايا المتاهة - الكل مرئي */}
                {GRID.map((row, ri) =>
                  row.map((cell, ci) => {
                    const x = ci * cellW;
                    const y = ri * cellH;
                    if (cell === 1) return (
                      <g key={`${ri}-${ci}`}>
                        <rect x={x} y={y} width={cellW} height={cellH} fill="#1e0f04" />
                        <rect x={x+1} y={y+1} width={cellW-2} height={3} fill="#2d1a09" />
                        <rect x={x+1} y={y+cellH-4} width={cellW-2} height={3} fill="#110800" />
                      </g>
                    );
                    if (cell === 3) return (
                      <text key={`${ri}-${ci}`}
                        x={x + cellW / 2} y={y + cellH / 2}
                        textAnchor="middle" dominantBaseline="middle"
                        fontSize={cellW * 0.65}
                      >🛡️</text>
                    );
                    return null;
                  })
                )}

                {/* طبقة الظلام مع ثقب الضوء */}
                <rect
                  width={svgSize.w} height={svgSize.h}
                  fill="rgba(0,0,0,0.97)"
                  mask="url(#lightMask)"
                />

                {/* اللاعب - كرة ضوء */}
                <circle cx={player.x} cy={player.y} r={cellW * 0.28} fill="#fff8e1" opacity="0.95" />
                <circle cx={player.x} cy={player.y} r={cellW * 0.18} fill="white" />
              </svg>

              {/* وميض أحمر */}
              {flash && (
                <div className="absolute inset-0 bg-red-500/25 pointer-events-none rounded-2xl" />
              )}

              {/* شاشة البداية */}
              {!started && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 gap-3 rounded-2xl">
                  <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ repeat: Infinity, duration: 1.4 }}
                    className="text-5xl"
                  >🔦</motion.div>
                  <p className="text-amber-400 font-bold text-center text-sm px-8 leading-relaxed">
                    حرّك إصبعك في الممرات{'\n'}وأوصل للدرع بدون ما تلمس الحيطان
                  </p>
                  <p className="text-stone-500 text-xs">عندك 3 أرواح ❤️</p>
                </div>
              )}
            </div>
          </motion.div>

        ) : dead ? (
          <motion.div key="dead"
            initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center bg-stone-900 border-2 border-red-900 rounded-3xl p-8 max-w-sm w-full text-center gap-4"
          >
            <div className="text-5xl">💀</div>
            <h2 className="text-xl font-black text-red-400">خسرت الأرواح كلها!</h2>
            <p className="text-stone-400 text-sm">الظلام ابتلعك… حاول تاني</p>
            <button onClick={restart}
              className="flex items-center gap-2 px-6 py-3 bg-stone-800 hover:bg-stone-700 text-amber-400 font-bold rounded-xl border border-stone-700 transition-all active:scale-95"
            >
              <RotateCcw size={18} /> العب تاني
            </button>
          </motion.div>

        ) : (
          <motion.div key="win"
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
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
            <button onClick={onClose}
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