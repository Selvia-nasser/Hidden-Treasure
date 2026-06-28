'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useGameStore, TeamName } from '@/store/gameStore';

/* 
  Team Codes:
  - 404 => مخرج 404
  - HELP => الحقونا
  - HAKUNA => هاكونا مطاطا
  - GENIUS => عباقرة تحت الإنشاء
  - SCOOBY => عصابة سكوبي دو
  - FLY => وضع الطيران
  - LeaderBrb2 => Leader
*/

const TEAM_DATA: Record<string, { name: TeamName, message: string }> = {
  '404': { 
    name: 'مخرج 404', 
    message: '😴 أخيرًا صحيتوا! الجزيرة كانت بدأت تفتكر إنكم تايهين... ورّونا بقى إن مخرج 404 يقدر يلاقي الطريق.' 
  },
  'HELP': { 
    name: 'الحقونا', 
    message: '🏃 سمعنا حد بينادي: "الحقونا!"... يلا نشوف المرة دي مين هيلحق مين.' 
  },
  'HAKUNA': { 
    name: 'هاكونا مطاطا', 
    message: '😂 الدوشة وصلت الجزيرة قبل ما توصلوا أنتم... دلوقتي ورّونا إنكم بتعرفوا تجمعوا نقط بنفس الحماس.' 
  },
  'GENIUS': { 
    name: 'عباقرة تحت الإنشاء', 
    message: '🧠 واضح إن مرحلة "تحت الإنشاء" قربت تخلص... الحارس مستني يشوف العباقرة الحقيقيين.' 
  },
  'SCOOBY': { 
    name: 'عصابة سكوبي دو', 
    message: '🔎 عصابة سكوبي دو وصلت! عندكم سمعة إنكم بتلاقوا أي لغز... نشوف الجزيرة هتقدر تخبي عنكم إيه.' 
  },
  'FLY': { 
    name: 'وضع الطيران', 
    message: '✈️ تم تفعيل وضع الطيران... بس المرة دي الوجهة مش السماء، الوجهة هي قمة الترتيب.' 
  },
};

export default function Login() {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setTeam = useGameStore((state) => state.setTeam);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const upperCode = code.trim().toUpperCase();

    const teamInfo = TEAM_DATA[upperCode];
    
    if (teamInfo) {
      setTeam(upperCode, teamInfo.name);
      setLoading(true);
      setTimeout(() => router.push('/temple'), 3000);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  const selectedTeam = TEAM_DATA[code.trim().toUpperCase()];

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen bg-stone-950 px-6">
      <div className="particles" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="z-10 w-full max-w-sm bg-stone-900/80 p-8 rounded-xl border border-stone-700 shadow-2xl backdrop-blur-sm relative overflow-hidden"
      >
        {!loading ? (
          <>
            <h2 className="text-2xl font-bold text-stone-200 text-center mb-6">
              أدخل رمز الفريق
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="الرمز السري..."
                className={`w-full px-4 py-3 bg-stone-800 border-2 rounded-lg text-center text-xl tracking-widest text-gold-500 placeholder-stone-600 focus:outline-none transition-colors ${error ? 'border-red-500' : 'border-stone-600 focus:border-gold-500'}`}
                dir="ltr"
                autoComplete="off"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-stone-700 to-stone-800 text-stone-200 font-bold rounded-lg border border-stone-600 shadow-lg hover:text-gold-500 transition-colors"
              >
                تأكيد
              </motion.button>
            </form>
            {error && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-center mt-4 text-sm"
              >
                الرمز غير صحيح، الحارس لا يعرفك.
              </motion.p>
            )}
          </>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-4 py-4"
          >
            <p className="text-sm text-stone-400">📜 الحارس يراقب فريقكم...</p>
            <h3 className="text-2xl font-bold text-gold-500 mb-2">مرحباً فريق {selectedTeam?.name}</h3>
            <p className="text-stone-300 leading-relaxed text-sm md:text-base">
              {selectedTeam?.message}
            </p>
          </motion.div>
        )}
      </motion.div>
    </main>
  );
}
