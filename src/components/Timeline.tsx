import React, { useEffect, useRef, useState } from "react";
import {
  useScroll,
  useTransform,
  motion,
  useSpring,
  useVelocity,
} from "motion/react";

export interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

/* ─────────────────────────────────────────
   Spinning wheel spoke overlay (per wheel)
───────────────────────────────────────── */
function WheelSpoke({
  left,
  top,
  w,
  h,
  rotation,
}: {
  left: number;
  top: number;
  w: number;
  h: number;
  rotation: any;
  key?: any;
}) {
  return (
    <motion.div
      style={{
        position: "absolute",
        left,
        top,
        width: w,
        height: h,
        rotate: rotation,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        style={{ display: "block" }}
      >
        {/* Horizontal spoke */}
        <line
          x1={0}
          y1={h / 2}
          x2={w}
          y2={h / 2}
          stroke="#c0f20c"
          strokeWidth="0.9"
          opacity="0.78"
        />
        {/* Vertical spoke */}
        <line
          x1={w / 2}
          y1={0}
          x2={w / 2}
          y2={h}
          stroke="#c0f20c"
          strokeWidth="0.9"
          opacity="0.78"
        />
        {/* Diagonal 1 */}
        <line
          x1={0}
          y1={0}
          x2={w}
          y2={h}
          stroke="#c0f20c"
          strokeWidth="0.5"
          opacity="0.35"
        />
        {/* Diagonal 2 */}
        <line
          x1={w}
          y1={0}
          x2={0}
          y2={h}
          stroke="#c0f20c"
          strokeWidth="0.5"
          opacity="0.35"
        />
        {/* Hub center */}
        <circle
          cx={w / 2}
          cy={h / 2}
          r={1.4}
          fill="#c0f20c"
          opacity="0.95"
        />
      </svg>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   Top-down JDM sports car
───────────────────────────────────────── */
function TopDownCar({ wheelRotation }: { wheelRotation: any }) {
  // Wheel geometry (matching SVG viewBox 0 0 44 76)
  const wheels = [
    { left: 1, top: 11, w: 9, h: 14 },  // front-left
    { left: 34, top: 11, w: 9, h: 14 }, // front-right
    { left: 1, top: 51, w: 9, h: 14 },  // rear-left
    { left: 34, top: 51, w: 9, h: 14 }, // rear-right
  ];

  return (
    <div style={{ position: "relative", width: 44, height: 76 }}>
      {/* ── Static SVG body ── */}
      <svg
        viewBox="0 0 44 76"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: 44, height: 76, display: "block" }}
      >
        {/* Drop shadow */}
        <ellipse cx="22" cy="38" rx="16" ry="32" fill="rgba(0,0,0,0.5)" />

        {/* Wheel outer rings (static) */}
        <rect x="1"  y="11" width="9" height="14" rx="2.5" fill="#141416" stroke="#2e2e32" strokeWidth="0.8" />
        <rect x="34" y="11" width="9" height="14" rx="2.5" fill="#141416" stroke="#2e2e32" strokeWidth="0.8" />
        <rect x="1"  y="51" width="9" height="14" rx="2.5" fill="#141416" stroke="#2e2e32" strokeWidth="0.8" />
        <rect x="34" y="51" width="9" height="14" rx="2.5" fill="#141416" stroke="#2e2e32" strokeWidth="0.8" />

        {/* Tyre tread lines (outer) */}
        <rect x="1"  y="12.5" width="9" height="1.5" fill="rgba(255,255,255,0.04)" />
        <rect x="1"  y="22.5" width="9" height="1.5" fill="rgba(255,255,255,0.04)" />
        <rect x="34" y="12.5" width="9" height="1.5" fill="rgba(255,255,255,0.04)" />
        <rect x="34" y="22.5" width="9" height="1.5" fill="rgba(255,255,255,0.04)" />
        <rect x="1"  y="52.5" width="9" height="1.5" fill="rgba(255,255,255,0.04)" />
        <rect x="1"  y="62.5" width="9" height="1.5" fill="rgba(255,255,255,0.04)" />
        <rect x="34" y="52.5" width="9" height="1.5" fill="rgba(255,255,255,0.04)" />
        <rect x="34" y="62.5" width="9" height="1.5" fill="rgba(255,255,255,0.04)" />

        {/* ── Main body ── */}
        <path
          d="M10 12 C10 6 14 2 22 2 C30 2 34 6 34 12 L36 62 C36 69 30 74 22 74 C14 74 8 69 8 62 Z"
          fill="#c0f20c"
        />

        {/* Front bumper / splitter */}
        <path d="M13 4 L31 4 L33 9 L11 9 Z" fill="#8dbb00" />
        {/* Rear diffuser */}
        <path d="M13 67 L31 67 L33 72 L11 72 Z" fill="#8dbb00" />

        {/* Hood vents */}
        <rect x="15" y="9"  width="5" height="6" rx="1" fill="#6a9900" opacity="0.8" />
        <rect x="24" y="9"  width="5" height="6" rx="1" fill="#6a9900" opacity="0.8" />

        {/* Cockpit */}
        <ellipse cx="22" cy="32" rx="9" ry="16" fill="#090a0b" opacity="0.9" />
        {/* Windshield glare */}
        <path d="M15 23 Q22 18 29 23 L28 30 Q22 25 16 30 Z" fill="white" opacity="0.06" />

        {/* Center racing stripe */}
        <rect x="21" y="18" width="2" height="32" rx="1" fill="#6a9900" opacity="0.5" />

        {/* Hood crease lines */}
        <line x1="17" y1="9" x2="14" y2="21" stroke="#8dbb00" strokeWidth="0.7" opacity="0.55" />
        <line x1="27" y1="9" x2="30" y2="21" stroke="#8dbb00" strokeWidth="0.7" opacity="0.55" />

        {/* Front headlights */}
        <rect x="12" y="3"  width="7" height="2.5" rx="1.2" fill="white" opacity="0.97" />
        <rect x="25" y="3"  width="7" height="2.5" rx="1.2" fill="white" opacity="0.97" />
        <rect x="13" y="3.5" width="5" height="1.5" rx="0.7" fill="white" opacity="0.45" />
        <rect x="26" y="3.5" width="5" height="1.5" rx="0.7" fill="white" opacity="0.45" />

        {/* Rear taillights */}
        <rect x="12" y="70" width="7" height="2.5" rx="1.2" fill="#ff1111" opacity="0.92" />
        <rect x="25" y="70" width="7" height="2.5" rx="1.2" fill="#ff1111" opacity="0.92" />
      </svg>

      {/* ── Spinning wheel spokes (animated overlays) ── */}
      {wheels.map((wh, i) => (
        <WheelSpoke
          key={i}
          left={wh.left}
          top={wh.top}
          w={wh.w}
          h={wh.h}
          rotation={wheelRotation}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   Race Track — dark neon theme
───────────────────────────────────────── */
const TRACK_WIDTH = 90;
const CURB_W = 10;
const ASPHALT_W = TRACK_WIDTH - CURB_W * 2;

function RaceTrack({
  height,
  milestoneYs,
}: {
  height: number;
  milestoneYs: number[];
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: TRACK_WIDTH,
        height,
        overflow: "hidden",
        borderRadius: 4,
        border: "1px solid rgba(192,242,12,0.1)",
        boxShadow: "0 0 30px rgba(0,0,0,0.6), inset 0 0 16px rgba(0,0,0,0.4)",
      }}
    >
      {/* ── Left kerb (dark, subtle) ── */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: CURB_W,
          height: "100%",
          // Very dark alternating stripes — charcoal, on-theme
          backgroundImage:
            "repeating-linear-gradient(to bottom, #111315 0px, #111315 12px, #0c0d0f 12px, #0c0d0f 24px)",
          borderRight: "1px solid rgba(192,242,12,0.18)",
        }}
      />

      {/* ── Asphalt ── */}
      <div
        style={{
          position: "absolute",
          left: CURB_W,
          width: ASPHALT_W,
          top: 0,
          height: "100%",
          background: "#0d0d0f",
        }}
      >
        {/* Subtle noise texture */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.022) 1px, transparent 1px)",
            backgroundSize: "4px 4px",
          }}
        />

        {/* Left neon edge line */}
        <div
          style={{
            position: "absolute",
            left: 4,
            top: 0,
            width: 1.5,
            height: "100%",
            background: "rgba(192,242,12,0.35)",
          }}
        />

        {/* Dashed center line — neon green to match theme */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            top: 0,
            width: 1.5,
            height: "100%",
            backgroundImage:
              "repeating-linear-gradient(to bottom, rgba(192,242,12,0.28) 0px, rgba(192,242,12,0.28) 12px, transparent 12px, transparent 26px)",
          }}
        />

        {/* Right neon edge line */}
        <div
          style={{
            position: "absolute",
            right: 4,
            top: 0,
            width: 1.5,
            height: "100%",
            background: "rgba(192,242,12,0.35)",
          }}
        />

        {/* Pit-stop / milestone checkered stripes */}
        {milestoneYs.map((y, i) => (
          <React.Fragment key={i}>
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: y - 2,
                height: 4,
                backgroundImage:
                  "repeating-linear-gradient(to right, rgba(192,242,12,0.7) 0px, rgba(192,242,12,0.7) 5px, #000 5px, #000 10px)",
                zIndex: 2,
              }}
            />
            {/* Soft halo around stripe */}
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: y - 8,
                height: 16,
                background:
                  "radial-gradient(ellipse at center, rgba(192,242,12,0.12) 0%, transparent 75%)",
                zIndex: 1,
              }}
            />
          </React.Fragment>
        ))}
      </div>

      {/* ── Right kerb (dark, subtle) ── */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: CURB_W,
          height: "100%",
          backgroundImage:
            "repeating-linear-gradient(to bottom, #111315 0px, #111315 12px, #0c0d0f 12px, #0c0d0f 24px)",
          borderLeft: "1px solid rgba(192,242,12,0.18)",
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────
   Main Timeline export
───────────────────────────────────────── */
export function Timeline({
  data,
  heading,
}: {
  data: TimelineEntry[];
  heading?: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackHeight, setTrackHeight] = useState(0);
  const [milestoneYs, setMilestoneYs] = useState<number[]>([]);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    function measure() {
      if (!trackRef.current) return;
      const trackRect = trackRef.current.getBoundingClientRect();
      setTrackHeight(trackRect.height);
      const trackTop = trackRect.top + window.scrollY;
      const ys = itemRefs.current.map((el) => {
        if (!el) return 0;
        return el.getBoundingClientRect().top + window.scrollY - trackTop;
      });
      setMilestoneYs(ys);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [data]);

  /* ── Scroll progress ── */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  /* ── Raw Y for car ── */
  const rawY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, Math.max(0, trackHeight - 90)]
  );

  /* ── Spring physics: heavy/realistic deceleration ── */
  const springY = useSpring(rawY, {
    stiffness: 55,
    damping: 17,
    mass: 1.4,
  });

  /* ── Wheel rotation (4 full spins across full track height) ── */
  const wheelRotation = useTransform(
    springY,
    [0, Math.max(1, trackHeight - 90)],
    [0, 1440]
  );

  /* ── Velocity-driven effects ── */
  const yVelocity = useVelocity(springY);

  const rawRotate = useTransform(yVelocity, [-2500, 0, 2500], [7, 0, -7]);
  const carRotate = useSpring(rawRotate, { stiffness: 110, damping: 24 });

  const rawX = useTransform(yVelocity, [-2500, 0, 2500], [-5, 0, 5]);
  const carX = useSpring(rawX, { stiffness: 80, damping: 20 });

  const carOpacity = useTransform(scrollYProgress, [0, 0.04], [0, 1]);

  const speedOpacity = useTransform(yVelocity, [0, 300, 2000], [0, 0.2, 0.7]);
  const speedLength = useTransform(yVelocity, [0, 2000], [0, 44]);

  const CAR_LEFT = CURB_W + ASPHALT_W / 2 - 22; // center car on asphalt ≈ 23

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

      <div ref={trackRef} className="relative max-w-7xl mx-auto pb-20">
        {/* Race Track */}
        <RaceTrack height={trackHeight} milestoneYs={milestoneYs} />

        {/* Timeline entries */}
        {data.map((item, index) => (
          <div
            key={index}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            className="flex justify-start pt-10 md:pt-40 md:gap-10"
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              {/* Pit-stop dot */}
              <div
                style={{ left: TRACK_WIDTH / 2 - 20 }}
                className="h-10 absolute w-10 rounded-full bg-[#0a0a0b] border border-[#c0f20c]/40 flex items-center justify-center z-10"
              >
                <div className="h-4 w-4 rounded-full bg-[#0a0a0b] border border-[#c0f20c]/60 p-2 flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#c0f20c] shadow-[0_0_10px_rgba(192,242,12,0.9)]" />
                </div>
              </div>
              <h3 className="hidden md:block text-xl md:pl-28 md:text-5xl font-bold font-display tracking-widest text-neutral-800 uppercase">
                {item.title}
              </h3>
            </div>

            <div className="relative pl-28 pr-6 md:pl-4 w-full">
              <h3 className="md:hidden block text-2xl mb-4 text-left font-bold font-display tracking-widest text-neutral-500 uppercase">
                {item.title}
              </h3>
              {item.content}
            </div>
          </div>
        ))}

        {/* ── Scroll-driven car ── */}
        <motion.div
          style={{
            position: "absolute",
            top: 0,
            left: CAR_LEFT,
            y: springY,
            x: carX,
            rotate: carRotate,
            opacity: carOpacity,
            zIndex: 50,
            pointerEvents: "none",
          }}
        >
          {/* Exhaust speed lines (above car) */}
          <motion.div
            style={{
              position: "absolute",
              bottom: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "5px",
              paddingBottom: 5,
              opacity: speedOpacity,
              alignItems: "flex-end",
            }}
          >
            {[-1, 0, 1].map((offset) => (
              <motion.div
                key={offset}
                style={{
                  width: offset === 0 ? 3 : 2,
                  height: speedLength,
                  background:
                    "linear-gradient(to top, #c0f20c 0%, rgba(192,242,12,0.25) 65%, transparent 100%)",
                  borderRadius: 2,
                  opacity: offset === 0 ? 1 : 0.5,
                }}
              />
            ))}
          </motion.div>

          {/* Car with spinning wheels */}
          <TopDownCar wheelRotation={wheelRotation} />

          {/* Neon underglow */}
          <div
            style={{
              position: "absolute",
              bottom: -6,
              left: "50%",
              transform: "translateX(-50%)",
              width: 38,
              height: 10,
              background:
                "radial-gradient(ellipse, rgba(192,242,12,0.5) 0%, transparent 70%)",
              filter: "blur(5px)",
              borderRadius: "50%",
            }}
          />

          {/* Rear tyre marks */}
          <motion.div
            style={{
              position: "absolute",
              top: "100%",
              left: 5,
              width: 2.5,
              height: speedLength,
              background:
                "linear-gradient(to bottom, rgba(192,242,12,0.2), transparent)",
              borderRadius: 2,
              opacity: speedOpacity,
            }}
          />
          <motion.div
            style={{
              position: "absolute",
              top: "100%",
              right: 5,
              width: 2.5,
              height: speedLength,
              background:
                "linear-gradient(to bottom, rgba(192,242,12,0.2), transparent)",
              borderRadius: 2,
              opacity: speedOpacity,
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
