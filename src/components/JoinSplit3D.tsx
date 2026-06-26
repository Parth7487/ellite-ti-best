import React, { useState, useRef } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";

interface Props {
  triggerToast: (msg: string) => void;
}

export default function JoinSplit3D({ triggerToast }: Props) {
  const [email, setEmail] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse coordinate motion values for 3D tilt
  const x = useMotionValue(200);
  const y = useMotionValue(200);

  // Transform coordinates to degree tilts
  const rotateX = useTransform(y, [0, 400], [10, -10]);
  const rotateY = useTransform(x, [0, 400], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    // Reset to center
    x.set(200);
    y.set(200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    triggerToast("✨ SUBSCRIBED TO ETI NEWSLETTER!");
    setEmail("");
  };

  return (
    <section className="relative w-full py-24 bg-black border-t border-neutral-900 overflow-hidden font-sans">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          
          {/* Left Side: Massive Typographic Text */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="mb-4">
              <span className="text-[10px] tracking-[0.2em] font-mono text-emerald-500 uppercase px-2 py-0.5 border border-emerald-500/30 bg-emerald-500/10 rounded">
                Alternative Layout 008-C: Split 3D Tilt
              </span>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] text-white">
              JOIN THE <br/>
              <span className="text-emerald-500">ELITES.</span>
            </h2>
            <p className="text-neutral-400 text-sm max-w-md font-light leading-relaxed">
              We release support updates for new chassis programs and drop titanium runs selectively. Become part of the registry to capture priority allocation.
            </p>
          </div>

          {/* Right Side: 3D Tilt Card */}
          <div 
            className="w-full lg:w-1/2 flex justify-center"
            style={{ perspective: 1000 }}
          >
            <motion.div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                rotateX: isFocused ? -3 : rotateX,
                rotateY: isFocused ? 15 : rotateY,
                transformStyle: "preserve-3d"
              }}
              transition={isFocused ? { type: "spring", stiffness: 200, damping: 20 } : { type: "spring", stiffness: 400, damping: 30 }}
              className="w-full max-w-sm border border-neutral-900 bg-neutral-950 p-8 md:p-10 rounded-xl relative overflow-hidden shadow-2xl cursor-pointer"
            >
              
              {/* Scanline overlay */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-[0.02] z-10"
                style={{
                  backgroundImage: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))",
                  backgroundSize: "100% 4px, 6px 100%"
                }}
              />

              {/* Hologram aesthetic background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

              <div style={{ transform: "translateZ(30px)" }} className="space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block">
                    SECURE CONSOLE LINK
                  </span>
                  <h3 className="text-xl font-bold uppercase text-white tracking-tight">
                    Registry Input
                  </h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      placeholder="YOU@EMAIL.COM"
                      className="w-full bg-neutral-900 border border-neutral-800 focus:border-emerald-500/50 outline-none text-white text-xs tracking-wider placeholder-neutral-600 font-mono py-3 px-4 rounded transition-colors uppercase"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full text-center text-xs uppercase font-mono font-bold py-3 bg-white text-black hover:bg-emerald-500 hover:text-white transition-all rounded shadow-md"
                  >
                    Subscribe &rarr;
                  </button>
                </form>

                <p className="text-[9px] font-mono text-neutral-600 uppercase text-center">
                  Zero spam. Direct priority dispatches.
                </p>
              </div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
