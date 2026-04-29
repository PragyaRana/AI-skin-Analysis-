import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";
import { Sparkles, User, LogOut, LayoutDashboard, Camera, History } from "lucide-react";
import { motion } from "motion/react";

export function Navbar() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-10 py-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between bg-white/50 backdrop-blur-md border border-brand-200 rounded-full px-8 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center">
            <Sparkles className="text-white w-4 h-4" />
          </div>
          <span className="font-sans text-lg font-medium tracking-tight uppercase text-dark-900">
            Glow <span className="font-light text-brand-500">AI</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          <Link to="/" className="text-[10px] font-bold uppercase tracking-[0.2em] text-dark-900/60 hover:text-brand-500 transition-colors">Home</Link>
          {user && (
            <>
              <Link to="/dashboard" className="text-[10px] font-bold uppercase tracking-[0.2em] text-dark-900/60 hover:text-brand-500 transition-colors">Dashboard</Link>
              <Link to="/scan" className="text-[10px] font-bold uppercase tracking-[0.2em] text-dark-900/60 hover:text-brand-500 transition-colors">Analyze</Link>
              <Link to="/history" className="text-[10px] font-bold uppercase tracking-[0.2em] text-dark-900/60 hover:text-brand-500 transition-colors">History</Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="flex items-center gap-2 p-1 rounded-full hover:bg-white/50 transition-colors border border-transparent hover:border-brand-200">
                <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-500 font-bold border border-brand-200">
                  {profile?.name?.[0].toUpperCase() || "U"}
                </div>
              </Link>
              <button 
                onClick={handleSignOut}
                className="p-2 text-dark-900/40 hover:text-dark-900 transition-colors"
                title="Log out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link 
              to="/login"
              className="px-8 py-2.5 bg-dark-900 text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-dark-800 transition-all shadow-lg shadow-dark-900/10"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
