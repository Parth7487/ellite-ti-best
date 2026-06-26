import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import gsap from "gsap";

interface Product { id: string; title: string; price: number; type: string; }
interface ChassisSlide {
  name: string; chassis: string; heroImage: string; label: string; products: Product[];
}
interface Props {
  slides: ChassisSlide[];
  onNavigate: () => void;
  onAddToCart: (item: { id: string; title: string; price: number; category: string }) => void;
}

export function ChassisMagneticGrid({ slides, onNavigate, onAddToCart }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scanRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    cardRefs.current.forEach((card, i) => {
      if (!card) return;

      const xTo = gsap.quickTo(card, "rotateY", { duration: 0.4, ease: "power2.out" });
      const yTo = gsap.quickTo(card, "rotateX", { duration: 0.4, ease: "power2.out" });

      const onMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        xTo(dx * 12);
        yTo(-dy * 8);
      };

      const onLeave = () => {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: "elastic.out(1,0.4)" });
      };

      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
      return () => {
        card.removeEventListener("mousemove", onMove);
        card.removeEventListener("mouseleave", onLeave);
      };
    });
  }, [slides.length]);

  // Scan line animation on hover
  useEffect(() => {
    scanRefs.current.forEach((scan, i) => {
      if (!scan || hovered !== i) return;
      gsap.fromTo(scan,
        { y: "-100%", opacity: 1 },
        { y: "200%", duration: 0.9, ease: "none", repeat: -1 }
      );
      return () => { gsap.killTweensOf(scan); };
    });
  }, [hovered]);

  return (
    <section className="py-24 bg-[#06060a] border-b border-neutral-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="mb-12">
          <span className="font-mono text-[9px] text-[#c0f20c] tracking-[0.25em] uppercase font-bold">
            002-B — CHASSIS GRID
          </span>
          <h2 className="text-2xl md:text-4xl font-display font-black uppercase tracking-widest text-white mt-2">
            Magnetic <span className="text-[#c0f20c]">Selection</span>
          </h2>
          <p className="text-neutral-500 font-mono text-[9px] uppercase tracking-widest mt-1">
            Hover to lock on — GSAP magnetic tilt
          </p>
        </div>

        {/* Grid */}
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${Math.min(slides.length, 3)}, 1fr)`, perspective: "1200px" }}
        >
          {slides.map((slide, idx) => (
            <div
              key={slide.chassis}
              ref={(el) => { cardRefs.current[idx] = el; }}
              style={{ transformStyle: "preserve-3d" }}
              className="relative cursor-pointer group"
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
              onClick={onNavigate}
            >
              {/* Card */}
              <div className="relative overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950" style={{ aspectRatio: "3/4" }}>
                {/* Background image with clip-path wipe on hover */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-700"
                  style={{
                    backgroundImage: `url(${slide.heroImage})`,
                    clipPath: hovered === idx ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
                    transition: "clip-path 0.6s cubic-bezier(0.77,0,0.175,1)",
                  }}
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20 group-hover:from-black/90 transition-all duration-500" />

                {/* Scan line */}
                <div
                  ref={(el) => { scanRefs.current[idx] = el; }}
                  className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c0f20c] to-transparent opacity-0 group-hover:opacity-100 pointer-events-none"
                  style={{ top: 0, zIndex: 10 }}
                />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-between p-6">
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-[8px] text-[#c0f20c] tracking-widest uppercase border border-[#c0f20c]/30 px-2 py-0.5 rounded">
                      {slide.label}
                    </span>
                    <span className="font-mono text-[8px] text-neutral-600">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div>
                    <p className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest mb-1">{slide.chassis}</p>
                    <h3 className="text-2xl font-display font-black uppercase text-white tracking-widest leading-none mb-4">
                      {slide.name}
                    </h3>

                    {/* Product list reveals on hover */}
                    <AnimatePresence>
                      {hovered === idx && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.25 }}
                          className="space-y-1"
                        >
                          {slide.products.slice(0, 3).map((p) => (
                            <div
                              key={p.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                onAddToCart({ id: p.id, title: p.title, price: p.price, category: p.type === "tier3" ? "titanium" : "carbon" });
                              }}
                              className="flex items-center justify-between text-[9px] font-mono text-neutral-400 hover:text-[#c0f20c] transition-colors cursor-pointer group/p"
                            >
                              <span className="group-hover/p:translate-x-1 transition-transform">{p.title}</span>
                              <span className="text-[#c0f20c]">${p.price}</span>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Corner neon brackets */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#c0f20c]/40 rounded-tl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[#c0f20c]/40 rounded-br-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={onNavigate}
            className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 hover:text-[#c0f20c] transition-colors border-b border-neutral-700 hover:border-[#c0f20c] pb-0.5"
          >
            View Full Catalog →
          </button>
        </div>
      </div>
    </section>
  );
}
