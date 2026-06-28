'use client';

import { useGameStore } from '@/store/gameStore';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

const LEVELS = [4, 5, 6]; // 3 Levels فقط

export default function TorchGame({ onClose }: { onClose: () => void }) {
  const [levelIndex, setLevelIndex] = useState(0);
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const [activeTorch, setActiveTorch] = useState<number | null>(null);
  const [won, setWon] = useState(false);
  const [failed, setFailed] = useState(false);

  const { completeGame } = useGameStore();

  const numTorches = LEVELS[levelIndex];

  const generateSequence = useCallback(() => {
    const newSeq = [];

    for (let i = 0; i < numTorches; i++) {
      newSeq.push(Math.floor(Math.random() * numTorches));
    }

    setSequence(newSeq);
    setPlayerSequence([]);
    setIsPlayingSequence(true);
    setFailed(false);
  }, [numTorches]);

  useEffect(() => {
    if (!won) {
      const timer = setTimeout(() => generateSequence(), 1000);
      return () => clearTimeout(timer);
    }
  }, [levelIndex, generateSequence, won]);

  useEffect(() => {
    if (isPlayingSequence && sequence.length > 0) {
      let step = 0;

      const interval = setInterval(() => {
        if (step < sequence.length) {
          setActiveTorch(sequence[step]);
          setTimeout(() => setActiveTorch(null), 300);
          step++;
        } else {
          clearInterval(interval);
          setIsPlayingSequence(false);
        }
      }, 600);

      return () => clearInterval(interval);
    }
  }, [isPlayingSequence, sequence]);

  const handleTorchClick = (index: number) => {
    if (isPlayingSequence || won || failed) return;

    setActiveTorch(index);
    setTimeout(() => setActiveTorch(null), 300);

    const newPlayerSeq = [...playerSequence, index];
    setPlayerSequence(newPlayerSeq);

    const currentStep = newPlayerSeq.length - 1;

    if (newPlayerSeq[currentStep] !== sequence[currentStep]) {
      setFailed(true);

      setTimeout(() => {
        generateSequence();
      }, 1500);

      return;
    }

    if (newPlayerSeq.length === sequence.length) {
      if (levelIndex === LEVELS.length - 1) {
        setWon(true);

        setTimeout(() => {
          completeGame('torch', 4);
        }, 1500);
      } else {
        setTimeout(() => {
          setLevelIndex((prev) => prev + 1);
        }, 1200);
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">

      {!won ? (
        <>
          <h2 className="text-2xl font-bold text-orange-500 mb-2 tracking-widest">

            {failed
              ? '❌ أخطأت... حاول مرة أخرى'
              : `🔥 المرحلة ${levelIndex + 1} من 3`}

          </h2>

          <p className="text-stone-400 mb-12 h-6 text-center">

            {isPlayingSequence
              ? 'راقب ترتيب اشتعال المشاعل جيدًا...'
              : 'أعد إشعالها بنفس الترتيب'}

          </p>

          <div className="flex flex-wrap justify-center gap-6 max-w-md">

            {Array.from({ length: numTorches }).map((_, i) => (

              <motion.button
                key={i}
                whileTap={!isPlayingSequence ? { scale: 0.9 } : {}}
                onClick={() => handleTorchClick(i)}
                className="relative flex flex-col items-center group"
              >

                {/* Handle */}
                <div className="w-4 h-16 bg-stone-700 rounded-b-lg border-x-2 border-b-2 border-stone-800 shadow-inner z-10" />

                {/* Flame */}
                <div className="absolute -top-10 w-16 h-16 flex items-center justify-center">

                  <Flame
                    size={48}
                    className={`transition-all duration-300 ${
                      activeTorch === i
                        ? 'text-orange-500 drop-shadow-[0_0_20px_rgba(249,115,22,1)] scale-125'
                        : 'text-stone-700'
                    }`}
                  />

                  <div
                    className={`absolute inset-0 rounded-full blur-xl transition-opacity duration-300 ${
                      activeTorch === i
                        ? 'opacity-100 bg-orange-500/20'
                        : 'opacity-0'
                    }`}
                  />

                </div>

              </motion.button>

            ))}

          </div>
        </>
      ) : (

        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="flex flex-col items-center bg-stone-800 p-8 rounded-xl border border-orange-500/50 shadow-[0_0_50px_rgba(249,115,22,0.3)]"
        >

          <Flame
            size={80}
            className="text-orange-500 drop-shadow-[0_0_20px_rgba(249,115,22,0.8)] mb-6"
          />

          <h2 className="text-3xl font-bold text-orange-400 mb-4">
            🔥 حصلت على الشعلة
          </h2>

          <p className="text-orange-300 font-bold text-lg mb-6">
            ⭐ وايضا بونص نقطتين
          </p>

          <div className="text-6xl font-mono text-yellow-400 tracking-widest bg-stone-900 px-8 py-6 rounded-xl font-bold border-2 border-orange-500/50 mb-6 shadow-[inset_0_0_20px_rgba(249,115,22,0.3)]">
            4
          </div>

          <p className="text-stone-300 text-center leading-8 max-w-xs mb-8">
            احتفظ بهذا الرقم جيدًا...
            <br />
            ستحتاجه لاحقًا عند إعادة بناء ختم الجزيرة.
          </p>

          <button
            onClick={onClose}
            className="px-8 py-3 bg-orange-600 hover:bg-orange-700 transition-colors rounded-lg text-white font-bold shadow-lg"
          >
            العودة إلى المعبد
          </button>

        </motion.div>

      )}

    </div>
  );
}