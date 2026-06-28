'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { Unlock, Lock, Compass, Shield, Flame, ScrollText, Key, ArrowRight } from 'lucide-react';

const SYMBOLS = [
  { id: 'none', icon: () => <span className="text-stone-600 font-bold text-2xl">?</span> },
  { id: 'compass', icon: Compass },
  { id: 'manuscript', icon: ScrollText },
  { id: 'torch', icon: Flame },
  { id: 'illumination', icon: Shield },
  { id: 'key', icon: Key }
];

export default function FinalSeal({ onClose }: { onClose: () => void }) {
  const { teamName, collectedNumbers, points } = useGameStore();

  const CORRECT_CODE = ['1', '3', '4', '7', '9']; 
  const CORRECT_SYMBOLS = ['key', 'illumination', 'torch', 'manuscript', 'compass']; 
  
  const [stage, setStage] = useState<1 | 2>(1);
  const [inputCode, setInputCode] = useState(['', '', '', '', '']);
  const [inputSymbols, setInputSymbols] = useState(['none', 'none', 'none', 'none', 'none']);
  const [isError, setIsError] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const handleInputChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newCode = [...inputCode];
    newCode[index] = value;
    setInputCode(newCode);

    if (value !== '' && index < 4) {
      const nextInput = document.getElementById(`code-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleSymbolClick = (index: number) => {
    const currentSymbolId = inputSymbols[index];
    const currentIndex = SYMBOLS.findIndex(s => s.id === currentSymbolId);
    const nextIndex = (currentIndex + 1) % SYMBOLS.length;
    
    const newSymbols = [...inputSymbols];
    newSymbols[index] = SYMBOLS[nextIndex].id;
    setInputSymbols(newSymbols);
  };

  const handleVerify = () => {
    if (stage === 1) {
      const isCodeCorrect = inputCode.join('') === CORRECT_CODE.join('');
      if (isCodeCorrect) {
        if (typeof window !== 'undefined' && window.navigator.vibrate) {
          window.navigator.vibrate([100]);
        }
        setStage(2); 
      } else {
        triggerError();
      }
    } else {
      const isSymbolsCorrect = inputSymbols.join('') === CORRECT_SYMBOLS.join('');
      if (isSymbolsCorrect) {
        if (typeof window !== 'undefined' && window.navigator.vibrate) {
          window.navigator.vibrate([100, 50, 100, 50, 300]);
        }
        setUnlocked(true);
      } else {
        triggerError();
      }
    }
  };

  const triggerError = () => {
    if (typeof window !== 'undefined' && window.navigator.vibrate) {
      window.navigator.vibrate([500]);
    }
    setIsError(true);
    setTimeout(() => setIsError(false), 800);
  };

  const TEAM_ENDINGS: Record<string, { artifact: string, desc: string, power: string, icon: any, color: string }> = {
    'مخرج 404': { artifact: 'البوصلة القديمة', desc: 'كانت هذه البوصلة لا تشير إلى الشمال... بل كانت تشير دائمًا إلى الطريق الصحيح.', power: 'إعادة تدوير عجلة الحظ مرة.', icon: Compass, color: 'text-blue-500' },
    'الحقونا': { artifact: 'الدرع القديم', desc: 'لم يكن درعاً للقتال، بل كان لصد اليأس في اللحظات الأخيرة.', power: 'إلغاء أول خصم نقاط.', icon: Shield, color: 'text-red-500' },
    'هاكونا مطاطا': { artifact: 'الجوهرة الزرقاء', desc: 'تلمع في الظلام لتذكرك أن المتعة هي أساس الرحلة.', power: 'الحصول على Challenge إضافي يمنح نقاطًا.', icon: Flame, color: 'text-yellow-400' },
    'عباقرة تحت الإنشاء': { artifact: 'المخطوطة المنسية', desc: 'صفحاتها فارغة، لأن العباقرة الحقيقيين هم من يكتبون النهاية.', power: 'استبدال سؤال.', icon: ScrollText, color: 'text-green-500' },
    'عصابة سكوبي دو': { artifact: 'مفتاح الحارس', desc: 'لا يوجد باب مغلق أمام من يملك الفضول.', power: 'فتح سؤال Bonus.', icon: Key, color: 'text-purple-500' },
    'وضع الطيران': { artifact: 'شعلة الكنز', desc: 'نار لا تنطفئ حتى تبلغ أعلى القمم.', power: 'الحصول على اختيارات في سؤال كان بدون اختيارات.', icon: Flame, color: 'text-cyan-500' }
  };

  const myEnding = teamName ? TEAM_ENDINGS[teamName] || TEAM_ENDINGS['مخرج 404'] : TEAM_ENDINGS['مخرج 404'];
  const EndIcon = myEnding.icon;

  return (
    <div className="w-full min-h-full flex flex-col items-center justify-center p-4 overflow-y-auto">
      <AnimatePresence mode="wait">
        {!unlocked ? (
          <motion.div 
            key={stage === 1 ? 'stage1' : 'stage2'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center"
          >
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-300 mb-2 tracking-widest text-center" style={{ fontFamily: 'serif' }}>
              {stage === 1 ? 'القفل الرقمي' : 'الختم النهائي'}
            </h2>
            <p className="text-stone-500 text-sm mb-8 sm:mb-12 text-center max-w-md">
              {stage === 1 
                ? 'النقوش تشير إلى أن الأرقام التي وجدتموها تخفي تسلسلاً سرياً... هل يمكنكم استنتاجه؟' 
                : 'رتب رموز الألغاز بالترتيب من اليمين إلى اليسار لفتح البوابة'}
            </p>

            <motion.div 
              animate={isError ? { x: [-10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-4 mb-8 sm:mb-10"
              dir="ltr"
            >
              {stage === 1 ? (
                <div className="flex gap-2 sm:gap-3">
                  {inputCode.map((digit, i) => (
                    <input
                      key={`num-${i}`}
                      id={`code-input-${i}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleInputChange(i, e.target.value)}
                      className={`w-12 h-16 sm:w-14 sm:h-20 text-center text-2xl sm:text-3xl font-mono font-bold bg-[#2a1e16] text-gold-500 border-4 rounded-lg shadow-inner focus:outline-none transition-colors ${
                        isError ? 'border-red-800 bg-red-950 text-red-500' : 'border-[#4a3424] focus:border-gold-600'
                      }`}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex gap-2 sm:gap-3">
                  {inputSymbols.map((symId, i) => {
                    const CurrentIcon = SYMBOLS.find(s => s.id === symId)?.icon || SYMBOLS[0].icon;
                    return (
                      <div 
                        key={`sym-${i}`}
                        onClick={() => handleSymbolClick(i)}
                        className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-[#1a130f] border-2 rounded-lg cursor-pointer transition-colors shadow-lg ${
                          isError ? 'border-red-800 bg-red-950' : 'border-[#4a3424] hover:border-gold-600'
                        }`}
                      >
                        <CurrentIcon size={24} className={isError ? 'text-red-500' : 'text-gold-500'} />
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>

            <button 
              onClick={handleVerify}
              className="px-8 py-3.5 sm:px-12 sm:py-4 bg-gradient-to-r from-[#4a3424] to-[#3a281e] border-2 border-gold-600/50 hover:border-gold-500 text-gold-500 font-bold text-lg sm:text-xl rounded-full shadow-[0_0_20px_rgba(255,215,0,0.1)] transition-all flex items-center gap-2"
            >
              {stage === 1 ? 'فتح القفل الأول' : 'فتح البوابة'}
              {stage === 1 && <ArrowRight size={20} />}
            </button>
          </motion.div>
        ) : (
          /* شاشة الفوز والكنز النهائية المعدلة لتناسب المساحات */
          <motion.div 
            key="treasure"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, type: 'spring' }}
            className="flex flex-col items-center text-center bg-[#1a130f] p-5 sm:p-8 rounded-2xl border-4 border-gold-500 shadow-[0_0_80px_rgba(255,215,0,0.25)] max-w-sm sm:max-w-md w-full my-auto relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-50 animate-pulse" />
            <div className="absolute -top-20 -left-20 w-48 h-48 bg-gold-500/15 blur-3xl rounded-full" />
            <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-gold-500/15 blur-3xl rounded-full" />
            
            <Unlock size={45} className="text-gold-500 mb-4 drop-shadow-[0_0_10px_rgba(255,215,0,0.8)] relative z-10" />
            
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gold-500 mb-2 drop-shadow-md relative z-10">
              مبروك فريق {teamName}
            </h2>
            
            <div className="bg-stone-900/80 py-3 px-5 rounded-lg border border-gold-500/30 mb-4 relative z-10 w-full flex flex-col items-center">
              <h3 className="text-gold-400 font-bold text-xs sm:text-sm mb-1">تم إضافة نقاط جديدة لفريقكم (Bonus)</h3>
              <p className="text-2xl sm:text-3xl font-mono text-white">+2</p>
            </div>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed mb-4 relative z-10 font-medium px-2">
              لقد أثبتم جدارتكم وفككتم شفرة المعبد. هذه هي هديتكم الخاصة:
            </p>
            
            <div className="bg-[#2a1e16] p-4 sm:p-5 rounded-xl border-2 border-gold-600 shadow-inner w-full relative z-10">
              <EndIcon size={32} className={`mx-auto mb-2 ${myEnding.color} drop-shadow-lg`} />
              <h3 className={`text-xl sm:text-2xl font-bold mb-2 ${myEnding.color}`}>{myEnding.artifact}</h3>
              <p className="text-stone-300 text-xs sm:text-sm leading-relaxed mb-3 italic">"{myEnding.desc}"</p>
              <div className="border-t border-[#4a3424] pt-3 mt-3">
                <p className="text-[11px] text-stone-400 mb-1">الميزة في المسابقة القادمة:</p>
                <p className="text-gold-500 font-bold text-xs sm:text-sm">{myEnding.power}</p>
              </div>
            </div>
            
            <p className="mt-5 text-stone-500 text-xs relative z-10 font-bold animate-pulse">
              📸 التقطوا صورة لهذه الشاشة وأروها للحارس!
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}