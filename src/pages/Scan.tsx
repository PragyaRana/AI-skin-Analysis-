import React, { useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import { useAuth } from "../context/AuthContext";
import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { motion, AnimatePresence } from "motion/react";
import { Camera, Upload, RefreshCw, Sparkles, X, ChevronRight, AlertCircle } from "lucide-react";
import { cn } from "../lib/utils";

export default function Scan() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const webcamRef = useRef<Webcam>(null);
  
  const [image, setImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImage(imageSrc);
      setIsCameraActive(false);
    }
  }, [webcamRef]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const reset = () => {
    setImage(null);
    setError(null);
  };

  const analyze = async () => {
    if (!image || !user) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/analyze-skin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      });

      if (!response.ok) throw new Error("Analysis failed");
      const analysis = await response.json();

      // Save to Firestore
      const reportData = {
        userId: user.uid,
        imageUrl: "Placeholder (In real app, upload to Storage/Cloudinary)", // For this demo we don't store base64 in firestore as it's too big, usually we'd upload to storage first.
        ...analysis,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "reports"), reportData);
      navigate(`/report/${docRef.id}`);
    } catch (err: any) {
      setError(err.message || "Something went wrong during analysis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-12">
      <div className="text-center space-y-4">
        <p className="label-caps text-brand-500">Optical Capture</p>
        <h1 className="font-serif text-5xl font-medium tracking-tight italic">Initialize Analysis</h1>
        <p className="text-dark-900/50 max-w-md mx-auto font-medium">
          Ensure your face is centered within the frame for high-fidelity scanning.
        </p>
      </div>

      <div className="relative aspect-square md:aspect-video w-full bg-white rounded-[3rem] overflow-hidden border border-brand-200 shadow-sm flex items-center justify-center">
        {/* Scan Animation Overlay */}
        <motion.div 
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand-500 to-transparent shadow-[0_0_15px_#D4AF37] z-30"
        />

        <AnimatePresence mode="wait">
          {image ? (
            <motion.div 
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative w-full h-full"
            >
              <img src={image} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-x-0 bottom-8 flex justify-center gap-4 z-40">
                <button 
                  onClick={reset}
                  className="btn-pill bg-white/90 backdrop-blur-sm text-dark-900 border border-brand-200 flex items-center gap-2 hover:bg-white"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retake
                </button>
                <button 
                  onClick={analyze}
                  disabled={loading}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Start Analysis</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ) : isCameraActive ? (
            <motion.div 
              key="camera"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative w-full h-full"
            >
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full h-full object-cover"
                videoConstraints={{ facingMode: "user" }}
              />
              {/* Face Guide Frame */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                <div className="w-[280px] h-[380px] border-2 border-dashed border-brand-500/50 rounded-full flex flex-col items-center justify-center bg-black/5">
                   <p className="label-caps !text-white opacity-50 mt-auto mb-10">Align Face Here</p>
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-8 flex justify-center gap-6 z-40 items-center">
                <button 
                  onClick={() => setIsCameraActive(false)}
                  className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-dark-900/60 hover:text-dark-900 border border-brand-200"
                >
                  <X className="w-5 h-5" />
                </button>
                <button 
                  onClick={capture}
                  className="w-20 h-20 bg-brand-500 text-white rounded-full flex items-center justify-center hover:scale-110 shadow-2xl transition-all border-4 border-white/50"
                >
                  <Camera className="w-8 h-8" />
                </button>
                <div className="w-12 h-12" /> {/* Spacer */}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="options"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col md:flex-row gap-8 w-full px-12"
            >
              <button 
                onClick={() => setIsCameraActive(true)}
                className="flex-1 p-12 rounded-[3rem] bg-brand-50 border border-brand-200 hover:border-brand-500 hover:bg-white group transition-all text-center flex flex-col items-center justify-center gap-6"
              >
                <div className="w-20 h-20 rounded-full bg-white border border-brand-200 text-brand-500 flex items-center justify-center group-hover:bg-brand-500 group-hover:text-white transition-all shadow-sm">
                  <Camera className="w-8 h-8" />
                </div>
                <div>
                  <p className="label-caps mb-1">Live Capture</p>
                  <p className="text-xs font-serif italic text-dark-900/40">Using high-res sensor</p>
                </div>
              </button>

              <label className="flex-1 p-12 rounded-[3rem] bg-brand-50 border border-brand-200 hover:border-brand-500 hover:bg-white group transition-all text-center flex flex-col items-center justify-center gap-6 cursor-pointer">
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                <div className="w-20 h-20 rounded-full bg-white border border-brand-200 text-dark-900/30 flex items-center justify-center group-hover:border-brand-500 group-hover:text-brand-500 transition-all shadow-sm">
                  <Upload className="w-8 h-8" />
                </div>
                <div>
                  <p className="label-caps mb-1">Upload Archive</p>
                  <p className="text-xs font-serif italic text-dark-900/40">Select source imagery</p>
                </div>
              </label>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="space-y-4">
          <p className="label-caps text-brand-500">Security Check</p>
          <div className="glass p-6 rounded-3xl flex gap-4 border-l-4 border-brand-500">
             <ShieldCheck className="w-6 h-6 text-brand-500 shrink-0" />
             <p className="text-sm font-serif italic text-dark-900/60 leading-relaxed">
               All imagery is processed via secure neural encryption. We do not store biometric data without explicit temporal consent.
             </p>
          </div>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 bg-red-50 border border-red-100 rounded-3xl flex gap-4"
          >
            <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
            <div>
              <p className="label-caps text-red-500 mb-1">Optical Failure</p>
              <p className="text-xs text-red-900/60 font-medium">{error}</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
