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

  // تأثير تقليب صفحات الكتاب
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
        ease: [0.42, 0, 0.58, 1],
      },
    },
    exit: (direction: number) => ({
      opacity: 0,
      rotateY: direction > 0 ? 90 : -90,
      transformOrigin: 'right center',
      transition: {
        duration: 0.5,
        ease: [0.42, 0, 0.58, 1],
      },
    }),
  };

  if (!unlocked) {
    return (
      <div
        dir="rtl"
        className="w-full h-full flex items-center justify-center p-6 overflow-hidden"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-stone-900 border-2 border-stone-700 p-8 rounded-xl shadow-2xl w-full max-w-sm text-center"
        >
          <h2 className="text-xl font-bold text-stone-300 mb-6">
            سجل الحارس مقفل
          </h2>
          <form onSubmit={handleUnlock} className="flex flex-col gap-4">
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="أدخل كلمة سر القائد..."
              className={`w-full px-4 py-3 bg-stone-800 border-2 rounded-lg text-center tracking-widest text-gold-500 focus:outline-none transition-colors ${error ? 'border-red-500' : 'border-stone-600 focus:border-gold-500'}`}
              dir="ltr"
            />
            <button
              type="submit"
              className="w-full py-3 bg-stone-700 hover:bg-stone-600 text-stone-200 font-bold rounded-lg transition-colors"
            >
              فتح السجل
            </button>
          </form>
          {error && (
            <p className="text-red-500 text-sm mt-4">الرمز غير صحيح!</p>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 overflow-hidden select-none">
      {/* إطار السجل الثابت */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#ead8b0] p-6 sm:p-10 rounded-md shadow-[0_0_45px_rgba(0,0,0,0.85)] relative w-full max-w-2xl h-[85vh] flex flex-col justify-between overflow-hidden perspective-1000"
        style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/old-wall.png")' }}
      >
        <div className="absolute inset-0 border-[10px] border-[#cbb382] opacity-30 pointer-events-none mix-blend-overlay z-10" />
        
        {/* العنوان الثابت */}
        <h1
          dir="rtl"
          className="text-2xl sm:text-4xl font-extrabold text-[#5c4033] text-center mb-4 sm:mb-6 border-b-2 border-[#5c4033]/20 pb-3 sm:pb-5 tracking-wide z-10"
          style={{ fontFamily: 'serif' }}
        >
          📜 سجل الحارس الأخير
        </h1>

        {/* محتوى الصفحات المتحرك */}
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
                {/* الجزء الأول: النص الكامل المتتابع للقصة واللغز */}
                <div className="space-y-2 sm:space-y-3 overflow-y-auto no-scrollbar pb-2">
                  <p>
                    مرت <span dir="ltr"><strong>١٢-٢٥-٢٧-١-٣</strong></span> طويلة منذ أن اختفى الكنز، ولم يبقَ منه إلا آثار متناثرة في أنحاء الجزيرة.
                  </p>
                  <p>
                    كثيرون حاولوا <span dir="ltr"><strong>١-٢٣-٢٧-١٤-٢٧-٢٣</strong></span> إليه، لكنهم كانوا يبحثون عن الباب قبل أن يعرفوا الطريق.
                  </p>
                  <p>
                    علّمتنا الأيام أن من يفقد <span dir="ltr"><strong>١-٣-٥-١-٢٦-٢٦</strong></span> لن يصل أبدًا، لذلك كان أول ما نلجأ إليه دائمًا هو ما يدلنا على الطريق...
                  </p>
                  <p>
                    وبعد أن نهتدي، نفتح سجلات <span dir="ltr"><strong>١-٢٣-٦-٢٢-٢٤-١</strong></span> لنقرأ ما تركه الحكماء من معرفة.
                  </p>
                  <p>
                    وعندما يحل الظلام، لا يكفي أن نعرف الطريق، بل يجب أن <span dir="ltr"><strong>٢٥-١٥-٢٨</strong></span> ما حولنا حتى نرى ما ينتظرنا.
                  </p>
                  <p>
                    فإذا واجهنا الخطر، فلن يحمينا سوى ما <span dir="ltr"><strong>٢٥-٦-٢٤-٢٣-٢٦</strong></span> معنا.
                  </p>
                  <p>
                    وعندها فقط... يصبح الطريق إلى <span dir="ltr"><strong>١-٢٣-٢-٢٧-١-٢-٢٦</strong></span> الأخيرة واضحًا، ويستطيع صاحب <span dir="ltr"><strong>١-٢٣-٢٤-٢٠-٣-١-٦</strong></span> أن يفتحها.
                  </p>
                  <p>
                    لا تحفظ <span dir="ltr"><strong>١-٢٣-٢٢-٢٣-٢٤-١-٣</strong></span>... بل تذكّر <span dir="ltr"><strong>٣-١٠-٣-٢٨-٢-٢٦-١</strong></span>.
                  </p>
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
                {/* الجزء الثاني: ملاحظات وتوجيهات الحارس لفريق التحدي */}
                <div className="space-y-4 sm:space-y-6 flex-1 flex flex-col justify-center">
                  <div className="border-t-2 border-b-2 border-[#5c4033]/15 py-4 my-2">
                    <h3 className="text-center text-xl sm:text-2xl font-bold text-[#5c4033] mb-3">
                      ✦ ملاحظة تركها الحارس ✦
                    </h3>
                    <p className="leading-7 sm:leading-8 text-[#6b4a34] text-center">
                      ظن كثيرون أن هذه الكلمات ليست سوى قصة قديمة... لكن الحقيقة أن كل كلمة منها تمثل خطوة سار بها الحراس قبل الوصول إلى الكنز.
                    </p>
                    <p className="leading-7 sm:leading-8 mt-3 text-[#6b4a34] text-center">
                      أما الأرقام الخمسة التي جمعها فريقكم من الألعاب، فهي ليست عشوائية... ولا تُكتب بالترتيب الذي حصلتم عليه.
                    </p>
                  </div>

                  <div className="bg-[#d7be8f]/40 border border-[#8b6348]/30 rounded-lg p-4 sm:p-5 shadow-inner">
                    <p className="text-center text-[#5c4033] font-bold text-base sm:text-lg leading-7 sm:leading-8">
                      ليس الأسرع من يصل إلى الكنز...
                      <br />
                      بل من فهم الرحلة أولًا.
                      <br />
                      رتبوا الأرقام كما رُتبت محطات الحراس...
                      <br />
                      وعندها فقط ستستجيب البوابة الأخيرة.
                    </p>
                  </div>
                </div>
                <div className="text-center text-xs text-[#5c4033]/60 font-bold mt-2">صفحة ٢ من ٢</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* شريط التحكم السفلي الثابت */}
        <div className="flex items-center justify-between mt-4 sm:mt-6 pt-3 border-t border-[#5c4033]/15 z-20" dir="rtl">
          <div>
            {page === 2 ? (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={onClose}
                className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-[#ead8b0] font-bold text-sm sm:text-base rounded-md transition-all shadow-md transform active:scale-95"
              >
                🚪 العودة للمعبد
              </motion.button>
            ) : (
              <div className="w-24 sm:w-32" />
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className={`px-4 py-2 font-bold text-sm sm:text-base rounded-md transition-all ${page === 1 ? 'text-stone-400 cursor-not-allowed opacity-40' : 'bg-[#5c4033] text-[#ead8b0] hover:bg-[#4a3424]'}`}
            >
              السابق ➡️
            </button>
            <button
              onClick={() => setPage(2)}
              disabled={page === 2}
              className={`px-4 py-2 font-bold text-sm sm:text-base rounded-md transition-all ${page === 2 ? 'text-stone-400 cursor-not-allowed opacity-40' : 'bg-[#5c4033] text-[#ead8b0] hover:bg-[#4a3424]'}`}
            >
              ⬅️ التالي
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}