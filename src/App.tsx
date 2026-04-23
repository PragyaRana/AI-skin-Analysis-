/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SkinAnalysis from './components/SkinAnalysis';

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950 selection:bg-emerald-900/30 selection:text-emerald-400 overflow-x-hidden">
      {/* Structural Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] z-[9999] mix-blend-overlay">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      <Navbar />
      
      <main>
        <Hero />
        <SkinAnalysis />
      </main>

      <footer className="h-10 bg-zinc-900 border-t border-zinc-800 px-8 flex items-center justify-between text-[9px] text-zinc-600 uppercase tracking-[0.2em] font-bold">
        <div className="flex items-center gap-6">
          <span>Medical Disclaimer: Not a diagnostic tool. Consult a professional.</span>
        </div>
        
        <div className="flex items-center gap-6">
          <span>Latency: 1.4s</span>
          <span className="text-emerald-500/50">Model Confidence: 94.2%</span>
          <span>© 2026 GlowAI Neurology</span>
        </div>
      </footer>
    </div>
  );
}

