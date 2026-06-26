import React, { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion } from "motion/react";

export interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export function Timeline({ data }: { data: TimelineEntry[] }) {
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

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="w-full bg-[#0a0a0b] font-sans md:px-10 border-b border-neutral-900"
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto py-20 px-6 md:px-8 lg:px-10 text-center md:text-left">
        <h2 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-[0.2em] text-white">
          THE <span className="text-[#c0f20c]">BLOODLINE</span>
        </h2>
        <p className="text-neutral-500 font-mono text-[9px] tracking-widest uppercase mt-2">
          Respecting the past. Engineering the future.
        </p>
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-10 md:pt-40 md:gap-10"
          >
            {/* Left Sticky Column (Year/Title) */}
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
        
        {/* Animated Tracker Line */}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-gradient-to-b from-transparent via-neutral-900 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-b from-[#c0f20c] via-[#9cce00] to-transparent from-[0%] via-[10%] rounded-full shadow-[0_0_8px_rgba(192,242,12,0.6)]"
          />
        </div>
      </div>
    </div>
  );
}
