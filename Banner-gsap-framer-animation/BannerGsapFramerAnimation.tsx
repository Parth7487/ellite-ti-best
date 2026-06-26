import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Play, Pause, Compass, Layers, ChevronLeft, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Chapter {
  startFrame: number;
  endFrame: number;
  title: string;
  subtitle: string;
  tag: string;
}

const chapters: Chapter[] = [
  {
    startFrame: 1,
    endFrame: 82,
    title: "Carbon. Titanium. Precision.",
    subtitle: "Aerospace-grade composites and bespoke titanium hardware, built for JDM and time attack.",
    tag: "001 // ELITE PERFORMANCE"
  },
  {
    startFrame: 83,
    endFrame: 124,
    title: "Lightweight Architecture",
    subtitle: "Custom CNC-machined titanium components designed to shave precious seconds off your lap times.",
    tag: "002 // TITANIUM DIVISION"
  },
  {
    startFrame: 125,
    endFrame: 169,
    title: "Aerodynamic Superiority",
    subtitle: "Bespoke dry carbon fiber elements built for maximum downforce and structural rigidity.",
    tag: "003 // CARBON MANUFAKTUR"
  },
  {
    startFrame: 170,
    endFrame: 240,
    title: "The Ultimate Spec",
    subtitle: "Uncompromising styling and race-proven engineering. Lighter, stronger, faster.",
    tag: "004 // COMPETITION LINE"
  }
];

