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
  const [expandedIndex, setExpandedIndex] = useState(2); // default third item active for balance

  return (
    <div className="w-full flex items-center justify-center py-10 bg-[#0a0a0b]">
      <div className="w-full max-w-6xl px-4">
        <div className="flex flex-col md:flex-row w-full items-stretch justify-center gap-3 h-[500px] md:h-[400px]">
          {items.map((item, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <div
                key={idx}
                className="relative cursor-pointer overflow-hidden rounded-2xl transition-all duration-500 ease-out border border-neutral-900 hover:border-[#9cce00]/40 group flex-1 md:flex-none"
                style={{
                  width: "100%", // default for vertical column on mobile
                  flex: isExpanded ? "4 0 0%" : "1 0 0%",
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
                <div className={`absolute inset-0 border border-[#9cce00]/20 rounded-2xl transition-opacity duration-300 ${
                  isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`} />

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
