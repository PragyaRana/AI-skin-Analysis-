import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Sparkles, Camera, ShieldCheck, Zap, ArrowRight, Star } from "lucide-react";

export default function Landing() {
  return (
    <div className="max-w-7xl mx-auto px-6">
      {/* Hero Section */}
      <section className="py-20 flex flex-col lg:flex-row items-center gap-20">
        <div className="flex-1 space-y-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-500 label-caps"
          >
            <Sparkles className="w-3 h-3" />
            <span>AI-Powered Skincare Analysis</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-7xl md:text-8xl font-medium tracking-tight leading-[0.9]"
          >
            Reveal Your <br />
            <span className="italic text-brand-500">True Radiance</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-dark-900/60 max-w-lg leading-relaxed font-serif italic"
          >
            "Advanced AI technology to analyze your skin's unique needs. Get personalized reports, routine suggestions, and scientific insights in seconds."
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Link to="/login" className="btn-primary group">
              Start Analysis
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="btn-outline">
              Learn Science
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-8 pt-6 border-t border-brand-200"
          >
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-brand-50 bg-brand-100" />
              ))}
            </div>
            <div>
              <div className="flex text-brand-500 mb-0.5">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3 h-3 fill-brand-500" />)}
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-dark-900/40">10,000+ Glowing Users</p>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 relative"
        >
          <div className="relative z-10 w-full aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl border-4 border-white">
             <img 
               src="https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?auto=format&fit=crop&q=80&w=800" 
               alt="Beautiful Skin" 
               className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-brand-500/10 mix-blend-overlay" />
          </div>
          
          {/* Floating UI Elements */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="absolute -top-10 -left-6 z-20 glass px-8 py-4 rounded-3xl"
          >
            <p className="label-caps text-brand-500 mb-1">Health Score</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-light tracking-tighter">92</span>
              <span className="text-xs font-light text-dark-900/30 italic">/100</span>
            </div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 5 }}
            className="absolute top-1/2 -right-10 z-20 glass px-8 py-4 rounded-3xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <p className="label-caps">AI Analysis Active</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-32 grid grid-cols-1 md:grid-cols-3 gap-12">
        {[
          { icon: Camera, title: "Precision Capture", desc: "Our neural network detects subtle skin textures that professional lighting often misses." },
          { icon: Sparkles, title: "Expert Routine", desc: "Receive an objective skincare roadmap validated by advanced analytical models." },
          { icon: History, title: "Temporal Tracking", desc: "Monitor your evolution with high-fidelity history logs and improvement projection." }
        ].map((feature, i) => (
          <div key={i} className="group">
            <div className="w-16 h-16 rounded-full bg-white border border-brand-200 flex items-center justify-center text-brand-500 mb-8 group-hover:bg-brand-500 group-hover:text-white transition-all duration-500">
              <feature.icon className="w-6 h-6" />
            </div>
            <h3 className="label-caps text-dark-900 mb-4">{feature.title}</h3>
            <p className="text-dark-900/60 leading-relaxed font-serif italic">{feature.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
