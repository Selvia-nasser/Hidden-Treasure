'use client';

import { AnimatePresence, motion, Variants } from 'framer-motion';
import { useState } from 'react';

export default function LeaderJournal({ onClose }: { onClose: () => void }) {
  const [password, setPassword] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim() === 'LeaderBrb2') {
      setUnlocked(true);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  const pageVariants: Variants = {
    initial: (direction: number) => ({
      opacity: 0,
      rotateY: direction > 0 ? -90 : 90,
      transformOrigin: 'right center',
    }),
    animate: {
      opacity: 1,
      rotateY: 0,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
    exit: (direction: number) => ({
      opacity: 0,
      rotateY: direction > 0 ? 90 : -90,
      transformOrigin: 'right center',
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    }),
  };

  if (!unlocked) {
    return (
      <div dir="rtl" className="w-full h-full flex items-center justify-center p-6 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-stone-900 border-2 border-stone-700 p-8 rounded-xl shadow-2xl w-full max-w-sm text-center"
        >
          <h2 className="text-xl font-bold text-stone-300 mb-6">سجل الحارس مقفل</h2>
          <form onSubmit={handleUnlock} className="flex flex-col gap-4">
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="أدخل كلمة سر القائد..."
              className={`w-full px-4 py-3 bg-stone-800 border-2 rounded-lg text-center tracking-widest text-yellow-500 focus:outline-none transition-colors ${error ? 'border-red-500' : 'border-stone-600 focus:border-yellow-500'}`}
              dir="ltr"
            />
            <button
              type="submit"
              className="w-full py-3 bg-stone-700 hover:bg-stone-600 text-stone-200 font-bold rounded-lg transition-colors"
            >
              فتح السجل
            </button>
          </form>
          {error && <p className="text-red-500 text-sm mt-4">الرمز غير صحيح!</p>}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 overflow-hidden select-none">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#ead8b0] p-6 sm:p-10 rounded-md shadow-[0_0_45px_rgba(0,0,0,0.85)] relative w-full max-w-2xl h-[85vh] flex flex-col justify-between overflow-hidden"
        style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/old-wall.png")' }}
      >
        <div className="absolute inset-0 border-[10px] border-[#cbb382] opacity-30 pointer-events-none mix-blend-overlay z-10" />
        
        <h1 dir="rtl" className="text-2xl sm:text-4xl font-extrabold text-[#5c4033] text-center mb-4 sm:mb-6 border-b-2 border-[#5c4033]/20 pb-3 sm:pb-5 tracking-wide z-10" style={{ fontFamily: 'serif' }}>
          📜 سجل الحارس الأخير
        </h1>

        <div className="flex-1 relative overflow-hidden z-10">
          <AnimatePresence mode="wait" custom={page}>
            {page === 1 ? (
              <motion.div
                key="page1"
                custom={page}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                dir="rtl"
                className="absolute inset-0 flex flex-col justify-between text-[#4a3424] text-sm sm:text-base md:text-lg leading-6 sm:leading-8 md:leading-9 text-right"
                style={{ fontFamily: "serif" }}
              >
                <div className="space-y-2 sm:space-y-3 overflow-y-auto pb-2">
                  <p>مرت <span dir="ltr"><strong>١٢-٢٥-٢٧-١-٣</strong></span> طويلة منذ أن اختفى الكنز.</p>
                  <p>كثيرون حاولوا <span dir="ltr"><strong>١-٢٣-٢٧-١٤-٢٧-٢٣</strong></span> إليه، لكنهم بحثوا عن الباب قبل الطريق.</p>
                  <p>علّمتنا الأيام أن من يفقد <span dir="ltr"><strong>١-٣-٥-١-٢٦-٢٦</strong></span> لن يصل أبدًا.</p>
                  <p>وبعد أن نهتدي، نفتح سجلات <span dir="ltr"><strong>١-٢٣-٦-٢٢-٢٤-١</strong></span> لنقرأ ما تركه الحكماء.</p>
                  <p>وعندما يحل الظلام، لا يكفي أن نعرف الطريق، بل يجب أن <span dir="ltr"><strong>٢٥-١٥-٢٨</strong></span> ما حولنا.</p>
                  <p>فإذا واجهنا الخطر، فلن يحمينا سوى ما <span dir="ltr"><strong>٢٥-٦-٢٤-٢٣-٢٦</strong></span> معنا.</p>
                  <p>وعندها فقط... يصبح الطريق إلى <span dir="ltr"><strong>١-٢٣-٢-٢٧-١-٢-٢٦</strong></span> الأخيرة واضحًا.</p>
                  <p>لا تحفظ <span dir="ltr"><strong>١-٢٣-٢٢-٢٣-٢٤-١-٣</strong></span>... بل تذكّر <span dir="ltr"><strong>٣-١٠-٣-٢٨-٢-٢٦-١</strong></span>.</p>
                </div>
                <div className="text-center text-xs text-[#5c4033]/60 font-bold mt-2">صفحة ١ من ٢</div>
              </motion.div>
            ) : (
              <motion.div
                key="page2"
                custom={page}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                dir="rtl"
                className="absolute inset-0 flex flex-col justify-between text-[#4a3424] text-sm sm:text-base leading-6 sm:leading-8 text-right"
                style={{ fontFamily: "serif" }}
              >
                <div className="space-y-4 sm:space-y-6 flex-1 flex flex-col justify-center">
                  <div className="border-t-2 border-b-2 border-[#5c4033]/15 py-4 my-2">
                    <h3 className="text-center text-xl font-bold text-[#5c4033] mb-3">✦ ملاحظة الحارس ✦</h3>
                    <p className="leading-7 text-[#6b4a34] text-center">كل كلمة هنا تمثل خطوة سار بها الحراس. الأرقام التي جمعتموها ليست عشوائية، ولا تُكتب بالترتيب الذي حصلتم عليه.</p>
                  </div>
                  <div className="bg-[#d7be8f]/40 border border-[#8b6348]/30 rounded-lg p-4 shadow-inner">
                    <p className="text-center text-[#5c4033] font-bold leading-8">
                      ليس الأسرع من يصل إلى الكنز... بل من فهم الرحلة أولًا. <br />
                      رتبوا الأرقام كما رُتبت محطات الحراس... <br />
                      وعندها فقط ستستجيب البوابة الأخيرة.
                    </p>
                  </div>
                </div>
                <div className="text-center text-xs text-[#5c4033]/60 font-bold mt-2">صفحة ٢ من ٢</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between mt-4 sm:mt-6 pt-3 border-t border-[#5c4033]/15 z-20" dir="rtl">
          <div>
            {page === 2 ? (
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose} className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-[#ead8b0] font-bold rounded-md transition-all">
                🚪 العودة للمعبد
              </motion.button>
            ) : <div className="w-24" />}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setPage(1)} disabled={page === 1} className={`px-4 py-2 font-bold rounded-md ${page === 1 ? 'opacity-30' : 'bg-[#5c4033] text-[#ead8b0]'}`}>السابق ➡️</button>
            <button onClick={() => setPage(2)} disabled={page === 2} className={`px-4 py-2 font-bold rounded-md ${page === 2 ? 'opacity-30' : 'bg-[#5c4033] text-[#ead8b0]'}`}>⬅️ التالي</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}