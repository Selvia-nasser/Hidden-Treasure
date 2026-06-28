'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen bg-stone-950 overflow-hidden">
      {/* Background FX */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20 pointer-events-none" />
      <div className="particles" />

      {/* Fog effect using gradients */}
      <motion.div 
        animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-stone-900/80 to-transparent pointer-events-none"
      />

<div className="z-10 text-center space-y-12 max-w-md px-6">
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1.5, ease: "liner" }}
    className="space-y-6"
  >
    <h1 className="text-4xl md:text-5xl font-extrabold text-gold-500 drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]">
      🏴‍☠️ الكنز المخفي
    </h1>

    <div className="text-lg text-stone-300 leading-8 font-medium space-y-3">
      <p>
        وصلتم إلى <span className="text-gold-500 font-bold">آخر مغامرة في المرحلة التمهيدية.</span>
      </p>

      <p>
        خلال الأيام الماضية جمعتم المناهج، وحللتم الشفرات، واجتزتم اختبارات الجزيرة...
      </p>

      <p>
        واليوم بقي <span className="text-gold-500 font-semibold">اختبار الحارس الأخير.</span>
      </p>

      <p>
        تذكّروا...
      </p>

      <p>
        لن يستطيع شخص واحد إنهاء هذه المهمة وحده.
      </p>

      <p>
        تعاونوا، واجمعوا الأدلة، وأكملوا الرحلة معًا.
      </p>

      <p className="text-gold-500 font-bold pt-2">
        فبعد هذه المغامرة... تبدأ المنافسات الحقيقية.
      </p>
    </div>
  </motion.div>

  <motion.button
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 1, duration: 0.5 }}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => router.push('/login')}
    className="relative overflow-hidden group px-8 py-4 bg-stone-800 border-2 border-stone-600 rounded-lg text-gold-500 font-bold text-xl tracking-widest shadow-[0_0_20px_rgba(0,0,0,0.8)]"
  >
    <span className="relative z-10">ابدأ المغامرة</span>
    <div className="absolute inset-0 bg-stone-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
  </motion.button>
</div>

      {/* Torches on sides */}
      <div className="absolute top-1/4 left-4 w-12 h-32 opacity-80 animate-flicker">
        <div className="w-4 h-12 bg-stone-700 mx-auto rounded-b-md" />
        <div className="w-8 h-8 bg-orange-500 rounded-full mx-auto -mt-6 blur-md bg-gradient-to-t from-orange-600 to-yellow-300" />
      </div>
      <div className="absolute top-1/4 right-4 w-12 h-32 opacity-80 animate-flicker" style={{ animationDelay: '0.5s' }}>
        <div className="w-4 h-12 bg-stone-700 mx-auto rounded-b-md" />
        <div className="w-8 h-8 bg-orange-500 rounded-full mx-auto -mt-6 blur-md bg-gradient-to-t from-orange-600 to-yellow-300" />
      </div>
    </main>
  );
}
