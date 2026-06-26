import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Product { id: string; title: string; price: number; type: string; }
interface ChassisSlide {
  name: string;
  chassis: string;
  label: string;
  heroImage: string;
  products: Product[];
}

interface Props {
  slides: ChassisSlide[];
  onNavigate: () => void;
  onAddToCart: (item: { id: string; title: string; price: number; category: string }) => void;
}

// Custom performance stats for JDM chassis
const SPEC_DATA: Record<string, { weightSaved: string; downforce: string; autoclave: string; lapTime: string }> = {
  FD3S: { weightSaved: "-42 kg", downforce: "180 kg", autoclave: "6.2 Bar", lapTime: "-1.85s" },
  JZA80: { weightSaved: "-48 kg", downforce: "210 kg", autoclave: "6.4 Bar", lapTime: "-2.10s" },
  A90: { weightSaved: "-36 kg", downforce: "240 kg", autoclave: "6.5 Bar", lapTime: "-1.98s" },
  BNR34: { weightSaved: "-52 kg", downforce: "220 kg", autoclave: "6.8 Bar", lapTime: "-2.40s" },
  R35: { weightSaved: "-60 kg", downforce: "310 kg", autoclave: "6.8 Bar", lapTime: "-3.15s" },
  Z34: { weightSaved: "-32 kg", downforce: "160 kg", autoclave: "6.0 Bar", lapTime: "-1.20s" },
  AP1: { weightSaved: "-28 kg", downforce: "140 kg", autoclave: "6.1 Bar", lapTime: "-1.10s" },
  CT9A: { weightSaved: "-45 kg", downforce: "250 kg", autoclave: "6.6 Bar", lapTime: "-2.25s" }
};

