'use client';

import { useGameStore } from '@/store/gameStore';
import { AnimatePresence, motion } from 'framer-motion';
import { DoorClosed, Link, Shield, Square, Sun } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function IlluminationGame({ onClose }: { onClose: () => void }) {
  const [pointer, setPointer] = useState({ x: 150, y: 150 });
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
    // 6 distinct zones to ensure pieces are far apart
    const zones = [
      { tMin: 10, tMax: 25, lMin: 10, lMax: 30 }, // Top-Left
      { tMin: 10, tMax: 25, lMin: 70, lMax: 90 }, // Top-Right
      { tMin: 40, tMax: 55, lMin: 10, lMax: 30 }, // Mid-Left
      { tMin: 40, tMax: 55, lMin: 70, lMax: 90 }, // Mid-Right
      { tMin: 75, tMax: 90, lMin: 10, lMax: 30 }, // Bottom-Left
      { tMin: 75, tMax: 90, lMin: 70, lMax: 90 }, // Bottom-Right
    ];

    // Shuffle zones
    for (let i = zones.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [zones[i], zones[j]] = [zones[j], zones[i]];
    }

    setItems(prev => prev.map((item, index) => {
      const zone = zones[index];
      const randomTop = zone.tMin + Math.random() * (zone.tMax - zone.tMin);
      const randomLeft = zone.lMin + Math.random() * (zone.lMax - zone.lMin);
      return {
        ...item,
        top: `${randomTop}%`,
        left: `${randomLeft}%`
      };
    }));
  }, []);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (won || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    // Offset the light by 50px upwards on touch screens so the finger doesn't hide it
    const yOffset = e.pointerType === 'touch' ? 50 : 0;
    setPointer({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top - yOffset,
    });
  };

  const handleItemClick = (id: string) => {
    if (!found.includes(id)) {
      const newFound = [...found, id];
      setFound(newFound);
      if (newFound.length === 6) {
        setTimeout(() => {
          setWon(true);
          setTimeout(() => completeGame('illumination', 7), 2000);
        }, 1000);
      }
    }
  };



  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 relative">
      <AnimatePresence>
        {!won ? (
          <motion.div 
            exit={{ opacity: 0 }}
            className="w-full h-full max-w-sm max-h-[600px] relative rounded-xl overflow-hidden border-2 border-stone-700 bg-stone-900 touch-none"
            ref={containerRef}
            onPointerMove={handlePointerMove}
            onPointerDown={handlePointerMove}
          >
            {/* Background elements to find */}
            <div className="absolute inset-0 p-4">
              {items.map((item) => {
                const isFound = found.includes(item.id);
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group transition-all duration-500"
                    style={{ 
                      top: item.top, left: item.left,
                      opacity: isFound ? 0.3 : 1,
                      scale: isFound ? 0.9 : 1
                    }}
                    disabled={isFound}
                  >
                    <div className="p-2">
                      <Icon size={24} className={isFound ? 'text-stone-500' : 'text-stone-300'} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* The Darkness Overlay with Lantern Mask */}
            <div 
              className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-1000"
              style={{
                opacity: 0.98,
                maskImage: `radial-gradient(circle 15px at ${pointer.x}px ${pointer.y}px, transparent 0%, black 100%)`,
                WebkitMaskImage: `radial-gradient(circle 15px at ${pointer.x}px ${pointer.y}px, transparent 0%, black 100%)`,
              }}
            />

            {/* Hint text at the bottom */}
            <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none z-10">
              <span className="text-stone-400 text-sm bg-black/50 px-4 py-2 rounded-full">
                اسحب الفانوس واكتشف 6 أشياء
              </span>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center bg-stone-200 p-10 rounded-xl shadow-[0_0_50px_rgba(255,255,255,0.2)] border-4 border-stone-400"
          >
            <Shield size={100} className="text-stone-600 mb-6 drop-shadow-xl" />
            <h2 className="text-3xl font-extrabold text-stone-800 mb-4">🛡️  استعدت الدرع</h2>
            <p className="text-stone-800 font-bold text-lg mb-6">+2 Points Bonus</p>
            <div className="text-6xl font-mono text-stone-900 tracking-widest bg-stone-300 px-8 py-6 rounded-xl font-bold shadow-[inset_0_0_20px_rgba(0,0,0,0.3)] border-4 border-stone-500 mb-4">
              7
            </div>
            <p className="text-stone-600 text-center font-bold max-w-xs mb-8 leading-relaxed">
              لقد أضأت الظلام وكشفت هذا الرقم السري الخاص بلعبة (الدرع 🛡️)!
            </p>
            <button onClick={onClose} className="px-8 py-3 bg-stone-700 hover:bg-stone-800 text-white font-bold rounded shadow-lg transition-colors">
              العودة للمعبد
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
