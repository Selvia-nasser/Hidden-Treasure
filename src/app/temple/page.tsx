'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, ScrollText, Flame, LightbulbOff, Gamepad2, DoorClosed, BookOpen } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { useRouter } from 'next/navigation';

import CompassGame from '@/components/games/CompassGame';
import ManuscriptGame from '@/components/games/ManuscriptGame';
import TorchGame from '@/components/games/TorchGame';
import IlluminationGame from '@/components/games/IlluminationGame';
import RingsGame from '@/components/games/RingsGame';
import FinalSeal from '@/components/games/FinalSeal';
import LeaderJournal from '@/components/games/LeaderJournal';

export default function Temple() {
  const router = useRouter();
  const { teamName, completedGames, completeGame } = useGameStore();
  const [activeGame, setActiveGame] = useState<string | null>(null);

  useEffect(() => {
    if (!teamName) {
      router.replace('/login');
    }
  }, [teamName, router]);

  if (!teamName) return null;

  const hotspots = [
    { id: 'compass', icon: Compass, x: '20%', y: '60%', size: 48, rotation: -10 },
    { id: 'manuscript', icon: ScrollText, x: '80%', y: '70%', size: 48, rotation: 10 },
    { id: 'torch', icon: Flame, x: '85%', y: '30%', size: 56, rotation: 0 },
    { id: 'illumination', icon: LightbulbOff, x: '15%', y: '25%', size: 48, rotation: 5 },
    { id: 'maze', icon: Gamepad2, x: '35%', y: '85%', size: 56, rotation: -5 },
    { id: 'leader', icon: BookOpen, x: '50%', y: '15%', size: 56, rotation: 0 },
  ];

  const handleClose = () => setActiveGame(null);

  const renderGame = () => {
    switch (activeGame) {
      case 'compass': return <CompassGame onClose={handleClose} />;
      case 'manuscript': return <ManuscriptGame onClose={handleClose} />;
      case 'torch': return <TorchGame onClose={handleClose} />;
      case 'illumination': return <IlluminationGame onClose={handleClose} />;
      case 'maze': return <RingsGame onClose={handleClose} />;
      case 'leader': return <LeaderJournal onClose={handleClose} />;
      case 'seal': return <FinalSeal onClose={handleClose} />;
      default: return null;
    }
  };

  return (
    <main className="relative w-full h-screen bg-[#110c09] overflow-hidden flex items-center justify-center">
      {/* Rich 2D Background */}
      <div 
        className="absolute inset-0 opacity-60 mix-blend-overlay" 
        style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/black-scales.png")' }}
      />
      <div 
        className="absolute inset-0 opacity-40 mix-blend-multiply" 
        style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/dark-matter.png")' }}
      />
      <div className="absolute inset-0 bg-gradient-radial from-[#3a2518]/60 via-[#110c09]/90 to-[#000000] opacity-90" />
      <div className="particles" />

      {/* Title */}
      <div className="absolute top-6 w-full text-center z-10 pointer-events-none">
        <h2 className="text-2xl font-extrabold text-[#8b6348] opacity-60 tracking-widest drop-shadow-lg" style={{ fontFamily: 'serif' }}>معبد الحارس</h2>
      </div>

      {/* The Big Door (Final Seal) */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setActiveGame('seal')}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 group z-10"
      >
        <div className="relative w-36 h-52 bg-[#1a110c] border-x-[12px] border-t-[12px] border-[#4a3424] rounded-t-full flex items-center justify-center shadow-[inset_0_0_30px_rgba(0,0,0,1),_0_20px_50px_rgba(0,0,0,0.8)]">
          <div className="absolute inset-0 bg-gold-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-t-full" />
          <DoorClosed size={90} className="text-[#8b6348] group-hover:text-gold-500 transition-colors drop-shadow-[0_2px_10px_rgba(0,0,0,1)]" strokeWidth={1.5} />
        </div>
      </motion.button>

      {/* Hotspots */}
      {hotspots.map((spot) => {
        const Icon = spot.icon;
        const isCompleted = completedGames.includes(spot.id);
        
        return (
          <motion.button
            key={spot.id}
            style={{ left: spot.x, top: spot.y, rotate: spot.rotation }}
            whileHover={{ scale: 1.2, rotate: spot.rotation + 10 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveGame(spot.id)}
            className="absolute -translate-x-1/2 -translate-y-1/2 group z-20 cursor-pointer"
          >
            <div className={`relative p-4 rounded-2xl transition-all duration-300 ${
              isCompleted 
                ? 'bg-gold-500/10 shadow-[inset_0_0_20px_rgba(255,215,0,0.3),_0_10px_20px_rgba(0,0,0,0.8)] border border-gold-500/50' 
                : 'bg-[#2a1e16]/50 shadow-[inset_0_0_15px_rgba(0,0,0,0.8),_0_10px_20px_rgba(0,0,0,0.8)] border border-[#4a3424]/50 group-hover:bg-[#3a281e]/80 group-hover:border-[#5c4033]'
            }`}>
              <Icon 
                size={spot.size} 
                className={`${isCompleted ? 'text-gold-400 drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]' : 'text-[#8b6348] opacity-90 group-hover:text-[#cbb382] group-hover:opacity-100 group-hover:drop-shadow-[0_0_8px_rgba(203,179,130,0.5)]'} transition-all duration-300`} 
                strokeWidth={isCompleted ? 2 : 1.5}
              />
              {isCompleted && (
                <div className="absolute inset-0 bg-gold-500/20 blur-xl rounded-2xl pointer-events-none" />
              )}
            </div>
          </motion.button>
        );
      })}
      <AnimatePresence>
        {activeGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-stone-950/95 backdrop-blur-md"
          >
            <div className="w-full h-full max-w-lg mx-auto relative flex flex-col">
              <div className="p-4 flex justify-end">
                <button 
                  onClick={() => setActiveGame(null)}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg border border-stone-600 font-bold transition-colors z-50"
                >
                  عودة
                </button>
              </div>
              
              <div className="flex-1 overflow-hidden relative">
                {renderGame()}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
