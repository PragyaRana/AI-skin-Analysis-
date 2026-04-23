import { motion } from 'motion/react';

export default function Hero() {
  return (
    <section className="relative px-6 py-16 sm:py-20 text-center overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[70%] bg-emerald-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-zinc-800/20 blur-[100px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 bg-zinc-900 border border-zinc-800 rounded-full shadow-lg">
          <span className="flex w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Advanced Dermatological AI</span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1] font-serif italic">
          High precision <br />
          <span className="text-emerald-400 not-italic font-sans font-black">Bio-Scanning</span>
        </h1>

        <p className="text-base text-zinc-400 leading-relaxed max-w-xl mx-auto mb-10 tracking-tight">
          Utilizing multimodal analysis algorithms to parse skin layers in real-time. 
          Professional accuracy meets personalized care through the Gemini 1.5 engine.
        </p>
      </motion.div>
    </section>
  );
}
