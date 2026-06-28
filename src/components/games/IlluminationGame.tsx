'use client';

import { useGameStore } from '@/store/gameStore';
import { AnimatePresence, motion } from 'framer-motion';
import { DoorClosed, Link, Shield, Square, Sun, Search, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState, useCallback } from 'react';

export default function IlluminationGame({ onClose }: { onClose: () => void }) {
  const [pointer, setPointer] = useState({ x: -100, y: -100 });
  const [found, setFound] = useState<string[]>([]);
  const [won, setWon] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { completeGame } = useGameStore();

  const [items, setItems] = useState([
    { id: 'chain', icon: Link, label: 'السلسلة', top: '20%', left: '15%' },
    { id: 'stone', icon: Square, label: 'الحجر', top: '70%', left: '80%' },
    { id: 'window', icon: Sun, label: 'النافذة', top: '15%', left: '75%' },
    { id: 'door', icon: DoorClosed, label: 'الباب', top: '80%', left: '20%' },
    { id: 'shield_part', icon: Shield, label: 'الدرع', top: '45%', left: '45%' },
    { id: 'key_hole', icon: Square, label: 'الزاوية', top: '90%', left: '50%' },
  ]);

  useEffect(() => {
    const zones = [
      { tMin: 10, tMax: 25, lMin: 10, lMax: 30 },
      { tMin: 10, tMax: 25, lMin: 70, lMax: 90 },
      { tMin: 40, tMax: 55, lMin: 10, lMax: 30 },
      { tMin: 40, tMax: 55, lMin: 70, lMax: 90 },
      { tMin: 75, tMax: 90, lMin: 10, lMax: 30 },
      { tMin: 75, tMax: 90, lMin: 70, lMax: 90 },
    ];
    for (let i = zones.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [zones[i], zones[j]] = [zones[j], zones[i]];
    }
    setItems(prev => prev.map((item, index) => {
      const zone = zones[index];
      return {
        ...item,
        top: `${zone.tMin + Math.random() * (zone.tMax - zone.tMin)}%`,
        left: `${zone.lMin + Math.random() * (zone.lMax - zone.lMin)}%`,
      };
    }));
  }, []);

  const triggerVibrate = useCallback(() => {
    if (typeof window !== 'undefined' && window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
  }, []);

  const updatePointer = (clientX: number, clientY: number) => {
    if (won || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setPointer({
      x: clientX - rect.left,
      y: clientY - rect.top - 70, // رفع الفانوس عن الإصبع
    });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse') updatePointer(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (touch) updatePointer(touch.clientX, touch.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) updatePointer(touch.clientX, touch.clientY);
  };

  const handleItemClick = (id: string) => {
    if (!found.includes(id)) {
      triggerVibrate();
      const newFound = [...found, id];
      setFound(newFound);
      if (newFound.length === 6) {
        setTimeout(() => {
          setWon(true);
          setTimeout(() => completeGame?.('illumination', 7), 2000);
        }, 800);
      }
    }
  };

  const lanternRadius = 70;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 relative select-none">
      <AnimatePresence mode="wait">
        {!won ? (
          <motion.div
            key="game-screen"
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full h-[500px] max-w-sm relative rounded-3xl overflow-hidden border-4 border-stone-800 bg-[#0a0a0a] shadow-2xl"
            ref={containerRef}
            onPointerMove={handlePointerMove}
            onTouchMove={handleTouchMove}
            onTouchStart={handleTouchStart}
            style={{ touchAction: 'none' }}
          >
            {/* الأيتمز - دايماً موجودين في الـ DOM، الظلام بس بيغطيهم */}
            <div className="absolute inset-0">
              {items.map((item) => {
                const isFound = found.includes(item.id);
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    disabled={isFound}
                    className="absolute -translate-x-1/2 -translate-y-1/2 p-4 transition-all duration-300"
                    style={{
                      top: item.top,
                      left: item.left,
                      opacity: isFound ? 0.4 : 1,
                      zIndex: 10,
                    }}
                  >
                    <div className={`relative ${isFound ? 'text-stone-600' : 'text-amber-400'} drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]`}>
                      <Icon size={isFound ? 24 : 32} />
                      {isFound && (
                        <Sparkles size={12} className="absolute -top-1 -right-1 text-amber-500" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* طبقة الظلام - mask-image عشان الأيتمز تفضل قابلة للضغط */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundColor: 'rgba(0,0,0,0.97)',
                maskImage: pointer.x >= 0
                  ? `radial-gradient(circle ${lanternRadius}px at ${pointer.x}px ${pointer.y}px, transparent 0%, transparent 40%, black 100%)`
                  : undefined,
                WebkitMaskImage: pointer.x >= 0
                  ? `radial-gradient(circle ${lanternRadius}px at ${pointer.x}px ${pointer.y}px, transparent 0%, transparent 40%, black 100%)`
                  : undefined,
                zIndex: 5,
              }}
            />

            {/* حلقة الكشاف */}
            {pointer.x >= 0 && (
              <div
                className="absolute rounded-full pointer-events-none border border-amber-500/20"
                style={{
                  width: lanternRadius * 2,
                  height: lanternRadius * 2,
                  left: pointer.x - lanternRadius,
                  top: pointer.y - lanternRadius,
                  zIndex: 4,
                }}
              />
            )}

            {/* شريط التقدم */}
            <div className="absolute top-4 left-0 right-0 flex justify-center z-20 pointer-events-none">
              <div className="bg-black/70 border border-stone-700 px-4 py-1 rounded-full flex gap-2 items-center">
                <Search size={14} className="text-amber-500" />
                <span className="text-stone-300 text-xs font-bold">
                  وجدتم {found.length} من 6
                </span>
              </div>
            </div>

            {/* مؤشرات التقدم */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20 pointer-events-none">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    found.includes(item.id) ? 'bg-amber-400' : 'bg-stone-700'
                  }`}
                />
              ))}
            </div>

            {/* شاشة البداية */}
            {pointer.x < 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-center p-10 z-20">
                <motion.p
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-amber-500 font-bold text-sm leading-relaxed"
                >
                  المس الشاشة وحرّك الكشاف{'\n'}للبحث عن 6 قطع أثرية
                </motion.p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="success-screen"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center bg-stone-900 p-8 rounded-3xl shadow-[0_0_50px_rgba(251,191,36,0.2)] border-2 border-amber-500/50 max-w-sm w-full text-center"
          >
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-amber-500 blur-2xl opacity-20 animate-pulse" />
              <Shield size={90} className="text-amber-500 relative z-10 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">🛡️ استعدتم الدرع!</h2>
            <p className="text-emerald-400 font-bold mb-6">+2 نقطة إضافية للفريق</p>
            <div className="text-6xl font-mono text-stone-900 tracking-widest bg-amber-500 px-10 py-5 rounded-2xl font-black shadow-inner border-b-4 border-amber-700 mb-6">
              7
            </div>
            <p className="text-stone-400 text-sm mb-8 leading-relaxed px-4">
              أضأتم عتمة المعبد وكشفتم الرقم السري لدرع الحماية. احتفظوا به جيداً!
            </p>
            <button
              onClick={onClose}
              className="w-full py-4 bg-stone-800 hover:bg-stone-700 text-amber-500 font-bold rounded-xl border border-stone-700 transition-all active:scale-95"
            >
              العودة للمعبد
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}