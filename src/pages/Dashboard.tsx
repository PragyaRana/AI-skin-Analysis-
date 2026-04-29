import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import { SkinReport } from "../types";
import { motion } from "motion/react";
import { Camera, Calendar, ArrowRight, Activity, Droplets, Zap, Clock } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [lastReport, setLastReport] = useState<SkinReport | null>(null);
  const [history, setHistory] = useState<SkinReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        const q = query(
          collection(db, "reports"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc"),
          limit(5)
        );
        const querySnapshot = await getDocs(q);
        const reports = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SkinReport));
        
        if (reports.length > 0) {
          setLastReport(reports[0]);
          setHistory(reports.reverse());
        }
      } catch (err) {
        console.error("Fetch dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <p className="label-caps text-brand-500 mb-2">Member Overview</p>
          <h1 className="font-serif text-5xl font-medium tracking-tight italic">Welcome, {profile?.name || "Radiant User"}</h1>
        </div>
        <Link 
          to="/scan" 
          className="btn-primary flex items-center gap-2"
        >
          <Camera className="w-4 h-4" />
          New Analysis
        </Link>
      </header>

      {lastReport ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Score Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 glass p-10 rounded-[3rem] flex flex-col md:flex-row gap-12 items-center"
          >
            <div className="relative">
              <svg className="w-48 h-48 transform -rotate-90">
                <circle cx="96" cy="96" r="88" stroke="#E8E1D5" strokeWidth="2" fill="transparent" />
                <circle
                  cx="96" cy="96" r="88" stroke="#D4AF37" strokeWidth="4" fill="transparent"
                  strokeDasharray={552.92}
                  strokeDashoffset={552.92 * (1 - lastReport.overallScore / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="flex items-baseline gap-1">
                  <span className="text-7xl font-light tracking-tighter">{lastReport.overallScore}</span>
                  <span className="text-xl font-light text-dark-900/20 italic">/100</span>
                </div>
                <span className="label-caps text-brand-500 mt-2">Health Score</span>
              </div>
            </div>

            <div className="flex-1 space-y-8">
              <p className="font-serif text-lg italic text-dark-900/70 leading-relaxed">
                "{lastReport.summary.substring(0, 120)}..."
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Glow", val: lastReport.glowScore, color: "bg-brand-500" },
                  { label: "Hydration", val: lastReport.hydrationScore, color: "bg-blue-400" },
                ].map((stat, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="label-caps">{stat.label}</span>
                      <span className="text-sm font-bold uppercase">{stat.val}%</span>
                    </div>
                    <div className="w-full h-1 bg-brand-100 rounded-full overflow-hidden">
                      <div className={`h-full ${stat.color}`} style={{ width: `${stat.val}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Link 
                to={`/report/${lastReport.id}`}
                className="btn-outline w-full flex items-center justify-center gap-2 group"
              >
                Full scientific breakdown
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Quick Stats Column */}
          <div className="space-y-8">
            <div className="glass p-8 rounded-[3rem] text-center">
               <p className="label-caps text-brand-500 mb-6 uppercase tracking-[0.3em]">Estimated Skin Age</p>
               <div className="flex items-baseline justify-center gap-2">
                 <span className="text-7xl font-light tracking-tighter">{lastReport.skinAge}</span>
                 <span className="text-xl font-serif italic text-dark-900/30">yrs</span>
               </div>
               <p className="mt-4 text-[10px] font-bold text-green-600 uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full inline-block">
                 Optimum Range Identified
               </p>
            </div>

            <div className="bg-dark-900 p-8 rounded-[3rem] text-white space-y-6">
              <p className="label-caps text-brand-500">Key Observations</p>
              <div className="flex flex-wrap gap-2">
                {lastReport.issuesDetected.slice(0, 4).map((issue, i) => (
                  <span key={i} className="px-3 py-1 bg-white/10 rounded-lg text-xs font-medium tracking-tight">
                    {issue}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Evolution Chart */}
          {history.length > 0 && (
            <div className="lg:col-span-3 glass p-10 rounded-[3rem]">
              <div className="flex items-center justify-between mb-10">
                <p className="label-caps text-dark-900">Health Evolution</p>
                <div className="flex gap-4">
                  <span className="flex items-center gap-2 text-[10px] font-bold uppercase text-dark-900/40">
                    <span className="w-2 h-2 rounded-full bg-brand-500"></span>
                    Overall health
                  </span>
                </div>
              </div>
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={history.map(h => ({ name: new Date(h.createdAt?.seconds * 1000).toLocaleDateString(), score: h.overallScore }))}>
                    <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} stroke="#2D2424" dy={10} opacity={0.3} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#2D2424", border: "none", borderRadius: "12px", padding: "12px", color: "#fff" }}
                      itemStyle={{ color: "#D4AF37", fontSize: "12px", fontWeight: "bold" }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#D4AF37" 
                      strokeWidth={3} 
                      dot={{ r: 4, fill: "#2D2424", stroke: "#D4AF37", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="glass p-20 rounded-[4rem] text-center max-w-2xl mx-auto space-y-8">
          <div className="w-24 h-24 bg-brand-100 rounded-full flex items-center justify-center mx-auto text-brand-500 border-4 border-white shadow-xl shadow-brand-200/50">
            <Camera className="w-10 h-10" />
          </div>
          <div className="space-y-4">
            <h2 className="font-serif text-3xl italic">Awaiting your first scan.</h2>
            <p className="text-dark-900/50 max-w-sm mx-auto font-medium">Unlock scientific routine planning and objective skin tracking based on advanced neural synthesis.</p>
          </div>
          <Link 
            to="/scan" 
            className="btn-primary inline-flex items-center gap-2"
          >
            Initialize Analysis
          </Link>
        </div>
      )}
    </div>
  );
}
