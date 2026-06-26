import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  triggerToast: (msg: string) => void;
}

export default function JoinSpotlightSplit({ triggerToast }: Props) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    triggerToast("✨ SUBSCRIBED TO ETI NEWSLETTER!");
  };

  const bgImage = "https://cdn.shopify.com/s/files/1/0842/8362/1657/files/565312703_10161443462990684_2525092078171342042_n.jpg?v=1766319824";

  return (
    <section className="relative w-full bg-[#050508] border-t border-neutral-900 overflow-hidden font-sans">
      <div className="flex flex-col md:flex-row w-full items-stretch min-h-[450px]">
        
        {/* Left Side: Dark fitment image background */}
        <div 
          className="w-full md:w-1/2 min-h-[250px] bg-cover bg-center relative"
          style={{ backgroundImage: `url('${bgImage}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-neutral-950/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-neutral-950 md:block hidden" />
          
          <div className="absolute top-6 left-6 z-10">
            <span className="text-[10px] tracking-[0.2em] font-mono text-emerald-400 uppercase px-2 py-0.5 border border-emerald-500/30 bg-emerald-500/10 rounded">
              Alternative Layout 008-E: Spotlight Split
            </span>
          </div>

          <div className="absolute bottom-6 left-6 font-mono text-[9px] text-neutral-500">
            LOC / BANGKOK HEADQUARTERS // 2026
          </div>
        </div>

        {/* Right Side: Interactive spotlight form card */}
        <div 
          onMouseMove={handleMouseMove}
          className="w-full md:w-1/2 bg-neutral-950 flex flex-col justify-center p-8 md:p-16 relative"
          style={{
            backgroundImage: `radial-gradient(circle 250px at ${mousePos.x}px ${mousePos.y}px, rgba(16, 185, 129, 0.05), transparent 70%)`
          }}
        >
          {/* Border accent */}
          <div className="absolute top-0 bottom-0 left-0 w-[1px] bg-gradient-to-b from-neutral-900 via-emerald-500/20 to-neutral-900 hidden md:block" />

          <div className="max-w-md w-full mx-auto space-y-6">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.div
                  key="form-section"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block">
                      SECURE NETWORK LINK
                    </span>
                    <h3 className="text-3xl md:text-4xl font-bold uppercase tracking-tight text-white leading-none">
                      ESTABLISH <br/>
                      DIRECT CHANNEL
                    </h3>
                    <p className="text-xs text-neutral-400 font-light leading-relaxed">
                      First access to chassis support updates and priority allocations. No spam. Direct dispatch logs.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider block">
                        Console Terminal input
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ENTER REGISTERED EMAIL..."
                        className="w-full bg-neutral-900 border border-neutral-800 focus:border-emerald-500/50 outline-none text-white text-xs tracking-wider placeholder-neutral-600 font-mono py-3.5 px-4 rounded transition-colors uppercase"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full text-center text-xs uppercase font-mono font-bold py-3.5 bg-white text-black hover:bg-emerald-500 hover:text-white transition-colors rounded shadow-md"
                    >
                      Initialize Link &rarr;
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success-prompt"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-4 py-8"
                >
                  <div className="w-12 h-12 rounded-full border border-emerald-500 bg-emerald-500/10 flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                    <span className="text-emerald-400 text-lg">&check;</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-emerald-400 font-mono text-xs uppercase font-bold">LINK CONNECTED</p>
                    <p className="text-[10px] text-neutral-500 font-mono">STANDBY FOR DIRECT PRIORITY RUN DISPATCHES.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
}
