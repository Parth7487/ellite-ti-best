import * as React from "react";
import { useState } from "react";

export interface ChassisItem {
  make: string;
  model: string;
  code: string;
  image: string;
}

interface ExpandOnHoverProps {
  items: ChassisItem[];
  onSelect: (item: ChassisItem) => void;
}

export function ExpandOnHover({ items, onSelect }: ExpandOnHoverProps) {
  // Supra MK5 (index 3) is default open (the 4th item in the 7-item list)
  const [expandedIndex, setExpandedIndex] = useState(3);

  // Customizer Controls State
  const [sectionPadding, setSectionPadding] = useState(143); // padding top & bottom
  const [headerYOffset, setHeaderYOffset] = useState(0); // moves header up/down
  const [headerTopGap, setHeaderTopGap] = useState(0); // gap above the header
  const [headerBottomGap, setHeaderBottomGap] = useState(48); // space between header & cards
  const [cardHeight, setCardHeight] = useState(578); // card height
  const [cardGap, setCardGap] = useState(12); // gap between cards
  const [borderRadius, setBorderRadius] = useState(9); // corner radius

  return (
    <div 
      className="w-full flex flex-col items-center justify-center bg-[#0a0a0b] relative"
      style={{
        paddingTop: `${sectionPadding}px`,
        paddingBottom: `${sectionPadding}px`,
      }}
    >
      {/* Floating Glassmorphic Customizer Controls */}
      <div className="fixed bottom-6 right-6 z-[999] bg-[#0c0c0e]/85 border border-neutral-800 backdrop-blur-xl p-5 rounded-2xl w-80 text-white shadow-2xl transition-all duration-300 hover:border-[#c0f20c]/40 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
          <span className="font-bold text-[#c0f20c] tracking-widest text-[10px] uppercase">
            ETI HEADER & CARDS SCHEMATICS
          </span>
          <span className="bg-neutral-850 px-2 py-0.5 rounded text-[9px] text-neutral-400 border border-neutral-800">
            v2.1
          </span>
        </div>

        <div className="space-y-4">
          {/* Slider 1: Header Y-Offset */}
          <div>
            <div className="flex justify-between mb-1.5 text-neutral-300">
              <span>Header Y-Offset</span>
              <span className="text-[#c0f20c] font-bold">{headerYOffset}px</span>
            </div>
            <input 
              type="range" 
              min="-120" 
              max="120" 
              value={headerYOffset} 
              onChange={(e) => setHeaderYOffset(Number(e.target.value))}
              className="w-full accent-[#c0f20c] bg-neutral-800 h-1 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Slider 2: Gap Above Header */}
          <div>
            <div className="flex justify-between mb-1.5 text-neutral-300">
              <span>Gap Above Header</span>
              <span className="text-[#c0f20c] font-bold">{headerTopGap}px</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="150" 
              value={headerTopGap} 
              onChange={(e) => setHeaderTopGap(Number(e.target.value))}
              className="w-full accent-[#c0f20c] bg-neutral-800 h-1 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Slider 3: Gap Below Header */}
          <div>
            <div className="flex justify-between mb-1.5 text-neutral-300">
              <span>Gap Below Header</span>
              <span className="text-[#c0f20c] font-bold">{headerBottomGap}px</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="150" 
              value={headerBottomGap} 
              onChange={(e) => setHeaderBottomGap(Number(e.target.value))}
              className="w-full accent-[#c0f20c] bg-neutral-800 h-1 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Slider 4: Section Padding */}
          <div>
            <div className="flex justify-between mb-1.5 text-neutral-300">
              <span>Section Padding</span>
              <span className="text-[#c0f20c] font-bold">{sectionPadding}px</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="250" 
              value={sectionPadding} 
              onChange={(e) => setSectionPadding(Number(e.target.value))}
              className="w-full accent-[#c0f20c] bg-neutral-800 h-1 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Slider 5: Card Height */}
          <div>
            <div className="flex justify-between mb-1.5 text-neutral-300">
              <span>Card Height</span>
              <span className="text-[#c0f20c] font-bold">{cardHeight}px</span>
            </div>
            <input 
              type="range" 
              min="300" 
              max="950" 
              value={cardHeight} 
              onChange={(e) => setCardHeight(Number(e.target.value))}
              className="w-full accent-[#c0f20c] bg-neutral-800 h-1 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Slider 6: Card Gap */}
          <div>
            <div className="flex justify-between mb-1.5 text-neutral-300">
              <span>Card Gap</span>
              <span className="text-[#c0f20c] font-bold">{cardGap}px</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="48" 
              value={cardGap} 
              onChange={(e) => setCardGap(Number(e.target.value))}
              className="w-full accent-[#c0f20c] bg-neutral-800 h-1 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Slider 7: Corner Radius */}
          <div>
            <div className="flex justify-between mb-1.5 text-neutral-300">
              <span>Corner Radius</span>
              <span className="text-[#c0f20c] font-bold">{borderRadius}px</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="40" 
              value={borderRadius} 
              onChange={(e) => setBorderRadius(Number(e.target.value))}
              className="w-full accent-[#c0f20c] bg-neutral-800 h-1 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-neutral-800 text-[9px] text-neutral-400 leading-normal">
          Adjust the sliders to style this section. Take a screenshot when you are done and send it over!
        </div>
      </div>

      {/* Styled Title Header Section with custom JDM Side-label */}
      <div className="w-full max-w-none px-6 md:px-12 transition-transform duration-300 ease-out"
        style={{
          transform: `translateY(${headerYOffset}px)`,
          marginTop: `${headerTopGap}px`,
          marginBottom: `${headerBottomGap}px`,
        }}
      >
        <div className="section-head w-full">
          <div>
            <h2 className="display-l text-white uppercase font-bold text-3xl md:text-5xl tracking-tight">
              Shop by Vehicle
            </h2>
            <p className="mt-2 text-[9px] uppercase tracking-widest text-neutral-500 font-mono">
              Respecting the past. Engineering the future.
            </p>
          </div>
          <div className="ti-rule"></div>
          <span className="mono uppercase text-[10px] tracking-wider text-right" style={{ color: 'var(--eti-ti-dim)' }}>
            30+ chassis &nbsp;/&nbsp; bespoke fitment
          </span>
        </div>
      </div>

      {/* Hover Cards Container */}
      <div className="w-full max-w-none px-0">
        <div 
          className="flex flex-col md:flex-row w-full items-stretch justify-center"
          style={{ 
            height: `${cardHeight}px`,
            gap: `${cardGap}px`
          }}
        >
          {items.map((item, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <div
                key={idx}
                className="relative cursor-pointer overflow-hidden transition-all duration-500 ease-out border border-neutral-900 hover:border-[#9cce00]/40 group flex-1 md:flex-none"
                style={{
                  width: "100%", // default for vertical column on mobile
                  flex: isExpanded ? "4 0 0%" : "1 0 0%",
                  borderRadius: `${borderRadius}px`,
                  transition: "all 500ms cubic-bezier(0.25, 0.8, 0.25, 1)",
                }}
                onMouseEnter={() => setExpandedIndex(idx)}
                onClick={() => onSelect(item)}
              >
                <img
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={item.image}
                  alt={`${item.make} ${item.model}`}
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent transition-opacity duration-300" />
                
                {/* Glow border line on expanded */}
                <div 
                  className={`absolute inset-0 border border-[#9cce00]/20 transition-opacity duration-300 ${
                    isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                  style={{ borderRadius: `${borderRadius}px` }}
                />

                {/* Expanded text content */}
                <div className={`absolute bottom-6 left-6 right-6 transition-all duration-500 text-left ${
                  isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                }`}>
                  <span className="font-mono text-[9px] font-bold text-[#c0f20c] tracking-widest block uppercase">
                    {item.make}
                  </span>
                  <h3 className="font-display font-bold text-white text-xl tracking-wider uppercase mt-1">
                    {item.model}
                  </h3>
                  <span className="font-mono text-[10px] text-neutral-400 tracking-wider block mt-1">
                    {item.code}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[8.5px] font-mono text-[#c0f20c] uppercase tracking-wider mt-4 group-hover:underline">
                    EXPLORE CHASSIS &rarr;
                  </span>
                </div>

                {/* Collapsed vertical title (only on desktop) */}
                <div className={`absolute inset-y-0 right-0 left-0 hidden md:flex items-center justify-center transition-all duration-300 ${
                  isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}>
                  <span className="font-display font-bold text-[11px] tracking-[0.2em] text-neutral-500 uppercase select-none pointer-events-none origin-center -rotate-90 whitespace-nowrap">
                    {item.model}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
