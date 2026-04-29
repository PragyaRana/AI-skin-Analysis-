import React from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "motion/react";
import { User, Mail, Calendar, Shield, Settings, ChevronRight, LogOut } from "lucide-react";
import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  if (!user || !profile) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 space-y-10">
      <header className="flex flex-col md:flex-row items-center gap-8 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
        <div className="w-32 h-32 rounded-[2.5rem] bg-brand-500 flex items-center justify-center text-white text-5xl font-display font-bold shadow-2xl shadow-brand-200">
           {profile.name[0].toUpperCase()}
        </div>
        <div className="text-center md:text-left">
           <h1 className="text-4xl font-display font-bold mb-2">{profile.name}</h1>
           <p className="text-slate-500 font-medium flex items-center justify-center md:justify-start gap-2">
             <Mail className="w-4 h-4 text-brand-300" />
             {profile.email}
           </p>
           <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
             <span className="px-3 py-1 bg-brand-50 text-brand-600 rounded-full text-xs font-bold uppercase tracking-wider border border-brand-100">Premium Member</span>
             <span className="px-3 py-1 bg-slate-50 text-slate-500 rounded-full text-xs font-bold uppercase tracking-wider border border-slate-100 flex items-center gap-1">
               <Shield className="w-3 h-3" />
               ID Verified
             </span>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-2">Account Details</h2>
          <div className="glass overflow-hidden rounded-[2.5rem]">
            {[
              { icon: User, label: "Full Name", value: profile.name },
              { icon: Mail, label: "Email Address", value: profile.email },
              { icon: Calendar, label: "Member Since", value: new Date(profile.createdAt).toLocaleDateString() },
            ].map((item, i) => (
              <div key={i} className="p-6 border-b border-slate-50 flex items-center gap-4 hover:bg-white/50 transition-colors last:border-0">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">{item.label}</p>
                  <p className="font-semibold text-slate-900">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
           <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-2">Preferences</h2>
           <div className="glass overflow-hidden rounded-[2.5rem]">
              {[
                { icon: Settings, label: "Notifications", value: "Push & Email" },
                { icon: Shield, label: "Privacy", value: "Public Profile Off" },
              ].map((item, i) => (
                <button key={i} className="w-full text-left p-6 border-b border-slate-50 flex items-center justify-between hover:bg-white/50 transition-colors last:border-0 group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{item.label}</p>
                      <p className="font-semibold text-slate-900">{item.value}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-brand-500 transition-all" />
                </button>
              ))}
              
              <button 
                onClick={handleLogout}
                className="w-full text-left p-6 flex items-center gap-4 hover:bg-red-50 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all">
                  <LogOut className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-red-400 uppercase">Support</p>
                  <p className="font-semibold text-red-600">Sign Out of Account</p>
                </div>
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