export function ChassisCinematicShowcase({ slides, onNavigate, onAddToCart }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeSlide = slides[activeIdx];
  const specs = SPEC_DATA[activeSlide.chassis] || { weightSaved: "-30 kg", downforce: "150 kg", autoclave: "6.0 Bar", lapTime: "-1.00s" };

  return (
    <section className="relative w-full bg-[#050508] py-24 border-t border-neutral-900 overflow-hidden font-sans">
      
      {/* Background Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111115_1px,transparent_1px),linear-gradient(to_bottom,#111115_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-neutral-900 pb-8">
          <div>
            <span className="text-[10px] tracking-[0.2em] font-mono text-emerald-500 uppercase px-2 py-0.5 border border-emerald-500/30 bg-emerald-500/10 rounded inline-block">
              Alternative Layout 002-C: Cinematic Showcase
            </span>
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight text-white mt-3">
              Featured <span className="text-emerald-500">Chassis</span>
            </h2>
          </div>
          <button 
            onClick={onNavigate}
            className="text-xs font-mono text-neutral-400 hover:text-emerald-400 transition-colors uppercase border-b border-neutral-800 hover:border-emerald-500 pb-1"
          >
            Explore Full catalog &rarr;
          </button>
        </div>

        {/* Cinematic Showcase Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Pane (7 Columns) - Image Showcase & Giant Letters */}
          <div className="lg:col-span-7 bg-neutral-950 border border-neutral-900 rounded-2xl relative overflow-hidden flex flex-col justify-end p-8 md:p-12 min-h-[420px] md:min-h-[500px]">
            
            {/* Giant Watermark Chassis Text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={activeSlide.chassis}
                  initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                  animate={{ opacity: 0.04, scale: 1, rotate: -2 }}
                  exit={{ opacity: 0, scale: 1.2 }}
                  transition={{ duration: 0.6 }}
                  className="text-[12rem] md:text-[18rem] font-black font-mono tracking-tighter text-white select-none whitespace-nowrap"
                >
                  {activeSlide.chassis}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Floating Car Frame */}
            <div className="absolute inset-0 z-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide.chassis}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url('${activeSlide.heroImage}')` }}
                >
                  {/* Subtle Vignette Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-neutral-950/10" />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Static HUD Overlay Corner Brackets */}
            <div className="absolute top-6 left-6 w-8 h-8 border-t border-l border-neutral-800" />
            <div className="absolute top-6 right-6 w-8 h-8 border-t border-r border-neutral-800" />
            <div className="absolute bottom-6 left-6 w-8 h-8 border-b border-l border-neutral-800" />
            <div className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-neutral-800" />

            {/* Floating Aero Overlay points */}
            <div className="absolute top-1/4 left-1/3 z-10 pointer-events-none">
              <div className="relative flex items-center justify-center w-3 h-3">
                <div className="absolute w-full h-full rounded-full bg-emerald-500 animate-ping opacity-60" />
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="absolute left-5 font-mono text-[8px] text-neutral-400 uppercase tracking-widest bg-black/80 px-1.5 py-0.5 rounded border border-neutral-800">
                  DRY CARBON VENT
                </span>
              </div>
            </div>

            <div className="absolute bottom-1/3 right-1/4 z-10 pointer-events-none">
              <div className="relative flex items-center justify-center w-3 h-3">
                <div className="absolute w-full h-full rounded-full bg-emerald-500 animate-ping opacity-60" />
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="absolute left-5 font-mono text-[8px] text-neutral-400 uppercase tracking-widest bg-black/80 px-1.5 py-0.5 rounded border border-neutral-800">
                  AERO WINGLET
                </span>
              </div>
            </div>

            {/* Slide Text Content overlay */}
            <div className="relative z-10 space-y-2">
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block">
                {activeSlide.label}
              </span>
              <h3 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-white leading-none">
                {activeSlide.name}
              </h3>
              <p className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
                {activeSlide.chassis} &middot; BESPOKE CARBON PROGRAM
              </p>
            </div>

          </div>

          {/* Right Pane (5 Columns) - Specs Sheet & Actions */}
          <div className="lg:col-span-5 bg-neutral-950 border border-neutral-900 rounded-2xl p-8 flex flex-col justify-between gap-8">
            
            {/* Header Specs title */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-neutral-900 pb-3">
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                  Motorsport Spec Sheet
                </span>
                <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded">
                  STAGE 3 AEROLIGHT
                </span>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-neutral-900/40 border border-neutral-900/50 p-4 rounded-lg">
                  <span className="text-[9px] font-mono text-neutral-500 uppercase block mb-1">Weight Reduction</span>
                  <span className="text-xl font-bold font-mono text-emerald-400">{specs.weightSaved}</span>
                </div>
                <div className="bg-neutral-900/40 border border-neutral-900/50 p-4 rounded-lg">
                  <span className="text-[9px] font-mono text-neutral-500 uppercase block mb-1">Aero Downforce</span>
                  <span className="text-xl font-bold font-mono text-white">{specs.downforce}</span>
                </div>
                <div className="bg-neutral-900/40 border border-neutral-900/50 p-4 rounded-lg">
                  <span className="text-[9px] font-mono text-neutral-500 uppercase block mb-1">Autoclave Cure</span>
                  <span className="text-xl font-bold font-mono text-white">{specs.autoclave}</span>
                </div>
                <div className="bg-neutral-900/40 border border-neutral-900/50 p-4 rounded-lg">
                  <span className="text-[9px] font-mono text-neutral-500 uppercase block mb-1">Circuit Lap Diff</span>
                  <span className="text-xl font-bold font-mono text-cyan-400">{specs.lapTime}</span>
                </div>
              </div>
            </div>

            {/* Product Purchase List */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block">
                Chassis Components Available
              </span>

              <div className="space-y-2">
                {activeSlide.products.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => onAddToCart({ id: p.id, title: p.title, price: p.price, category: p.type === "tier3" ? "titanium" : "carbon" })}
                    className="flex justify-between items-center bg-neutral-900/25 border border-neutral-900 hover:border-emerald-500/40 p-3 rounded-lg cursor-pointer transition-all group"
                  >
                    <span className="text-xs text-neutral-300 font-sans tracking-wide group-hover:text-emerald-400 transition-colors uppercase">
                      {p.title.replace(`${activeSlide.chassis} `, "")}
                    </span>
                    <span className="text-xs font-mono text-emerald-400 font-bold group-hover:scale-105 transition-transform">
                      ${p.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Horizontal Slide Dots Navigation */}
            <div className="flex gap-2 justify-center pt-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    activeIdx === idx ? "w-8 bg-emerald-500" : "w-2.5 bg-neutral-800 hover:bg-neutral-700"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
