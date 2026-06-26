import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

interface Props { onNavigate: () => void; }

const PANELS = [
  {
    kicker: "THE ORIGIN",
    title: "Built in a Garage.",
    body: "ETi started with one goal: build parts we'd trust on our own cars. No catalog runs. No shortcuts. Just real carbon, made to fit the exact chassis it ships for.",
    stat: { label: "Founded", value: "2022" },
    image: "https://cdn.shopify.com/s/files/1/0842/8362/1657/files/565312703_10161443462990684_2525092078171342042_n.jpg?v=1766319824",
  },
  {
    kicker: "THE PROCESS",
    title: "Refined for the World.",
    body: "From a single Bangkok workshop to a global Manufaktur house for JDM and motorsport. Every piece is bespoke — layered, cured, and finished by hand before it ships.",
    stat: { label: "Production", value: "Bangkok, TH" },
    image: "https://cdn.shopify.com/s/files/1/0842/8362/1657/files/Mask_group_2.png?v=1760683834",
  },
  {
    kicker: "THE STANDARD",
    title: "Made to Order.",
    body: "Lighter than factory. Stronger under load. Built to outlast your build. No mold runs. No off-the-shelf fitment. Every ETi piece is made for your chassis — then yours alone.",
    stat: { label: "Standard", value: "Bespoke · Made to Order" },
    image: "https://cdn.shopify.com/s/files/1/0842/8362/1657/files/Mask_group.png?v=1760445002",
  },
];

export function StoryHorizontalScroll({ onNavigate }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Translate inner track horizontally
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${(PANELS.length - 1) * 100}%`]);

  return (
    <section
      ref={containerRef}
      style={{ height: `${PANELS.length * 100}vh` }}
      className="relative bg-[#07070a] border-b border-neutral-900"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Header overlay */}
        <div className="absolute top-8 left-8 z-20 pointer-events-none">
          <span className="font-mono text-[9px] text-[#c0f20c] tracking-[0.25em] uppercase font-bold">
            004-A — STORY
          </span>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-neutral-600 font-mono text-[8px] uppercase tracking-wider">Drag to explore</p>
            <div className="flex gap-1">
              {PANELS.map((_, i) => (
                <motion.div
                  key={i}
                  className="h-[2px] bg-neutral-700 rounded-full overflow-hidden"
                  style={{ width: 24 }}
                >
                  <motion.div
                    className="h-full bg-[#c0f20c]"
                    style={{
                      scaleX: useTransform(
                        scrollYProgress,
                        [i / PANELS.length, (i + 1) / PANELS.length],
                        [0, 1]
                      ),
                      transformOrigin: "left",
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Horizontal track */}
        <motion.div
          style={{ x }}
          className="flex h-full"
          transition={{ type: "tween" }}
        >
          {PANELS.map((panel, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-screen h-full flex items-center"
            >
              <div className="w-full h-full grid grid-cols-2 max-w-7xl mx-auto px-12 gap-12 items-center">
                {/* Left: image */}
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="relative h-[65vh] rounded-xl overflow-hidden border border-neutral-800"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${panel.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 font-mono text-[7px] text-neutral-500 uppercase tracking-widest">
                    FILE / {idx + 1} / ETI ARCHIVE
                  </div>
                  {/* Neon corner */}
                  <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-[#c0f20c]/50 rounded-tl-xl" />
                </motion.div>

                {/* Right: copy */}
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="space-y-6"
                >
                  <span className="font-mono text-[9px] text-[#c0f20c] tracking-[0.25em] uppercase font-bold">
                    {panel.kicker}
                  </span>
                  <h2 className="text-4xl md:text-6xl font-display font-black uppercase tracking-widest text-white leading-none">
                    {panel.title}
                  </h2>
                  <p className="text-neutral-400 text-sm leading-relaxed max-w-md">
                    {panel.body}
                  </p>
                  <div className="border-l-2 border-[#c0f20c] pl-4">
                    <span className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest">{panel.stat.label}</span>
                    <p className="text-white font-display font-bold text-xl uppercase mt-0.5">{panel.stat.value}</p>
                  </div>
                  {idx === PANELS.length - 1 && (
                    <button
                      onClick={onNavigate}
                      className="mt-4 px-6 py-3 border border-[#c0f20c] text-[#c0f20c] font-mono text-[10px] uppercase tracking-widest hover:bg-[#c0f20c] hover:text-black transition-all duration-300"
                    >
                      Read the Full Story →
                    </button>
                  )}
                </motion.div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
