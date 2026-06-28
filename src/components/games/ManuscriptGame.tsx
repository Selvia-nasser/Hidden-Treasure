'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

const INITIAL_PIECES = Array.from({ length: 25 }, (_, i) => ({ id: i + 1, correct: i + 1 }))
  .sort(() => Math.random() - 0.5);

export default function ManuscriptGame({ onClose }: { onClose: () => void }) {
  const [pieces, setPieces] = useState(INITIAL_PIECES);
  const [selected, setSelected] = useState<number | null>(null);
  const [won, setWon] = useState(false);
  const { completeGame } = useGameStore();

  const handlePieceClick = (index: number) => {
    if (won) return;
    
    if (selected === null) {
      setSelected(index);
    } else {
      const newPieces = [...pieces];
      const temp = newPieces[selected];
      newPieces[selected] = newPieces[index];
      newPieces[index] = temp;
      setPieces(newPieces);
      setSelected(null);

      // Check win
      if (newPieces.every((p, i) => p.id === i + 1)) {
        setTimeout(() => {
          setWon(true);
          setTimeout(() => completeGame('manuscript', 3), 2000);
        }, 500);
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 relative">
      <AnimatePresence>
        {!won ? (
          <motion.div 
            exit={{ opacity: 0, scale: 0.8 }}
            className="w-full max-w-sm flex flex-col items-center"
          >
            <h2 className="text-xl font-bold text-gold-500 mb-6 text-center">
              المخطوطة ممزقة...<br/>
              <span className="text-sm text-stone-400 font-normal">ركب الأجزاء الـ 25 لتكتمل البوصلة</span>
            </h2>
            
            <div className="grid grid-cols-5 gap-1 p-2 bg-stone-800 rounded-lg shadow-2xl w-full aspect-square">
              {pieces.map((p, index) => (
                <motion.div
                  key={p.id}
                  layout
                  onClick={() => handlePieceClick(index)}
                  className={`relative rounded cursor-pointer overflow-hidden bg-[#d3bca1] border-2 transition-colors ${
                    selected === index ? 'border-gold-500 scale-95 z-10 shadow-lg' : 'border-[#8b6348] hover:border-gold-400'
                  }`}
                  style={{
                    backgroundImage: 'url("https://www.transparenttextures.com/patterns/old-wall.png")',
                  }}
                >
                    <div 
                      className="absolute inset-0 opacity-40 pointer-events-none mix-blend-multiply"
                      style={{
                        backgroundImage: 'url("https://www.transparenttextures.com/patterns/aged-paper.png")',
                      }}
                    />
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <div 
                        className="absolute w-[500%] h-[500%] text-[#3a281e] opacity-70"
                        style={{ 
                          left: `${-((p.id - 1) % 5) * 100}%`, 
                          top: `${-Math.floor((p.id - 1) / 5) * 100}%` 
                        }}
                      >
                        <svg viewBox="0 0 100 100" className="w-full h-full" fill="currentColor">
                          {/* Compass Rose / Star Pattern */}
                          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,2" />
                          <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="1" />
                          <path d="M50 5 L60 40 L95 50 L60 60 L50 95 L40 60 L5 50 L40 40 Z" />
                          <path d="M50 20 L55 45 L80 50 L55 55 L50 80 L45 55 L20 50 L45 45 Z" className="text-gold-700/50" />
                          <circle cx="50" cy="50" r="8" fill="none" stroke="#e6d0a7" strokeWidth="2" />
                          <text x="50" y="15" textAnchor="middle" fontSize="8" fill="currentColor">N</text>
                          <text x="50" y="90" textAnchor="middle" fontSize="8" fill="currentColor">S</text>
                          <text x="90" y="52" textAnchor="middle" fontSize="8" fill="currentColor">E</text>
                          <text x="10" y="52" textAnchor="middle" fontSize="8" fill="currentColor">W</text>
                        </svg>
                      </div>
                    </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="reward"
            initial={{ opacity: 0, scale: 0.5, rotateY: 90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="flex flex-col items-center bg-[#e6d0a7] p-10 rounded-sm shadow-2xl relative"
          >
            <div className="absolute inset-0 border-4 border-[#cbb382] m-3 pointer-events-none mix-blend-overlay" />
            <h2 className="text-3xl font-bold text-[#5c4033] mb-4" style={{ fontFamily: 'serif' }}>📜 حصلت على المخطوطة</h2>
            <p className="text-[#8b6348] text-center font-bold text-lg mb-6">+2 Points Bonus</p>
            <div className="text-6xl font-mono text-gold-600 tracking-widest bg-stone-900 px-8 py-6 rounded-xl font-bold shadow-inner border-4 border-[#5c4033] mb-4">
              3
            </div>
            <p className="text-[#8b6348] text-center font-bold max-w-xs leading-relaxed">
              لقد أعدت تجميع سجلات الحكماء القديمة... واكتشفت هذا الرقم الخاص بلعبة (المخطوطة 📜).
            </p>
            <button onClick={onClose} className="mt-8 px-8 py-3 bg-[#5c4033] text-[#e6d0a7] font-bold rounded shadow-lg hover:bg-[#4a3424] transition-colors">
              العودة للمعبد
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
