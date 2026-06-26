import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  triggerToast: (msg: string) => void;
}

export default function JoinGlassCard({ triggerToast }: Props) {
  const [email, setEmail] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressStep = 5; // increment progress by 5 each tick
  const tickDuration = 50; // tick every 50ms (total hold time = 1000ms)

  const handleStartHold = (e: React.FormEvent | React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!email) {
      triggerToast("⚠️ PLEASE SPECIFY AN EMAIL ADDRESS FIRST");
      return;
    }
    setIsHolding(true);
    setProgress(0);

    holdIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(holdIntervalRef.current!);
          setIsSuccess(true);
          triggerToast("✨ SUBSCRIBED TO ETI NEWSLETTER!");
          return 100;
        }
        return prev + progressStep;
      });
    }, tickDuration);
  };

  const handleReleaseHold = () => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
    }
    setIsHolding(false);
    setProgress(0);
  };

  // Reset helper
  const handleReset = () => {
    setEmail("");
    setIsSuccess(false);
    setProgress(0);
  };

  useEffect(() => {
    return () => {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    };
  }, []);

  return (
    <section className="relative w-full py-24 bg-neutral-950 flex items-center justify-center overflow-hidden border-t border-neutral-900 font-sans">
      
      {/* Floating Particle Background */}
      <div className="absolute inset-0 z-0">
        {[...Array(20)].map((_, i) => {
          const size = Math.random() * 3 + 1;
          const left = Math.random() * 100;
          const top = Math.random() * 100;
          const delay = Math.random() * 8;
          const duration = Math.random() * 12 + 8;
          return (
            <div 
              key={i}
              className="absolute rounded-full bg-emerald-500/20"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${left}%`,
                top: `${top}%`,
                animation: `float-particle ${duration}s ease-in-out infinite alternate`,
                animationDelay: `${delay}s`
              }}
            />
          );
        })}
      </div>

      <div className="relative z-10 w-full max-w-lg px-6 flex flex-col items-center">
        <div className="mb-6">
          <span className="text-[10px] tracking-[0.2em] font-mono text-emerald-500 uppercase px-2 py-0.5 border border-emerald-500/30 bg-emerald-500/10 rounded">
            Alternative Layout 008-B: Glass Card + Particle Field
          </span>
        </div>

        {/* Frosted Glass Card Container */}
        <div className="w-full bg-neutral-900/30 border border-neutral-800/80 backdrop-blur-md p-8 md:p-10 rounded-2xl shadow-2xl relative overflow-hidden flex flex-col items-center">
          
          {/* Neon Border Glow */}
          <div className="absolute inset-0 border border-emerald-500/10 rounded-2xl pointer-events-none group-hover:border-emerald-500/30 transition-all duration-500" />
          
          <div className="text-center space-y-3 mb-8 w-full">
            <h3 className="text-2xl font-bold tracking-tight text-white uppercase">
              Join the Elites
            </h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
              First access to chassis support updates, race-spec component releases, and custom fabrications.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <div className="w-full space-y-6">
                
                {/* Email Input Field */}
                <div className="relative w-full">
                  <input
                    type="email"
                    required
                    placeholder="ENTER YOUR EMAIL..."
                    value={email}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-neutral-950/40 border border-neutral-800 focus:border-neutral-700/50 outline-none text-white text-xs tracking-wider placeholder-neutral-600 font-mono py-3.5 px-4 rounded-lg transition-all text-center uppercase"
                  />
                  
                  {/* Glowing Animated Underline */}
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-emerald-500"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isFocused ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {/* Submit hold Button */}
                <div className="flex flex-col items-center space-y-3">
                  <button
                    onMouseDown={handleStartHold}
                    onMouseUp={handleReleaseHold}
                    onMouseLeave={handleReleaseHold}
                    onTouchStart={handleStartHold}
                    onTouchEnd={handleReleaseHold}
                    className="relative flex items-center justify-center w-16 h-16 rounded-full border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-900 transition-all cursor-pointer overflow-hidden focus:outline-none"
                    aria-label="Hold to subscribe"
                  >
                    {/* Ring progress indicator */}
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="rgba(16,185,129,0.1)"
                        strokeWidth="2"
                        fill="transparent"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="#10b981"
                        strokeWidth="2"
                        fill="transparent"
                        strokeDasharray={176}
                        strokeDashoffset={176 - (176 * progress) / 100}
                        className="transition-all duration-75"
                      />
                    </svg>

                    {/* Button Center Text or Symbol */}
                    <span className="text-[10px] font-mono font-bold text-neutral-300">
                      {isHolding ? `${progress}%` : "HOLD"}
                    </span>
                  </button>
                  
                  <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">
                    {isHolding ? "HOLDING CONNECT..." : "PRESS AND HOLD TO REGISTER"}
                  </span>
                </div>

              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-4 py-4 w-full"
              >
                <div className="w-12 h-12 rounded-full border border-emerald-500 bg-emerald-500/10 flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                  <span className="text-emerald-400 text-lg">&check;</span>
                </div>
                <div className="space-y-1">
                  <p className="text-emerald-400 font-mono text-xs uppercase font-bold">SUBSCRIBED</p>
                  <p className="text-[10px] text-neutral-500">Mainframe link confirmed. Welcome aboard.</p>
                </div>
                
                <button
                  onClick={handleReset}
                  className="text-[9px] font-mono uppercase text-neutral-500 hover:text-white underline cursor-pointer"
                >
                  Register another mail
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

      <style>{`
        @keyframes float-particle {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0.1;
          }
          100% {
            transform: translateY(-50px) translateX(20px);
            opacity: 0.4;
          }
        }
      `}</style>

    </section>
  );
}
