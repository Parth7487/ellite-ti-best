import * as React from "react";
import { useState, useEffect, useMemo, forwardRef } from "react";

export interface GridChassisItem {
  id: string | number;
  make: string;
  title: string;
  description: string;
  imgSrc: string;
  icon: React.ReactNode;
}

interface ExpandingCardsGridProps extends React.HTMLAttributes<HTMLUListElement> {
  items: GridChassisItem[];
  defaultActiveIndex?: number;
  onSelect: (item: GridChassisItem) => void;
}

export const ExpandingCardsGrid = forwardRef<
  HTMLUListElement,
  ExpandingCardsGridProps
>(({ className, items, defaultActiveIndex = 2, onSelect, ...props }, ref) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(defaultActiveIndex);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const gridStyle = useMemo(() => {
    if (activeIndex === null) return {};
    
    if (isDesktop) {
      const columns = items
        .map((_, index) => (index === activeIndex ? "4fr" : "1fr"))
        .join(" ");
      return { gridTemplateColumns: columns };
    } else {
      const rows = items
        .map((_, index) => (index === activeIndex ? "4fr" : "1fr"))
        .join(" ");
      return { gridTemplateRows: rows };
    }
  }, [activeIndex, items.length, isDesktop]);

  const handleInteraction = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <ul
      className={`w-full max-w-6xl gap-3 grid h-[600px] md:h-[400px] transition-[grid-template-columns,grid-template-rows] duration-500 ease-out p-0 m-0 ${className || ''}`}
      style={{
        ...gridStyle,
        ...(isDesktop 
          ? { gridTemplateRows: '1fr' }
          : { gridTemplateColumns: '1fr' }
        )
      }}
      ref={ref}
      {...props}
    >
      {items.map((item, index) => {
        const isActive = activeIndex === index;
        return (
          <li
            key={item.id}
            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-neutral-900 bg-neutral-950 text-white shadow-sm md:min-w-[80px] min-h-0 min-w-0 list-none transition-all duration-500 ease-out hover:border-[#9cce00]/40"
            onMouseEnter={() => handleInteraction(index)}
            onFocus={() => handleInteraction(index)}
            onClick={() => {
              handleInteraction(index);
              onSelect(item);
            }}
            tabIndex={0}
            data-active={isActive}
          >
            <img
              src={item.imgSrc}
              alt={item.title}
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ease-out ${
                isActive ? 'scale-100 grayscale-0 opacity-100' : 'scale-110 grayscale opacity-30 group-hover:opacity-50'
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

            {/* Glow border line on expanded */}
            <div className={`absolute inset-0 border border-[#9cce00]/20 rounded-2xl transition-opacity duration-300 pointer-events-none ${
              isActive ? 'opacity-100' : 'opacity-0'
            }`} />

            <article className="absolute inset-0 flex flex-col justify-end gap-2 p-6">
              {/* Collapsed side-rotated title (only shows when collapsed on desktop) */}
              <h3 className={`hidden origin-left rotate-90 text-[10px] font-display font-bold uppercase tracking-[0.25em] text-neutral-500 opacity-100 transition-all duration-300 ease-out md:block whitespace-nowrap absolute left-[2.5rem] bottom-12 ${
                isActive ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}>
                {item.title}
              </h3>

              {/* Icon (shows when active) */}
              <div className={`text-[#c0f20c] opacity-0 transition-all duration-300 delay-75 ease-out translate-y-2 ${
                isActive ? 'opacity-100 translate-y-0' : ''
              }`}>
                {item.icon}
              </div>

              {/* Active title (make / model) */}
              <div className={`opacity-0 transition-all duration-300 delay-100 ease-out translate-y-2 text-left ${
                isActive ? 'opacity-100 translate-y-0' : ''
              }`}>
                <span className="font-mono text-[9px] font-bold text-[#c0f20c] tracking-widest block uppercase">
                  {item.make}
                </span>
                <h3 className="text-lg md:text-xl font-display font-bold text-white uppercase mt-0.5">
                  {item.title}
                </h3>
              </div>

              {/* Active Description */}
              <p className={`w-full max-w-xs text-[10.5px] leading-relaxed text-neutral-400 opacity-0 transition-all duration-300 delay-150 ease-out text-left translate-y-2 ${
                isActive ? 'opacity-100 translate-y-0' : ''
              }`}>
                {item.description}
              </p>
              
              <span className={`inline-flex items-center gap-1.5 text-[8.5px] font-mono text-[#c0f20c] uppercase tracking-wider opacity-0 transition-all duration-300 delay-200 ease-out text-left translate-y-2 ${
                isActive ? 'opacity-100 translate-y-0' : ''
              }`}>
                EXPLORE CHASSIS &rarr;
              </span>
            </article>
          </li>
        );
      })}
    </ul>
  );
});
ExpandingCardsGrid.displayName = "ExpandingCardsGrid";
