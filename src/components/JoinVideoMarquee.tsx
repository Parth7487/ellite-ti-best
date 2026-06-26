import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  triggerToast: (msg: string) => void;
}

export default function JoinVideoMarquee({ triggerToast }: Props) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const videoUrl = "https://assets.mixkit.co/videos/preview/mixkit-car-headlights-in-the-dark-34448-large.mp4";
  const posterImage = "https://cdn.shopify.com/s/files/1/0842/8362/1657/files/Mask_group.png?v=1760445002";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    triggerToast("✨ REGISTERED TO ETI NEWSLETTER MAINMAIN!");
  };

  return (
    <section className="relative w-full h-[60vh] min-h-[450px] bg-neutral-950 flex flex-col justify-between overflow-hidden border-t border-neutral-900">
      
      {/* Video Background Layer */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          poster={posterImage}
          className="w-full h-full object-cover opacity-25 filter brightness-50 contrast-125"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
        {/* Shadow overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-950/40 to-neutral-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-transparent to-neutral-950" />
      </div>

      {/* Section Kicker */}
      <div className="relative z-10 p-6 self-start">
        <span className="text-[10px] tracking-[0.2em] font-mono text-emerald-500 uppercase px-2 py-0.5 border border-emerald-500/30 bg-emerald-500/10 rounded">
          008 — JOIN
        </span>
      </div>

      {/* Center Sign Up Content */}
      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 text-center my-auto space-y-6">
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="signup-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h3 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-white">
                  THE ELITE REGISTRY
                </h3>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto font-sans font-light">
                  First access to chassis support updates and priority allocations. No spam. Direct dispatch logs.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  required
                  placeholder="ENTER EMAIL ADDRESS..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-black/60 border border-neutral-800 focus:border-emerald-500/50 outline-none text-white text-xs tracking-wider placeholder-neutral-600 font-mono py-3 px-4 rounded flex-1 uppercase"
                />
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs tracking-wider uppercase px-6 py-3 transition-colors rounded shadow-lg shadow-emerald-950/20"
                >
                  SECURE LINK
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success-prompt"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <div className="w-12 h-12 rounded-full border border-emerald-500 bg-emerald-500/10 flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <span className="text-emerald-400 text-lg">&check;</span>
              </div>
              <div className="space-y-1">
                <p className="text-emerald-400 font-mono text-xs uppercase font-bold">LINK ESTABLISHED</p>
                <p className="text-[10px] text-neutral-500 font-mono">WELCOME TO THE REGISTRY NETWORK.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Infinite scrolling ticker at bottom */}
      <div className="relative z-10 w-full bg-emerald-500/10 border-t border-emerald-500/20 py-2.5 overflow-hidden">
        <div className="flex w-max animate-marquee-fast">
          <div className="flex gap-16 text-[9px] font-mono tracking-[0.25em] text-emerald-400 uppercase select-none whitespace-nowrap">
            <span>PRIORITY ACCESS</span>
            <span>&middot;</span>
            <span>CHASSIS SUPPORT LOGS</span>
            <span>&middot;</span>
            <span>LIMITED TITANIUM drops</span>
            <span>&middot;</span>
            <span>MOTORSPORT TELEMETRY</span>
            <span>&middot;</span>
            <span>PRIORITY ACCESS</span>
            <span>&middot;</span>
            <span>CHASSIS SUPPORT LOGS</span>
            <span>&middot;</span>
            <span>LIMITED TITANIUM drops</span>
            <span>&middot;</span>
            <span>MOTORSPORT TELEMETRY</span>
          </div>
        </div>
      </div>

      {/* Styles for Infinite Marquee loop */}
      <style>{`
        @keyframes marquee-fast {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-fast {
          animation: marquee-fast 18s linear infinite;
        }
      `}</style>

    </section>
  );
}
