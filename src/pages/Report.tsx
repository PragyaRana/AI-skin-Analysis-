import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { SkinReport } from "../types";
import { motion } from "motion/react";
import { 
  Sparkles, ShieldCheck, Activity, Droplets, Zap, 
  Calendar, ArrowLeft, Download, ShoppingBag, 
  Leaf, Utensils, Heart 
} from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function Report() {
  const { id } = useParams();
  const [report, setReport] = useState<SkinReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      if (!id) return;
      try {
        const docSnap = await getDoc(doc(db, "reports", id));
        if (docSnap.exists()) {
          setReport({ id: docSnap.id, ...docSnap.data() } as SkinReport);
        }
      } catch (err) {
        console.error("Fetch report error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  const handleDownload = () => {
    window.print();
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-6 py-20 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin"></div>
    </div>
  );

  if (!report) return (
    <div className="max-w-7xl mx-auto px-6 py-20 text-center">
      <h1 className="text-2xl font-bold">Report not found.</h1>
      <Link to="/dashboard" className="text-brand-500 font-medium hover:underline mt-4 inline-block">Back to dashboard</Link>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-6 space-y-12 pb-24">
      <nav className="flex items-center justify-between no-print">
        <Link to="/dashboard" className="flex items-center gap-2 font-medium text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Dashboard
        </Link>
        <button 
          onClick={handleDownload}
          className="flex items-center gap-2 px-6 py-2 border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </button>
      </nav>

      {/* Header Summary */}
      <header className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-100 text-brand-600 font-bold text-[10px] uppercase tracking-widest">
            Detailed Analysis Profile
          </div>
          <h1 className="font-display text-5xl font-bold leading-tight">Your Skin <span className="text-brand-500">Report</span></h1>
          <div className="flex items-center gap-4 text-slate-500 text-sm font-medium">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {new Date(report.createdAt?.seconds * 1000).toLocaleDateString()}
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-200" />
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Verified by AI
            </span>
          </div>
          <div className="text-lg text-slate-600 leading-relaxed italic">
            <ReactMarkdown>{report.summary}</ReactMarkdown>
          </div>
        </div>

        <div className="relative">
          <div className="glass p-10 rounded-[3rem] text-center space-y-4">
             <div className="relative inline-block">
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle cx="80" cy="80" r="72" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                  <motion.circle
                    cx="80" cy="80" r="72" stroke="#da6b54" strokeWidth="8" fill="transparent"
                    strokeDasharray={452.39}
                    initial={{ strokeDashoffset: 452.39 }}
                    animate={{ strokeDashoffset: 452.39 * (1 - report.overallScore / 100) }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-display font-bold">{report.overallScore}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Score</span>
                </div>
             </div>
             <div className="space-y-1">
                <p className="font-bold text-lg">Health Status: Radiant</p>
                <p className="text-sm text-slate-400 font-medium">Skin Age: {report.skinAge} years</p>
             </div>
          </div>
        </div>
      </header>

      {/* Metrics Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: "Acne", val: report.acneScore, icon: Activity, color: "bg-red-50 text-red-500" },
          { label: "Glow", val: report.glowScore, icon: Sparkles, color: "bg-brand-50 text-brand-500" },
          { label: "Hydration", val: report.hydrationScore, icon: Droplets, color: "bg-blue-50 text-blue-500" },
          { label: "Youth", val: report.youthScore, icon: Zap, color: "bg-amber-50 text-amber-500" },
        ].map((m, i) => (
          <div key={i} className="glass p-6 rounded-3xl text-center">
            <div className={`w-10 h-10 rounded-xl ${m.color} flex items-center justify-center mx-auto mb-4`}>
              <m.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold mb-1">{m.val}%</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{m.label}</p>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Recommendations */}
        <div className="lg:col-span-2 space-y-10">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3 mb-6">
              <ShieldCheck className="w-6 h-6 text-brand-500" />
              Identified Concerns
            </h2>
            <div className="flex flex-wrap gap-3">
              {report.issuesDetected.map((issue, i) => (
                <div key={i} className="px-5 py-3 bg-white border border-slate-100 rounded-2xl flex items-center gap-3 shadow-sm hover:border-brand-200 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-brand-400" />
                  <span className="font-medium text-slate-700">{issue}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 text-brand-500" />
              Skincare Strategy
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass p-8 rounded-[2rem] space-y-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                   <Leaf className="w-5 h-5 text-green-500" />
                   Remedies
                </h3>
                <ul className="space-y-3">
                  {report.remedies.map((item, i) => (
                    <li key={i} className="text-sm text-slate-600 leading-relaxed flex gap-3">
                      <span className="text-brand-300 font-bold">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass p-8 rounded-[2rem] space-y-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                   <Sparkles className="w-5 h-5 text-brand-500" />
                   Daily Routine
                </h3>
                <ul className="space-y-3">
                  {report.routine.map((item, i) => (
                    <li key={i} className="text-sm text-slate-600 leading-relaxed flex gap-3">
                      <span className="text-brand-300 font-bold">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Lifestyle & Products */}
        <div className="space-y-8">
          <div className="p-8 rounded-[2rem] bg-slate-900 text-white space-y-6 shadow-xl shadow-slate-200">
            <h3 className="font-bold text-xl flex items-center gap-2">
              <Utensils className="w-6 h-6 text-brand-300" />
              Diet & Lifestyle
            </h3>
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Dietary Changes</p>
                <div className="flex flex-wrap gap-2">
                  {report.diet.map((d, i) => <span key={i} className="px-3 py-1 bg-white/10 text-white/80 rounded-lg text-xs font-medium">{d}</span>)}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Lifestyle Habits</p>
                <div className="flex flex-wrap gap-2">
                  {report.lifestyle.map((l, i) => <span key={i} className="px-3 py-1 bg-white/10 text-white/80 rounded-lg text-xs font-medium">{l}</span>)}
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-brand-50 border border-brand-100 space-y-6">
            <h3 className="font-bold text-xl flex items-center gap-2">
              <Heart className="w-6 h-6 text-brand-500" />
              Product Guidance
            </h3>
            <div className="space-y-4">
               {report.products.map((p, i) => (
                 <div key={i} className="flex gap-4 p-3 bg-white rounded-xl border border-brand-200">
                    <div className="w-10 h-10 bg-brand-50 rounded-lg flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5 text-brand-400" />
                    </div>
                    <p className="text-xs text-slate-600 font-medium leading-tight self-center">{p}</p>
                 </div>
               ))}
            </div>
            <div className="pt-4 border-t border-brand-200">
              <p className="text-[10px] text-brand-400 font-bold uppercase tracking-widest mb-2">Pro Tip</p>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                Consistency is key. Results usually show after 4-6 weeks of regular routine following.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
