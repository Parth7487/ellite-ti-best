import React, { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion } from "motion/react";

export interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

// Side-view JDM sports car SVG silhouette — faces right (driving forward/down)
function CarSVG() {
  return (
    <svg
      viewBox="0 0 80 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-12 h-auto"
    >
      {/* Body shell */}
      <path
        d="M5 22 C5 22 10 12 20 10 L35 7 C41 6 47 6 53 9 L70 15 C75 17 77 20 77 22 L77 24 L5 24 Z"
        fill="#c0f20c"
      />
      {/* Cabin */}
      <path
        d="M22 10 C25 5 31 2.5 39 2.5 C47 2.5 52 5 54 10 Z"
        fill="#0d0d0e"
      />
      {/* Windshield tint */}
      <path
        d="M24 10 L27 4 L38 3.5 L38 10 Z"
        fill="#c0f20c"
        opacity="0.2"
      />
      {/* Rear window tint */}
      <path
        d="M40 10 L40 3.7 L52 9 L52 10 Z"
        fill="#c0f20c"
        opacity="0.2"
      />
      {/* Headlight */}
      <rect x="73" y="17" width="4" height="2.5" rx="1.2" fill="#ffffff" opacity="0.95" />
      {/* Head-light glow */}
      <rect x="77" y="17" width="6" height="2.5" rx="1" fill="#fff" opacity="0.25" />
      {/* Taillight */}
      <rect x="2" y="17" width="4" height="2.5" rx="1.2" fill="#c0f20c" opacity="0.9" />
      {/* Front splitter */}
      <rect x="73" y="23" width="5" height="1.5" rx="0.7" fill="#c0f20c" opacity="0.5" />
      {/* Rear diffuser */}
      <rect x="2" y="23" width="5" height="1.5" rx="0.7" fill="#c0f20c" opacity="0.4" />
      {/* Front wheel */}
      <circle cx="60" cy="25" r="6.5" fill="#111" stroke="#c0f20c" strokeWidth="1.8" />
      <circle cx="60" cy="25" r="2.5" fill="#c0f20c" opacity="0.45" />
      {/* Rear wheel */}
      <circle cx="20" cy="25" r="6.5" fill="#111" stroke="#c0f20c" strokeWidth="1.8" />
      <circle cx="20" cy="25" r="2.5" fill="#c0f20c" opacity="0.45" />
      {/* Ground glow */}
      <ellipse cx="40" cy="32" rx="30" ry="2" fill="#c0f20c" opacity="0.07" />
    </svg>
  );
}

export function Timeline({
  data,
  heading,
}: {
  data: TimelineEntry[];
  heading?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  // Car travels top → bottom of the track
  const carY = useTransform(scrollYProgress, [0, 1], [0, height - 48]);
  const carOpacity = useTransform(scrollYProgress, [0, 0.04], [0, 1]);

  return (
    <div
      className="w-full bg-[#0a0a0b] font-sans md:px-10 border-b border-neutral-900"
      ref={containerRef}
    >
      {/* Heading slot */}
      {heading ? (
        heading
      ) : (
        <div className="max-w-7xl mx-auto py-20 px-6 md:px-8 lg:px-10 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-[0.2em] text-white">
            THE <span className="text-[#c0f20c]">BLOODLINE</span>
          </h2>
          <p className="text-neutral-500 font-mono text-[9px] tracking-widest uppercase mt-2">
            Respecting the past. Engineering the future.
          </p>
        </div>
      )}

      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-10 md:pt-40 md:gap-10"
          >
            {/* Left Sticky Column */}
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-black border border-neutral-900 flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-[#0a0a0b] border border-neutral-800 p-2 flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#c0f20c] shadow-[0_0_8px_rgba(192,242,12,0.8)]" />
                </div>
              </div>
              <h3 className="hidden md:block text-xl md:pl-20 md:text-5xl font-bold font-display tracking-widest text-neutral-800 uppercase">
                {item.title}
              </h3>
            </div>

            {/* Right Content Column */}
            <div className="relative pl-20 pr-6 md:pl-4 w-full">
              <h3 className="md:hidden block text-2xl mb-4 text-left font-bold font-display tracking-widest text-neutral-500 uppercase">
                {item.title}
              </h3>
              {item.content}
            </div>
          </div>
        ))}

        {/* Static track line */}
        <div
          style={{ height: height + "px" }}
          className="absolute md:left-8 left-8 top-0 w-[2px] bg-gradient-to-b from-transparent via-neutral-800/50 to-transparent [mask-image:linear-gradient(to_bottom,transparent_0%,black_8%,black_92%,transparent_100%)]"
        />

        {/* Scroll-driven car riding the track */}
        <motion.div
          style={{
            y: carY,
            opacity: carOpacity,
            // center the 48px-wide car on the 2px track at left-8 (32px)
            // left: 32px - (48px / 2) + 1px = 9px
            position: "absolute",
            top: 0,
            left: "9px",
            zIndex: 50,
            pointerEvents: "none",
          }}
        >
          <CarSVG />
          {/* neon speed trail behind the car (to the left since car faces right) */}
          <div
            style={{
              position: "absolute",
              top: "21px",
              right: "100%",
              width: "40px",
              height: "2px",
              background: "linear-gradient(to left, #c0f20c, transparent)",
              opacity: 0.55,
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
