import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3"
        id="navbar-logo"
      >
        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg shadow-lg shadow-emerald-500/10">
          <Sparkles className="w-5 h-5 text-zinc-950" />
        </div>
        <h1 className="text-xl font-semibold tracking-tight italic font-serif text-white">
          GlowAI <span className="text-emerald-400 font-normal">Dermatology</span>
        </h1>
      </motion.div>
      
      <div className="flex items-center gap-6">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-900/40 border border-emerald-500/30 rounded-full"
        >
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em]">
            Gemini Pro Vision Active
          </span>
        </motion.div>
        
        <div className="hidden md:block text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-medium">
          v2.0.4 - Localhost:3000
        </div>
      </div>
    </nav>
  );
}