export const BannerGsapFramerAnimation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  
  const steps = [1, 83, 125, 170, 240];
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [mode, setMode] = useState<'scroll' | 'click'>('click');
  const [isPlaying, setIsPlaying] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });
  const autoplayTimeline = useRef<gsap.core.Tween | null>(null);

  // Resize canvas handler & initial dimension setup
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight - 76
      });
    };

    window.addEventListener('resize', handleResize);
    // Initial size
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;
    const totalFrames = 240;

    // 1. Populate imagesRef immediately with empty Image elements so that individual frames
    // can be rendered on canvas as soon as they finish loading, instead of waiting for all 240.
    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const paddedIndex = String(i).padStart(3, '0');
      img.src = `/Banner-gsap-framer-animation/frames/frame_${paddedIndex}.webp`;
      loadedImages.push(img);
    }
    imagesRef.current = loadedImages;

    let hasFadedOut = false;

    // 2. Set up event handlers to track load progress
    loadedImages.forEach((img, index) => {
      const handleImageLoad = () => {
        loadedCount++;
        const progress = Math.round((loadedCount / totalFrames) * 100);

        // Draw first frame immediately when it loads so it's not a black screen
        if (index === 0) {
          drawFrame(1);
        }

        // Throttle progress state updates (only update on multiples of 5 or at 100)
        // to avoid 240 consecutive React renders which lag the UI significantly
        if (progress % 5 === 0 || progress === 100) {
          setLoadProgress(progress);
        }

        // 3. Fade out the loading screen early once 25% (60 frames) are loaded.
        // The remaining frames will finish loading in the background over localhost in a split second.
        if ((progress >= 25 || loadedCount === totalFrames) && !hasFadedOut) {
          hasFadedOut = true;
          setIsLoading(false);
          setTimeout(() => {
            ScrollTrigger.refresh();
          }, 150);
        }
      };

      img.onload = handleImageLoad;
      img.onerror = handleImageLoad; // Continue even if some frames fail to load
    });
  }, []);

  // Drawing Canvas Frames
  const drawFrame = (frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas || imagesRef.current.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Use modulo/clamping to ensure index is safe
    const safeIndex = Math.max(0, Math.min(frameIndex - 1, imagesRef.current.length - 1));
    const img = imagesRef.current[safeIndex];

    if (img && img.complete) {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Calculate aspect ratio cover positioning
      const imgRatio = img.width / img.height;
      const canvasRatio = canvas.width / canvas.height;
      let drawWidth = canvas.width;
      let drawHeight = canvas.height;
      let offsetX = 0;
      let offsetY = 0;

      if (imgRatio > canvasRatio) {
        drawWidth = canvas.height * imgRatio;
        offsetX = (canvas.width - drawWidth) / 2;
      } else {
        drawHeight = canvas.width / imgRatio;
        offsetY = (canvas.height - drawHeight) / 2;
      }

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }
  };

  // Initial draw & redraw when dimensions change
  useEffect(() => {
    if (!isLoading && imagesRef.current.length > 0) {
      drawFrame(currentFrame);
    }
  }, [isLoading, dimensions, currentFrame]);

  // Scroll Trigger Setup
  useEffect(() => {
    if (isLoading || mode !== 'scroll' || imagesRef.current.length === 0) return;

    const frameObj = { frame: 1 };
    
    // Clear any active autoplay states
    if (autoplayTimeline.current) {
      autoplayTimeline.current.kill();
      setIsPlaying(false);
    }

    const scrollTween = gsap.to(frameObj, {
      frame: 240,
      snap: 'frame',
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 76px',
        end: '+=400%', // Scrub speed scroll duration
        scrub: 0.5,
        pin: true,
        onUpdate: (self) => {
          const current = Math.floor(frameObj.frame);
          setCurrentFrame(current);
          drawFrame(current);

          // Find closest step index to hide/show buttons on scroll
          let closestIdx = 0;
          let minDiff = Infinity;
          steps.forEach((step, idx) => {
            const diff = Math.abs(current - step);
            if (diff < minDiff) {
              minDiff = diff;
              closestIdx = idx;
            }
          });
          setActiveStepIndex(closestIdx);
        }
      }
    });

    return () => {
      scrollTween.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [isLoading, mode]);

  // Toggle triggering modes
  const toggleMode = () => {
    if (mode === 'scroll') {
      setMode('click');
    } else {
      // Clean up play states
      if (autoplayTimeline.current) {
        autoplayTimeline.current.kill();
      }
      setIsPlaying(false);
      setMode('scroll');
    }
  };

  // Autoplay handler (Click Trigger)
  const handlePlayPause = () => {
    if (imagesRef.current.length === 0) return;

    if (isPlaying) {
      if (autoplayTimeline.current) {
        autoplayTimeline.current.pause();
      }
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      
      const frameObj = { frame: currentFrame >= 240 ? 1 : currentFrame };
      
      autoplayTimeline.current = gsap.to(frameObj, {
        frame: 240,
        snap: 'frame',
        ease: 'none',
        duration: 10 * (1 - (frameObj.frame / 240)),
        onUpdate: () => {
          const current = Math.floor(frameObj.frame);
          setCurrentFrame(current);
          drawFrame(current);
        },
        onComplete: () => {
          setIsPlaying(false);
          setCurrentFrame(1);
          drawFrame(1);
        }
      });
    }
  };

  // Jump to specific chapters
  const jumpToChapter = (targetFrame: number) => {
    if (imagesRef.current.length === 0) return;

    if (mode === 'scroll') {
      const triggers = ScrollTrigger.getAll();
      const trigger = triggers.find(t => t.trigger === containerRef.current);
      if (trigger) {
        const progress = (targetFrame - 1) / 239;
        const scrollStart = trigger.start;
        const scrollEnd = trigger.end;
        const targetScroll = scrollStart + (scrollEnd - scrollStart) * progress;
        
        window.scrollTo({
          top: targetScroll,
          behavior: 'smooth'
        });
      }
    } else {
      if (autoplayTimeline.current) {
        autoplayTimeline.current.kill();
      }
      setIsPlaying(true);

      const frameObj = { frame: currentFrame };
      autoplayTimeline.current = gsap.to(frameObj, {
        frame: targetFrame,
        snap: 'frame',
        ease: 'power2.inOut',
        duration: 1.6, // Ultra smooth transition speed
        onUpdate: () => {
          const current = Math.floor(frameObj.frame);
          setCurrentFrame(current);
          drawFrame(current);

          // Sync step index during smooth sweeps
          let closestIdx = 0;
          let minDiff = Infinity;
          steps.forEach((step, idx) => {
            const diff = Math.abs(current - step);
            if (diff < minDiff) {
              minDiff = diff;
              closestIdx = idx;
            }
          });
          setActiveStepIndex(closestIdx);
        },
        onComplete: () => {
          setIsPlaying(false);
        }
      });
    }
  };

  const handleNext = () => {
    if (activeStepIndex < steps.length - 1) {
      const nextIdx = activeStepIndex + 1;
      setActiveStepIndex(nextIdx);
      jumpToChapter(steps[nextIdx]);
    }
  };

  const handlePrev = () => {
    if (activeStepIndex > 0) {
      const prevIdx = activeStepIndex - 1;
      setActiveStepIndex(prevIdx);
      jumpToChapter(steps[prevIdx]);
    }
  };

  const activeChapter = chapters.find(c => currentFrame >= c.startFrame && currentFrame <= c.endFrame) || chapters[0];

  return (
    <div 
      ref={containerRef} 
      className="sticky top-[-200px] z-0 w-full h-[calc(100vh-76px)] bg-[#030303] overflow-hidden"
    >
      {/* 1. Loading screen with custom Tachometer preloader */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#070708] text-white"
          >
            {/* Speedometer Loading Widget */}
            <div className="relative w-72 h-72 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-neutral-900 border-t-[#c0f20c]/60 animate-spin" style={{ animationDuration: '4s' }} />
              
              <div className="text-center font-mono select-none">
                <div className="text-[10px] text-neutral-500 uppercase tracking-[0.25em] mb-1">SYSTEM INITIATION</div>
                <div className="text-5xl font-bold text-[#c0f20c] drop-shadow-[0_0_12px_rgba(192,242,12,0.4)]">
                  {loadProgress}<span className="text-xl">%</span>
                </div>
                <div className="text-[9px] text-[#c0f20c]/70 tracking-widest mt-2">PRELOADING ASSETS</div>
                <div className="text-[8px] text-neutral-600 tracking-wider mt-4">240 JDM VIDEO FRAMES</div>
              </div>

              <svg className="absolute w-full h-full transform -rotate-90 pointer-events-none">
                <circle
                  cx="144"
                  cy="144"
                  r="120"
                  stroke="rgba(255, 255, 255, 0.03)"
                  strokeWidth="6"
                  strokeDasharray="4 6"
                  fill="none"
                />
                <circle
                  cx="144"
                  cy="144"
                  r="120"
                  stroke="#c0f20c"
                  strokeWidth="4"
                  strokeDasharray={`${(loadProgress / 100) * 754} 754`}
                  fill="none"
                  className="transition-all duration-150"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            
            <div className="mt-8 flex items-center gap-3 font-mono text-xs tracking-widest text-neutral-400">
              <Sparkles className="w-4 h-4 text-[#c0f20c] animate-pulse" />
              <span>ELITE TI MANUFAKTUR CONFIGURATOR</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Main Canvas for Drawing frames - Explicitly bound dimensions prevent React from clearing it */}
      <canvas 
        ref={canvasRef} 
        width={dimensions.width}
        height={dimensions.height}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
      />


      {/* 3. Text Overlay Content driven by Framer Motion & Active Chapter */}
      <div className="absolute inset-0 z-20 flex flex-col justify-start pt-8 px-8 pb-6 md:pt-16 md:px-16 md:pb-10 lg:pt-24 lg:px-24 lg:pb-12 pointer-events-none">
        

        {/* Center/Left Section: Animated Headings */}
        <div className="max-w-2xl text-left select-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeChapter.title}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tight text-white mb-6 leading-[0.95] font-display">
                {activeChapter.title.split(' ').map((word, idx) => (
                  <span key={idx} className={idx === 1 ? "text-[#c0f20c] italic font-serif" : ""}>
                    {word}{' '}
                  </span>
                ))}
              </h1>
              <p className="text-sm md:text-base text-neutral-400 font-sans leading-relaxed max-w-lg mb-8">
                {activeChapter.subtitle}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Section: JDM chapters bar & Interactive controls */}
        <div className="mt-auto w-full flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 pointer-events-auto z-30">
          
          {/* Chapter Navigation Jumps */}
          <div className="flex flex-wrap gap-2 font-mono">
            {chapters.map((ch, idx) => {
              const isActive = activeChapter.title === ch.title;
              return (
                <button
                  key={idx}
                  onClick={() => jumpToChapter(ch.startFrame)}
                  className={`h-9 px-4 rounded-full border text-[9px] tracking-widest uppercase transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? 'bg-[#c0f20c] text-black border-[#c0f20c] font-bold shadow-[0_0_15px_rgba(192,242,12,0.4)]'
                      : 'bg-[#0b0b0c]/80 border-neutral-900 text-neutral-400 hover:border-neutral-700 hover:text-white backdrop-blur-sm'
                  }`}
                >
                  <span className={isActive ? "text-black" : "text-[#c0f20c]"}>0{idx + 1}</span>
                  <span>{ch.title.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Telemetry Control Box moved to root level */}
        </div>

      </div>

      {/* 4. Standalone Bottom-Right JDM Telemetry Control Box (covers watermark) */}
      <div className="absolute right-8 bottom-6 md:right-16 md:bottom-10 lg:right-24 lg:bottom-12 z-30 pointer-events-auto">
        <div className="w-64 bg-[#0a0a0b] border border-neutral-900 rounded-lg overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.9)] font-mono text-[10px]">
          {/* Burnt Titanium Top Accent Line */}
          <div className="h-[2.5px] w-full bg-gradient-to-r from-[#3d2a4f] via-[#2a4f6b] via-[#6b4f8a] via-[#b89254] to-[#c66a3a]" />
          
          <div className="p-4 flex flex-col gap-3.5 select-none">
            {/* Header */}
            <div className="flex justify-between items-center text-[8px] text-neutral-500 tracking-wider">
              <span>ELITE TI // H-ECU v1.2</span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#c0f20c] rounded-full animate-pulse" />
                <span className="text-[#c0f20c] font-bold">ONLINE</span>
              </div>
            </div>



            {/* Stepper Buttons inside Controller */}
            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                onClick={handlePrev}
                disabled={activeStepIndex === 0}
                className={`h-8 border font-bold rounded uppercase tracking-wider flex items-center justify-center gap-1 transition-all text-[9px] ${
                  activeStepIndex > 0
                    ? 'border-neutral-800 bg-[#0a0a0b] text-neutral-300 hover:border-neutral-700 hover:text-white cursor-pointer active:scale-95'
                    : 'border-neutral-900 bg-neutral-950 text-neutral-700 cursor-not-allowed opacity-40'
                }`}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>PREV</span>
              </button>

              <button
                onClick={handleNext}
                disabled={activeStepIndex === steps.length - 1}
                className={`h-8 font-bold rounded uppercase tracking-wider flex items-center justify-center gap-1 transition-all text-[9px] border-0 ${
                  activeStepIndex < steps.length - 1
                    ? 'bg-[#c0f20c] text-black hover:scale-105 active:scale-95 cursor-pointer shadow-[0_0_12px_rgba(192,242,12,0.25)]'
                    : 'bg-neutral-900 text-neutral-600 cursor-not-allowed opacity-40'
                }`}
              >
                <span>NEXT</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative vertical lines / JDM grid borders */}
      <div className="absolute top-0 bottom-0 left-8 md:left-16 border-l border-neutral-900/30 z-20 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-8 md:right-16 border-r border-neutral-900/30 z-20 pointer-events-none" />
    </div>
  );
};

export default BannerGsapFramerAnimation;
