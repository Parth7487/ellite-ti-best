import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface StorySection {
  title: string;
  body: string;
  image: string;
  label: string;
}

const SECTIONS: StorySection[] = [
  {
    title: "01 / The Garage Origin",
    body: "ETi started in a private garage with a single focus: creating components we would trust on our own track builds. That pure, uncompromising mindset is what scaled into a global carbon and titanium brand.",
    image: "https://cdn.shopify.com/s/files/1/0842/8362/1657/files/565312703_10161443462990684_2525092078171342042_n.jpg?v=1766319824",
    label: "FILE / 2022-04 / THE INITIAL BENCH"
  },
  {
    title: "02 / Bangkok Production",
    body: "Now operating a state-of-the-art facility in Bangkok, Thailand, we pair advanced autoclave curing with skilled hand-finishing. We build every carbon fiber weave to endure the extreme heat and stress of professional motorsports.",
    image: "https://cdn.shopify.com/s/files/1/0842/8362/1657/files/Mask_group_2.png?v=1760683834",
    label: "FILE / 2026 / CIRCUIT PROGRAM DEVELOPMENT"
  },
  {
    title: "03 / Bespoke Made to Order",
    body: "We do not believe in mass catalog production. Every single carbon part is layed, cured, and clear-coated to order for your specific chassis, ensuring a vacuum-sealed, flush fitment down to 0.5mm.",
    image: "https://cdn.shopify.com/s/files/1/0842/8362/1657/files/Mask_group.png?v=1760445002",
    label: "FILE / 2026 / FINISHED WEAVE CHECK"
  }
];

export default function StorySplitReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const height = rect.height;
      const scrollProgress = -rect.top / (height - window.innerHeight);
      const clamped = Math.max(0, Math.min(0.99, scrollProgress));
      const index = Math.floor(clamped * SECTIONS.length);
      setActiveIndex(index);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full bg-black border-t border-neutral-900"
      style={{ minHeight: "300vh" }}
    >
      {/* Container header for alternative version */}
      <div className="absolute top-8 left-8 z-20 flex items-center gap-4">
        <span className="text-[10px] tracking-[0.2em] font-mono text-emerald-500 uppercase px-2 py-0.5 border border-emerald-500/30 bg-emerald-500/10 rounded">
          Alternative Layout 004-B: Split Reveal
        </span>
      </div>

      <div className="sticky top-0 left-0 w-full h-screen flex flex-col md:flex-row overflow-hidden">
        {/* Left Half: Sticky Image Gallery */}
        <div className="relative w-full md:w-1/2 h-1/2 md:h-full bg-neutral-950 flex flex-col justify-end p-8 border-r border-neutral-900/50">
          <div className="absolute inset-0 z-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url('${SECTIONS[activeIndex].image}')` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/20" />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative z-10 font-mono text-[10px] text-neutral-400 tracking-wider">
            <AnimatePresence mode="wait">
              <motion.span
                key={activeIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                {SECTIONS[activeIndex].label}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        {/* Right Half: Scrolling Content Blocks */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full overflow-y-auto hide-scrollbar md:snap-y md:snap-mandatory">
          {SECTIONS.map((sec, idx) => {
            const isActive = activeIndex === idx;
            return (
              <div 
                key={idx}
                className="w-full h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 snap-start py-12"
              >
                <motion.div
                  animate={{ opacity: isActive ? 1 : 0.25, x: isActive ? 0 : -10 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6 max-w-lg"
                >
                  <span className="text-xs font-mono text-emerald-500 tracking-[0.2em] uppercase">
                    {sec.title}
                  </span>
                  
                  <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-white uppercase font-sans">
                    {sec.title.split("/ ")[1]}
                  </h3>
                  
                  <p className="text-sm text-neutral-300 leading-relaxed font-sans font-light">
                    {sec.body}
                  </p>
                  
                  {isActive && (
                    <motion.div 
                      layoutId="split-line"
                      className="h-[2px] bg-emerald-500 w-16"
                      transition={{ type: "spring", stiffness: 100, damping: 15 }}
                    />
                  )}
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
