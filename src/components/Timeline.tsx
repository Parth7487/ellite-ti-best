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
   Top-down JDM sports car SVG
───────────────────────────────────────── */
function TopDownCar() {
  return (
    <svg
      viewBox="0 0 44 76"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: 44, height: "auto", display: "block" }}
    >
      {/* Drop shadow under body */}
      <ellipse cx="22" cy="38" rx="16" ry="32" fill="rgba(0,0,0,0.45)" />

      {/* Main body */}
      <path
        d="M10 12 C10 6 14 2 22 2 C30 2 34 6 34 12 L36 62 C36 69 30 74 22 74 C14 74 8 69 8 62 Z"
        fill="#c0f20c"
      />

      {/* Front bumper / splitter */}
      <path d="M13 4 L31 4 L33 9 L11 9 Z" fill="#9dcc00" />
      {/* Rear diffuser */}
      <path d="M13 67 L31 67 L33 72 L11 72 Z" fill="#9dcc00" />

      {/* Hood vents */}
      <rect x="16" y="9" width="4" height="6" rx="1" fill="#7ab000" opacity="0.7" />
      <rect x="24" y="9" width="4" height="6" rx="1" fill="#7ab000" opacity="0.7" />

      {/* Cockpit / windshield */}
      <ellipse cx="22" cy="32" rx="9" ry="16" fill="#0a0a0b" opacity="0.88" />
      {/* Windshield glare */}
      <path d="M15 23 Q22 18 29 23 L28 30 Q22 25 16 30 Z" fill="white" opacity="0.07" />

      {/* Center racing stripe */}
      <rect x="21" y="18" width="2" height="32" rx="1" fill="#7ab000" opacity="0.45" />

      {/* Hood crease lines */}
      <line x1="17" y1="9" x2="14" y2="21" stroke="#8ab000" strokeWidth="0.7" opacity="0.5" />
      <line x1="27" y1="9" x2="30" y2="21" stroke="#8ab000" strokeWidth="0.7" opacity="0.5" />

      {/* Front headlights */}
      <rect x="12" y="3" width="7" height="2.5" rx="1.2" fill="white" opacity="0.97" />
      <rect x="25" y="3" width="7" height="2.5" rx="1.2" fill="white" opacity="0.97" />
      {/* Headlight inner glow */}
      <rect x="13" y="3.5" width="5" height="1.5" rx="0.7" fill="white" opacity="0.5" />
      <rect x="26" y="3.5" width="5" height="1.5" rx="0.7" fill="white" opacity="0.5" />

      {/* Rear taillights */}
      <rect x="12" y="70" width="7" height="2.5" rx="1.2" fill="#ff1111" opacity="0.95" />
      <rect x="25" y="70" width="7" height="2.5" rx="1.2" fill="#ff1111" opacity="0.95" />

      {/* ── Wheels ── */}
      {/* Front-left */}
      <rect x="1" y="11" width="9" height="14" rx="2.5" fill="#1a1a1a" stroke="#383838" strokeWidth="0.7" />
      <rect x="3" y="13" width="5" height="10" rx="1.2" fill="#252525" />
      <circle cx="5.5" cy="18" r="1.5" fill="#3a3a3a" />
      {/* Front-right */}
      <rect x="34" y="11" width="9" height="14" rx="2.5" fill="#1a1a1a" stroke="#383838" strokeWidth="0.7" />
      <rect x="36" y="13" width="5" height="10" rx="1.2" fill="#252525" />
      <circle cx="38.5" cy="18" r="1.5" fill="#3a3a3a" />
      {/* Rear-left */}
      <rect x="1" y="51" width="9" height="14" rx="2.5" fill="#1a1a1a" stroke="#383838" strokeWidth="0.7" />
      <rect x="3" y="53" width="5" height="10" rx="1.2" fill="#252525" />
      <circle cx="5.5" cy="58" r="1.5" fill="#3a3a3a" />
      {/* Rear-right */}
      <rect x="34" y="51" width="9" height="14" rx="2.5" fill="#1a1a1a" stroke="#383838" strokeWidth="0.7" />
      <rect x="36" y="53" width="5" height="10" rx="1.2" fill="#252525" />
      <circle cx="38.5" cy="58" r="1.5" fill="#3a3a3a" />
    </svg>
  );
}

