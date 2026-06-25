import * as React from 'react';

export interface LogoLoopProps {
  items: React.ReactNode[];
  speed?: number; // duration of one loop in seconds
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
  fadeOut?: boolean;
  gap?: string; // Tailwind spacing class, e.g. "gap-8"
  className?: string;
}

export function LogoLoop({
  items,
  speed = 25,
  direction = 'left',
  pauseOnHover = true,
  fadeOut = true,
  gap = 'gap-8',
  className = '',
}: LogoLoopProps) {
  // Duplicate items array once to achieve a seamless loop when shifted by -50%
  const duplicatedItems = [...items, ...items];
  
  const animationClass = direction === 'left' ? 'animate-logo-loop-left' : 'animate-logo-loop-right';

  return (
    <div 
      className={`relative overflow-hidden w-full py-6 select-none ${className}`}
      style={{
        '--speed': `${speed}s`,
        '--hover-state': pauseOnHover ? 'paused' : 'running',
      } as React.CSSProperties}
    >
      {fadeOut && (
        <>
          {/* Edge fade gradient overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-[#030303] via-[#030303]/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-[#030303] via-[#030303]/80 to-transparent z-10 pointer-events-none" />
        </>
      )}
      
      <div className="flex overflow-hidden select-none w-full">
        <div className={`flex shrink-0 ${gap} ${animationClass} items-center min-w-full justify-around`}>
          {duplicatedItems.map((item, idx) => (
            <div key={idx} className="flex items-center justify-center">
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
