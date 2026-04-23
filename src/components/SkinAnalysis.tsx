import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, 
  Camera, 
  Trash2, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle,
  Activity,
  Droplets,
  Sun,
  Moon,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { analyzeSkin } from '../services/gemini';
import { SkinAnalysisResult, AnalysisStatus } from '../types/analysis';

export default function SkinAnalysis() {
  const [image, setImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [status, setStatus] = useState<AnalysisStatus>('idle');
  const [result, setResult] = useState<SkinAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, or WebP).');
      return;
    }
    setError(null);
    setMimeType(file.type);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const startAnalysis = async () => {
    if (!image || !mimeType) return;
    
    setStatus('analyzing');
    setError(null);
    
    try {
      // Extract base64 from dataURL
      const base64 = image.split(',')[1];
      const data = await analyzeSkin(base64, mimeType);
      setResult(data);
      setStatus('completed');
      
      // Scroll to results
      setTimeout(() => {
        document.getElementById('analysis-results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze image. Please ensure your API key is correctly configured in the secrets panel and try again.');
      setStatus('error');
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setStatus('idle');
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto px-6 pb-24">
      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-12 gap-4">
        {[
          { step: 1, label: 'Upload' },
          { step: 2, label: 'Analyze' },
          { step: 3, label: 'Report' }
        ].map((s) => (
          <div key={s.step} className="flex-1 flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
              (status === 'idle' && s.step === 1) || 
              (status === 'analyzing' && s.step === 2) || 
              (status === 'completed' && s.step === 3) ||
              (status === 'completed' && s.step < 3)
                ? 'bg-emerald-500 border-emerald-500 text-black' 
                : 'bg-zinc-900 border-zinc-800 text-zinc-500'
            }`}>
              {status === 'completed' && s.step < 3 ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-xs font-bold">{s.step}</span>}
            </div>
            <span className={`text-[9px] font-bold uppercase tracking-[0.2em] ${
               (status === 'idle' && s.step === 1) || (status === 'analyzing' && s.step === 2) || (status === 'completed' && s.step === 3)
                ? 'text-emerald-400'
                : 'text-zinc-600'
            }`}>{s.label}</span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {status === 'idle' || status === 'error' ? (
          <motion.div
            key="upload-zone"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className={`relative group border border-[#27272a] bg-[#18181b] rounded-2xl p-12 text-center transition-all ${
              image ? 'border-emerald-500/40' : 'hover:border-emerald-500/20'
            }`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            id="drop-zone"
          >
            {image ? (
              <div className="space-y-6">
                <div className="relative inline-block group/preview">
                  <div className="absolute inset-0 bg-[#4ade80]/10 blur-xl rounded-full -z-10" />
                  <img src={image} alt="Preview" className="w-64 h-80 object-cover rounded-3xl border-2 border-[#4ade80]/20 shadow-2xl" />
                  <button 
                    onClick={reset}
                    className="absolute -top-3 -right-3 p-2 bg-zinc-800 text-zinc-400 border border-zinc-700 rounded-full shadow-lg hover:text-white transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#a1a1aa] uppercase tracking-[0.2em] mb-2">Subject Captured</h3>
                  <p className="text-xs text-[#71717a] mb-6 max-w-sm mx-auto leading-relaxed">
                    Subject alignment confirmed. Neural networks primed for biological parsing.
                  </p>
                  <button
                    onClick={startAnalysis}
                    className="inline-flex items-center gap-3 px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black rounded-lg font-bold shadow-lg shadow-emerald-500/10 transition-all active:scale-95 uppercase text-xs tracking-wider"
                  >
                    Initialize Analysis <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer">
                <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-zinc-700 transition-all border border-zinc-700">
                  <Camera className="w-8 h-8 text-zinc-500 group-hover:text-emerald-400" />
                </div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-[0.2em] mb-1">Load Visual Data</h3>
                <p className="text-[11px] text-[#71717a] mb-4 uppercase tracking-tighter">Drag subject into viewport or browse local records</p>
                <div className="flex gap-2 justify-center mb-4">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-widest border ${
                    process.env.GEMINI_API_KEY ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' : 'text-amber-400 border-amber-500/20 bg-amber-500/5'
                  }`}>
                    {process.env.GEMINI_API_KEY ? 'Neural Engine: Active' : 'Neural Engine: Simulation Mode'}
                  </span>
                </div>
                <div className="flex gap-2 justify-center">
                  <span className="text-[9px] font-bold text-zinc-600 border border-zinc-800 bg-zinc-900 px-2 py-0.5 rounded">JPG</span>
                  <span className="text-[9px] font-bold text-zinc-600 border border-zinc-800 bg-zinc-900 px-2 py-0.5 rounded">PNG</span>
                  <span className="text-[9px] font-bold text-zinc-600 border border-zinc-800 bg-zinc-900 px-2 py-0.5 rounded">WEBP</span>
                </div>
                <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
              </div>
            )}

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-zinc-950 border border-red-900/30 rounded-lg flex items-center gap-3 text-red-400 text-xs text-left"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <p>{error}</p>
              </motion.div>
            )}
          </motion.div>
        ) : status === 'analyzing' ? (
          <motion.div
            key="analyzing-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-24 bg-zinc-900/50 border border-zinc-800 rounded-3xl"
          >
            <div className="relative w-32 h-32 mx-auto mb-8">
              <div className="absolute inset-0 border-2 border-zinc-800 rounded-full" />
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 border-2 border-emerald-500 border-t-transparent rounded-full shadow-[0_0_15px_rgba(16,185,129,0.2)]"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Activity className="w-8 h-8 text-emerald-500 animate-pulse" />
              </div>
            </div>
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-[0.3em] mb-2">Analyzing Bio-markers</h3>
            <p className="text-[10px] text-zinc-600 uppercase font-mono tracking-widest">LAYER_SCANNING: 0x4F92... {Math.floor(Math.random() * 100)}%</p>
          </motion.div>
        ) : result ? (
          <motion.div
            key="analysis-results"
            id="analysis-results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col gap-6"
          >
            {/* Header / Score */}
            <div className="bg-[#18181b] border border-[#27272a] rounded-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-8 p-8 min-h-[240px]">
              <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4ade80 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
              
              <div className="relative w-40 h-40 flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="70" fill="none" stroke="#27272a" strokeWidth="8" />
                  <motion.circle 
                    cx="80" cy="80" r="70" fill="none" stroke="#4ade80" strokeWidth="8" 
                    strokeDasharray="440"
                    initial={{ strokeDashoffset: 440 }}
                    animate={{ strokeDashoffset: 440 - (440 * (result.overall_score / 100)) }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_10px_rgba(74,222,128,0.3)]"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold font-serif text-white">{result.overall_score}</span>
                  <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#71717a] mt-1">Health Score</span>
                </div>
              </div>

              <div className="flex-1 text-center md:text-left relative z-10">
                <div className="inline-flex px-3 py-1 bg-[#4ade80] text-black text-[9px] font-bold rounded mb-4 uppercase tracking-[0.1em]">
                  Analysis Optimized
                </div>
                <h2 className="text-2xl font-bold text-white mb-3 tracking-tight italic font-serif">Report Complete</h2>
                <p className="text-sm text-[#71717a] leading-relaxed max-w-md">
                  {result.summary}
                </p>
              </div>
              
              <div className="absolute bottom-6 right-8 hidden md:block">
                <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-mono">Updated: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { label: 'Type', value: result.skin_type, icon: Activity, color: 'text-zinc-100', border: 'border-zinc-800' },
                { label: 'Tone', value: result.skin_tone, icon: Droplets, color: 'text-zinc-100', border: 'border-zinc-800' },
                { label: 'Hydration', value: result.hydration, icon: Droplets, color: 'text-zinc-100', border: 'border-zinc-800' }
              ].map((m) => (
                <div key={m.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 transition-all hover:bg-zinc-800/50">
                   <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-2 block">{m.label}</span>
                   <p className="text-base font-medium text-white tracking-tight">{m.value}</p>
                </div>
              ))}
            </div>

            {/* Concerns & Routine Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Primary Concerns */}
              <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1.5 h-4 bg-[#f472b6] rounded-full"></div>
                  <h3 className="text-[10px] font-bold text-[#a1a1aa] uppercase tracking-[0.2em]">Primary Concerns</h3>
                </div>
                <div className="space-y-2">
                  {result.concerns.map((c) => (
                    <div key={c} className="flex justify-between items-center bg-[#1c1c21] p-3 rounded-lg border border-[#27272a] group hover:border-[#f472b6]/30 transition-all">
                      <span className="text-[13px] text-zinc-200">{c}</span>
                      <span className="text-[9px] text-[#f472b6] font-bold tracking-widest bg-[#f472b6]/10 px-2 py-0.5 rounded">DETECTED</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Routine */}
              <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1.5 h-4 bg-[#60a5fa] rounded-full"></div>
                  <h3 className="text-[10px] font-bold text-[#a1a1aa] uppercase tracking-[0.2em]">Routine Overview</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400 group-hover:text-[#60a5fa] transition-colors">AM</div>
                    <div>
                      <span className="block text-[10px] text-zinc-600 uppercase font-bold tracking-widest mb-0.5">Revitalize</span>
                      <p className="text-sm text-zinc-300 font-medium leading-tight">{result.morning_routine[0] || 'Cleanse & Protect'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400 group-hover:text-[#60a5fa] transition-colors">PM</div>
                    <div>
                      <span className="block text-[10px] text-zinc-600 uppercase font-bold tracking-widest mb-0.5">Recover</span>
                      <p className="text-sm text-zinc-300 font-medium leading-tight">{result.night_routine[0] || 'Nourish & Hydrate'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Routine & Ingredients */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6">
                <h3 className="text-[10px] font-bold text-[#4ade80] uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  Targeted Compounds
                </h3>
                <div className="space-y-4">
                  {result.ingredients.map((ing) => (
                    <div key={ing.name} className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-emerald-500/20 transition-all">
                      <h4 className="text-sm font-bold text-[#f4f4f5] mb-1">{ing.name}</h4>
                      <p className="text-[11px] text-[#a1a1aa] leading-normal">{ing.reason}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 flex flex-col">
                <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-6">Lifestyle Directives</h3>
                <div className="space-y-3">
                  {result.lifestyle_tips.map((tip) => (
                    <div key={tip} className="flex items-start gap-3 p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl">
                      <Lightbulb className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-zinc-300 leading-relaxed font-medium">{tip}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-auto pt-6 border-t border-zinc-800 flex justify-center">
                  <button 
                    onClick={reset}
                    className="inline-flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-zinc-600 hover:text-[#4ade80] transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" /> Initialize New System Scan
                  </button>
                </div>
              </section>
            </div>
            
            <p className="text-center text-[9px] text-[#52525b] uppercase tracking-widest max-w-xl mx-auto leading-loose pb-12 mt-6">
              Medical Disclaimer: Not a diagnostic tool. This system provides informational parsing only. Consult a clinical professional for biological concerns.
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
