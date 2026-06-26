import React from "react";
import { motion } from "motion/react";

interface Props {
  onNavigate: () => void;
}

export default function MotorsportsBanner({ onNavigate }: Props) {
  // Use a reliable looping motorsport video or a dark high-quality fallback image
  const videoUrl = "https://assets.mixkit.co/videos/preview/mixkit-race-car-driving-fast-on-a-track-34351-large.mp4";
  const fallbackImage = "https://cdn.shopify.com/s/files/1/0842/8362/1657/files/Mask_group_2.png?v=1760683834";

  return (
    <section className="relative w-full h-[70vh] min-h-[500px] bg-neutral-950 flex flex-col justify-between overflow-hidden border-t border-neutral-950">
      
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          poster={fallbackImage}
          className="w-full h-full object-cover opacity-35 filter brightness-75 contrast-125"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
        {/* Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-neutral-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-transparent to-neutral-950" />
      </div>

      {/* Alternative Indicator Tag */}
      <div className="relative z-10 p-6 self-start">
        <span className="text-[10px] tracking-[0.2em] font-mono text-emerald-500 uppercase px-2 py-0.5 border border-emerald-500/30 bg-emerald-500/10 rounded">
          Alternative Layout 005-B: Video Banner
        </span>
      </div>

      {/* Text Content Overlay */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center my-auto space-y-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15
              }
            }
          }}
          className="space-y-4"
        >
          <motion.h2 
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
            }}
            className="text-4xl md:text-6xl font-bold tracking-tight uppercase text-white"
          >
            Track Proven Armor.
          </motion.h2>

          <motion.p 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
            }}
            className="text-sm md:text-base text-neutral-300 max-w-xl mx-auto leading-relaxed font-light font-sans"
          >
            From high-speed downforce stability to lightweight titanium exhaust cooling, every ETi component is refined on racetracks, where tolerances are measured in fractions of a millimeter.
          </motion.p>

          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.95 },
              visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
            }}
            className="pt-2"
          >
            <button 
              onClick={onNavigate}
              className="bg-white hover:bg-neutral-200 text-black font-semibold text-xs tracking-wider uppercase px-8 py-3.5 transition-all duration-300 rounded shadow-lg hover:shadow-white/10"
            >
              Explore the Program
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Infinite Marquee Ticker */}
      <div className="relative z-10 w-full bg-emerald-500/10 border-y border-emerald-500/20 py-2.5 overflow-hidden">
        <div className="flex w-max animate-marquee">
          <div className="flex gap-16 text-[10px] font-mono tracking-[0.25em] text-emerald-400 uppercase select-none whitespace-nowrap">
            <span>Time Attack</span>
            <span>&middot;</span>
            <span>Drift Program</span>
            <span>&middot;</span>
            <span>Circuit Weapons</span>
            <span>&middot;</span>
            <span>Titanium Fabrication</span>
            <span>&middot;</span>
            <span>Bespoke Fitment</span>
            <span>&middot;</span>
            <span>Time Attack</span>
            <span>&middot;</span>
            <span>Drift Program</span>
            <span>&middot;</span>
            <span>Circuit Weapons</span>
            <span>&middot;</span>
            <span>Titanium Fabrication</span>
            <span>&middot;</span>
            <span>Bespoke Fitment</span>
          </div>
        </div>
      </div>

      {/* Styles for Infinite Marquee loop */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
      `}</style>

    </section>
  );
}