/* ─────────────────────────────────────────
   Vertical race track (top-down view)
───────────────────────────────────────── */
const TRACK_WIDTH = 90;
const CURB_W = 11;
const ASPHALT_W = TRACK_WIDTH - CURB_W * 2;

function RaceTrack({
  height,
  milestoneYs,
}: {
  height: number;
  milestoneYs: number[];
}) {
  const curbH = 20;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: TRACK_WIDTH,
        height,
        overflow: "hidden",
        borderRadius: 6,
        // subtle outer glow
        boxShadow: "0 0 40px rgba(0,0,0,0.8)",
      }}
    >
      {/* ── Left kerb ── */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: CURB_W,
          height: "100%",
          backgroundImage: `repeating-linear-gradient(
            to bottom,
            #c91c00 0px, #c91c00 ${curbH / 2}px,
            #f2f2f2 ${curbH / 2}px, #f2f2f2 ${curbH}px
          )`,
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
          background: "#161719",
        }}
      >
        {/* Asphalt texture */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.028) 1px, transparent 1px)",
            backgroundSize: "5px 5px",
          }}
        />
        {/* Fine tarmac grain */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "repeating-linear-gradient(90deg, transparent 0px, transparent 3px, rgba(255,255,255,0.012) 3px, rgba(255,255,255,0.012) 4px)",
          }}
        />

        {/* Left white edge line */}
        <div
          style={{
            position: "absolute",
            left: 5,
            top: 0,
            width: 2,
            height: "100%",
            background: "rgba(255,255,255,0.52)",
          }}
        />

        {/* Dashed center line */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            top: 0,
            width: 2,
            height: "100%",
            backgroundImage:
              "repeating-linear-gradient(to bottom, rgba(255,255,255,0.38) 0px, rgba(255,255,255,0.38) 14px, transparent 14px, transparent 30px)",
          }}
        />

        {/* Right white edge line */}
        <div
          style={{
            position: "absolute",
            right: 5,
            top: 0,
            width: 2,
            height: "100%",
            background: "rgba(255,255,255,0.52)",
          }}
        />

        {/* ── Pit-stop / milestone markers (checkered stripe) ── */}
        {milestoneYs.map((y, i) => (
          <React.Fragment key={i}>
            {/* Checkered flag stripe */}
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: y - 2,
                height: 4,
                backgroundImage:
                  "repeating-linear-gradient(to right, #c0f20c 0px, #c0f20c 5px, #000 5px, #000 10px)",
                opacity: 0.75,
                zIndex: 2,
              }}
            />
            {/* Neon halo on the stripe */}
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: y - 6,
                height: 12,
                background:
                  "radial-gradient(ellipse at center, rgba(192,242,12,0.18) 0%, transparent 70%)",
                zIndex: 1,
              }}
            />
          </React.Fragment>
        ))}
      </div>

      {/* ── Right kerb ── */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: CURB_W,
          height: "100%",
          backgroundImage: `repeating-linear-gradient(
            to bottom,
            #c91c00 0px, #c91c00 ${curbH / 2}px,
            #f2f2f2 ${curbH / 2}px, #f2f2f2 ${curbH}px
          )`,
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
      setTrackHeight(trackRef.current.getBoundingClientRect().height);
      const trackTop = trackRef.current.getBoundingClientRect().top + window.scrollY;
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

  /* ── Raw Y position for the car ── */
  const rawY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, Math.max(0, trackHeight - 90)]
  );

  /* ── Spring physics: mass/damping = realistic deceleration ── */
  const springY = useSpring(rawY, {
    stiffness: 55,
    damping: 17,
    mass: 1.4,
  });

  /* ── Velocity → lateral drift + yaw rotation ── */
  const yVelocity = useVelocity(springY);

  // Yaw (car steers slightly when fast)
  const rawRotate = useTransform(yVelocity, [-2500, 0, 2500], [7, 0, -7]);
  const carRotate = useSpring(rawRotate, { stiffness: 110, damping: 24 });

  // Lateral drift (car moves side-to-side as it steers)
  const rawX = useTransform(yVelocity, [-2500, 0, 2500], [-6, 0, 6]);
  const carX = useSpring(rawX, { stiffness: 80, damping: 20 });

  // Fade in
  const carOpacity = useTransform(scrollYProgress, [0, 0.04], [0, 1]);

  // Speed lines intensity
  const speedOpacity = useTransform(yVelocity, [0, 400, 2000], [0, 0.25, 0.75]);
  const speedLength = useTransform(yVelocity, [0, 2000], [0, 40]);

  // Car X centered on track: track center = CURB_W + ASPHALT_W/2 = 11 + 34 = 45, car half-width = 22
  const CAR_LEFT = CURB_W + ASPHALT_W / 2 - 22; // ≈ 23

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
        {/* ── Race Track ── */}
        <RaceTrack height={trackHeight} milestoneYs={milestoneYs} />

        {/* ── Timeline entries ── */}
        {data.map((item, index) => (
          <div
            key={index}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            className="flex justify-start pt-10 md:pt-40 md:gap-10"
          >
            {/* Left sticky label */}
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              {/* Pit-stop indicator dot centered on track */}
              <div
                style={{ left: TRACK_WIDTH / 2 - 20 }}
                className="h-10 absolute w-10 rounded-full bg-black border border-[#c0f20c]/40 flex items-center justify-center z-10"
              >
                <div className="h-4 w-4 rounded-full bg-[#0a0a0b] border border-[#c0f20c]/60 p-2 flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#c0f20c] shadow-[0_0_10px_rgba(192,242,12,0.9)]" />
                </div>
              </div>
              <h3 className="hidden md:block text-xl md:pl-28 md:text-5xl font-bold font-display tracking-widest text-neutral-800 uppercase">
                {item.title}
              </h3>
            </div>

            {/* Right content */}
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
          {/* Speed exhaust lines above car */}
          <motion.div
            style={{
              position: "absolute",
              bottom: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "5px",
              paddingBottom: 6,
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
                    "linear-gradient(to top, #c0f20c 0%, rgba(192,242,12,0.3) 60%, transparent 100%)",
                  borderRadius: 2,
                  opacity: offset === 0 ? 1 : 0.55,
                }}
              />
            ))}
          </motion.div>

          {/* Car SVG */}
          <TopDownCar />

          {/* Neon underglow */}
          <div
            style={{
              position: "absolute",
              bottom: -6,
              left: "50%",
              transform: "translateX(-50%)",
              width: 36,
              height: 10,
              background:
                "radial-gradient(ellipse at center, rgba(192,242,12,0.55) 0%, transparent 70%)",
              borderRadius: "50%",
              filter: "blur(4px)",
            }}
          />

          {/* Tire track marks left on asphalt */}
          <motion.div
            style={{
              position: "absolute",
              top: "100%",
              left: 4,
              width: 3,
              height: speedLength,
              background:
                "linear-gradient(to bottom, rgba(192,242,12,0.25) 0%, transparent 100%)",
              borderRadius: 2,
              opacity: speedOpacity,
            }}
          />
          <motion.div
            style={{
              position: "absolute",
              top: "100%",
              right: 4,
              width: 3,
              height: speedLength,
              background:
                "linear-gradient(to bottom, rgba(192,242,12,0.25) 0%, transparent 100%)",
              borderRadius: 2,
              opacity: speedOpacity,
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
