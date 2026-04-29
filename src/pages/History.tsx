import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import { SkinReport } from "../types";
import { motion } from "motion/react";
import { Search, Calendar, ChevronRight, Activity, CalendarDays, Inbox } from "lucide-react";

export default function History() {
  const { user } = useAuth();
  const [reports, setReports] = useState<SkinReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchHistory = async () => {
      try {
        const q = query(
          collection(db, "reports"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        setReports(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SkinReport)));
      } catch (err) {
        console.error("Fetch history error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  if (loading) return (
    <div className="max-w-4xl mx-auto px-6 py-20 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-6 space-y-10 pb-20">
      <header>
        <h1 className="font-display text-4xl font-bold mb-2">Analysis History</h1>
        <p className="text-slate-500">Review all your past skin checks and monitor your improvements.</p>
      </header>

      {reports.length > 0 ? (
        <div className="space-y-4">
          {reports.map((report, i) => (
            <motion.div 
              key={report.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link 
                to={`/report/${report.id}`}
                className="glass p-6 rounded-3xl flex items-center justify-between hover:border-brand-300 hover:shadow-2xl transition-all group"
              >
                <div className="flex items-center gap-6">
                  <div className={`w-16 h-16 rounded-2xl bg-brand-50 flex flex-col items-center justify-center text-brand-600 border border-brand-100`}>
                    <span className="text-sm font-bold">{report.overallScore}</span>
                    <span className="text-[8px] font-bold uppercase tracking-tighter opacity-70">Score</span>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-brand-600 transition-colors">
                      Skin Check #{reports.length - i}
                    </h3>
                    <div className="flex items-center gap-4 text-xs font-medium text-slate-400 mt-1">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5" />
                        {new Date(report.createdAt?.seconds * 1000).toLocaleDateString()}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-200" />
                      <span className="flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5" />
                        {report.issuesDetected.length} Areas Found
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                   <div className="flex -space-x-2 mr-2">
                     {report.issuesDetected.slice(0, 2).map((issue, j) => (
                       <div key={j} className="h-6 px-2 bg-slate-100 rounded-lg border-2 border-white text-[8px] font-bold text-slate-500 flex items-center justify-center uppercase truncate max-w-[80px]">
                         {issue}
                       </div>
                     ))}
                     {report.issuesDetected.length > 2 && (
                       <div className="h-6 w-6 bg-brand-100 rounded-lg border-2 border-white text-[8px] font-bold text-brand-600 flex items-center justify-center uppercase">
                         +{report.issuesDetected.length - 2}
                       </div>
                     )}
                   </div>
                   <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-brand-500 transition-all group-hover:translate-x-1" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="glass p-20 rounded-[3rem] text-center">
           <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
             <Inbox className="w-10 h-10" />
           </div>
           <h2 className="text-xl font-bold mb-2">No history yet</h2>
           <p className="text-slate-500 mb-8 max-w-xs mx-auto">Your analysis reports will appear here once you take your first scan.</p>
           <Link to="/scan" className="text-brand-500 font-bold hover:underline">Take first scan</Link>
        </div>
      )}
    </div>
  );
}
