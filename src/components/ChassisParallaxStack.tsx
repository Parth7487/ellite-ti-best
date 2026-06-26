import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";

interface Product { id: string; title: string; price: number; type: string; }
interface ChassisSlide {
  name: string; chassis: string; heroImage: string; label: string; products: Product[];
}
interface Props {
  slides: ChassisSlide[];
  onNavigate: () => void;
  onAddToCart: (item: { id: string; title: string; price: number; category: string }) => void;
}

export function ChassisParallaxStack({ slides, onNavigate, onAddToCart }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Each card occupies 1/(n+1) of scroll progress
  const n = slides.length;

  return (
    <section
      style={{ height: `${(n + 1) * 100}vh` }}
      className="relative bg-[#08080a] border-b border-neutral-900"
      ref={containerRef}
    >
      {/* Header */}
      <div className="sticky top-0 z-50 pt-12 pb-4 px-8 md:px-16 bg-gradient-to-b from-[#08080a] to-transparent pointer-events-none">
        <span className="font-mono text-[9px] text-[#c0f20c] tracking-[0.25em] uppercase font-bold">
          002-A — CHASSIS STACK
        </span>
        <h2 className="text-2xl md:text-4xl font-display font-bold uppercase tracking-widest text-white mt-2">
          Select Your <span className="text-[#c0f20c]">Chassis</span>
        </h2>
        <p className="text-neutral-500 font-mono text-[9px] uppercase tracking-widest mt-1">
          Scroll to cycle — Parallax stack edition
        </p>
      </div>

      {/* Sticky card stack */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {slides.map((slide, idx) => {
          const start = idx / (n + 1);
          const peak = (idx + 0.5) / (n + 1);
          const end = (idx + 1) / (n + 1);

          // Y: card rises from below → centers → flies up and out
          const rawY = useTransform(scrollYProgress, [start, peak, end], ["60vh", "0vh", "-60vh"]);
          const y = useSpring(rawY, { stiffness: 80, damping: 22 });

          // Scale: grows in, shrinks out
          const scale = useTransform(scrollYProgress, [start, peak, end], [0.88, 1, 0.88]);
          const smoothScale = useSpring(scale, { stiffness: 80, damping: 22 });

          // Opacity
          const opacity = useTransform(scrollYProgress, [start, start + 0.02, end - 0.02, end], [0, 1, 1, 0]);

          // Rotation: slight tilt on enter/exit
          const rotate = useTransform(scrollYProgress, [start, peak, end], [-2, 0, 2]);

          return (
            <motion.div
              key={slide.chassis}
              style={{ y, scale: smoothScale, opacity, rotate, zIndex: idx }}
              className="absolute w-full max-w-5xl mx-auto px-4"
            >
              <div
                className="relative rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950 cursor-pointer group"
                style={{ aspectRatio: "16/7" }}
                onClick={onNavigate}
              >
                {/* Hero image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${slide.heroImage})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-12">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-[8px] text-[#c0f20c] tracking-widest uppercase">
                        {slide.label}
                      </span>
                      <h3 className="text-3xl md:text-5xl font-display font-black uppercase text-white tracking-widest mt-1">
                        {slide.name}
                      </h3>
                      <p className="text-neutral-400 text-xs font-mono uppercase tracking-wider mt-1">
                        {slide.chassis} · BESPOKE CARBON
                      </p>
                    </div>
                    <div className="font-mono text-[8px] text-neutral-500 text-right">
                      <div>{String(idx + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}</div>
                    </div>
                  </div>

                  {/* Product chips */}
                  <div className="flex flex-wrap gap-2">
                    {slide.products.slice(0, 4).map((p) => (
                      <button
                        key={p.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart({ id: p.id, title: p.title, price: p.price, category: p.type === "tier3" ? "titanium" : "carbon" });
                        }}
                        className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider border border-neutral-700 bg-black/60 text-neutral-300 hover:border-[#c0f20c] hover:text-[#c0f20c] transition-all duration-200 rounded"
                      >
                        {p.title} <span className="text-[#c0f20c] ml-1">${p.price}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Neon corner accent */}
                <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-[#c0f20c] opacity-60 rounded-tl-xl" />
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-[#c0f20c] opacity-60 rounded-br-xl" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
