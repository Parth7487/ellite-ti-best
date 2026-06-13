import React from 'react';
import { KitComponent, FinishType } from '../types';

interface CarVisualizerProps {
  activeView: 'front' | 'side' | 'rear' | 'hood';
  components: KitComponent[];
  finish: FinishType;
  onViewChange: (view: 'front' | 'side' | 'rear' | 'hood') => void;
}

export default function CarVisualizer({
  activeView,
  components,
  finish,
  onViewChange,
}: CarVisualizerProps) {
  // Helper to check if a component is selected
  const isSelected = (id: string) => {
    const comp = components.find((c) => c.id === id);
    return comp ? comp.isSelected : false;
  };

  // Helper to get material for a component
  const getMaterial = (id: string) => {
    const comp = components.find((c) => c.id === id);
    return comp ? comp.material : 'frp';
  };

  // Helper to get finish for a component
  const getComponentFinish = (id: string) => {
    const comp = components.find((c) => c.id === id);
    return comp ? comp.finish || 'matte' : 'matte';
  };

  // Style dynamic based on selected material & finish
  const getComponentFill = (id: string) => {
    if (!isSelected(id)) {
      return 'fill-[#090909] stroke-[#222] stroke-dasharray-[2_2]';
    }

    const material = getMaterial(id);
    if (material === 'frp') {
      return 'fill-[#333333] stroke-[#c0f20c] stroke-[1.5] transition-all duration-300';
    }

    // Carbon upgrades follow the individual component's finish style
    const itemFinish = getComponentFinish(id);
    switch (itemFinish) {
      case 'matte':
        return 'fill-[#1c1c1c] stroke-[#c0f20c] stroke-[1.5] transition-all duration-300';
      case 'gloss':
        return 'fill-[#121212] stroke-[#c0f20c] stroke-[2] transition-all duration-300 shadow-[inset_0_2px_4px_rgba(255,255,255,0.15)]';
      case 'forged':
        return 'fill-[#242426] stroke-[#c0f20c] stroke-[2] transition-all duration-300';
      case 'kevlar':
        return 'fill-[#3a3520] stroke-[#c0f20c] stroke-[2] transition-all duration-300';
      default:
        return 'fill-[#1a1a1a] stroke-[#c0f20c]';
    }
  };

  const getLabelColor = (id: string) => {
    if (isSelected(id)) {
      return 'text-[#c0f20c] font-semibold';
    }
    return 'text-neutral-600 line-through';
  };

  return (
    <div className="w-full flex flex-col">
      {/* 360 viewer container: Click to swivel camera lens */}
      <div 
        onClick={() => {
          const views = ['front', 'side', 'rear', 'hood'] as const;
          const nextIdx = (views.indexOf(activeView) + 1) % views.length;
          onViewChange(views[nextIdx]);
        }}
        className="relative aspect-square w-full rounded-lg border border-[#161616] hover:border-neutral-800/80 bg-[#040404] overflow-hidden flex flex-col justify-between p-5 group cursor-pointer transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.5)] select-none"
      >
        
        {/* Hologram Grid Overlay Background */}
        <div className="absolute inset-0 opacity-[0.025] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#040404]/80 to-[#040404] pointer-events-none"></div>

        {/* Header corner items in frame */}
        <div className="z-10 flex justify-between items-start pointer-events-none">
          <div className="flex flex-col">
            <span className="text-[9px] font-mono tracking-[4px] text-neutral-600 uppercase">ACTIVE SPECIFICATION</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="font-display font-medium text-base leading-none tracking-tight text-white">ETi</span>
              <span className="text-[9px] font-mono text-[#c0f20c] leading-none tracking-wider px-1 border border-[#c0f20c]/30 rounded-[2px] bg-[#c0f20c]/5 uppercase font-bold">ATELIER 3D VIEW</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[9.5px] font-mono text-neutral-400 capitalize">Specs: <span className="text-[#c0f20c] uppercase font-bold">Bespoke</span></span>
            <span className="text-[8.5px] font-mono text-neutral-500 group-hover:text-[#c0f20c] transition-all duration-300 mt-1 uppercase">
              CAMERA: {activeView} • <span className="underline decoration-neutral-800 group-hover:decoration-[#c0f20c]">CLICK FOR 360°</span>
            </span>
          </div>
        </div>

        {/* SVGs of Car depending on activeView */}
        <div className="flex-1 flex items-center justify-center relative w-full h-full px-2">
          
          {/* FRONT VIEW */}
          {activeView === 'front' && (
            <svg viewBox="0 0 400 240" className="w-[95%] h-auto max-h-[300px] drop-shadow-[0_10px_15px_rgba(192,242,12,0.05)]">
              {/* Car Body Shell Frame Outline (Base body, not replaceable but fits) */}
              <path d="M 60,150 Q 80,75 120,65 L 280,65 Q 320,75 340,150" fill="none" stroke="#222" strokeWidth="1" />
              
              {/* Windshield */}
              <path d="M 110,85 L 290,85 L 270,120 L 130,120 Z" fill="#080808" stroke="#1f1f1f" strokeWidth="1" />
              
              {/* Cabin outline */}
              <path d="M 120,80 Q 200,50 280,80" fill="none" stroke="#222" strokeWidth="1" />

              {/* Tires */}
              <rect x="50" y="160" width="22" height="50" rx="3" fill="#0c0c0c" stroke="#1f1f1f" strokeWidth="1" />
              <rect x="328" y="160" width="22" height="50" rx="3" fill="#0c0c0c" stroke="#1f1f1f" strokeWidth="1" />

              {/* Headlights (Faint glow based on selection) */}
              <path d="M 85,150 L 115,150 L 105,157 L 90,157 Z" fill="#fff" fillOpacity="0.1" stroke="#333" />
              <path d="M 315,150 L 285,150 L 295,157 L 310,157 Z" fill="#fff" fillOpacity="0.1" stroke="#333" />
              
              {/* [PART] Vented Hood */}
              <path 
                d="M 120,120 L 280,120 L 265,160 L 135,160 Z" 
                className={`${getComponentFill('vented_hood')} transition-all duration-300 cursor-pointer`}
              />
              {/* Hood vents detailing */}
              {isSelected('vented_hood') && (
                <>
                  <path d="M 155,130 L 175,130 L 170,145 L 158,145 Z" fill="#000" fillOpacity="0.6" />
                  <path d="M 245,130 L 225,130 L 230,145 L 242,145 Z" fill="#000" fillOpacity="0.6" />
                </>
              )}

              {/* [PART] Front Wide Fenders (Rendered on left & right sides) */}
              {/* Left Fender */}
              <path 
                d="M 60,150 Q 80,145 95,150 L 90,185 Q 75,185 62,175 Z" 
                className={`${getComponentFill('front_fenders')} transition-all duration-300`}
              />
              {/* Right Fender */}
              <path 
                d="M 340,150 Q 320,145 305,150 L 310,185 Q 325,185 338,175 Z" 
                className={`${getComponentFill('front_fenders')} transition-all duration-300`}
              />

              {/* [PART] Front Bumper */}
              <path 
                d="M 85,170 C 85,170 95,210 130,212 L 270,212 C 305,210 315,170 315,170 L 320,165" 
                fill="none" 
              />
              <path 
                d="M 90,175 C 90,175 105,212 140,215 L 260,215 C 295,215 310,175 310,175 L 328,162 L 320,158 C 300,160 100,160 80,158 L 72,162 Z" 
                className={`${getComponentFill('front_bumper')} transition-all duration-300`}
              />
              {/* Intercooler mesh in bumper */}
              {isSelected('front_bumper') && (
                <rect x="150" y="188" width="100" height="18" rx="2" fill="#151515" stroke="#333" strokeWidth="0.5" />
              )}
            </svg>
          )}

          {/* SIDE VIEW */}
          {activeView === 'side' && (
            <svg viewBox="0 0 400 240" className="w-[100%] h-auto max-h-[300px] drop-shadow-[0_10px_15px_rgba(192,242,12,0.05)]">
              {/* Cabin & Windshield */}
              <path d="M 80,120 Q 150,55 240,55 Q 300,55 330,120 Z" fill="#080808" stroke="#1f1f1f" strokeWidth="1" />
              <path d="M 120,110 L 195,65 L 245,65 L 260,110 Z" fill="#000" stroke="#181818" strokeWidth="1" />

              {/* Main Body Shell Base */}
              <path d="M 30,145 Q 40,115 80,115 L 320,115 Q 360,115 375,145" fill="none" stroke="#222" strokeWidth="1" />

              {/* Tires (Standard RX7 wheels) */}
              <circle cx="85" cy="155" r="28" fill="#111" stroke="#333" strokeWidth="4" />
              <circle cx="85" cy="155" r="16" fill="#222" stroke="#555" strokeWidth="2" />
              <circle cx="310" cy="155" r="28" fill="#111" stroke="#333" strokeWidth="4" />
              <circle cx="310" cy="155" r="16" fill="#222" stroke="#555" strokeWidth="2" />

              {/* [PART] GT WING Side Profile */}
              <path 
                d="M 345,110 L 355,75 T 380,72 L 382,78 T 355,83 Z" 
                className={`${getComponentFill('gt_wing')} transition-all duration-300`}
              />

              {/* [PART] Front Fender +50mm */}
              <path 
                d="M 45,140 Q 60,115 105,115 L 120,125 L 115,155 L 75,155 C 55,152 48,145 45,140 Z" 
                className={`${getComponentFill('front_fenders')} transition-all duration-300`}
              />

              {/* [PART] Side Skirts */}
              <path 
                d="M 116,160 L 275,160 L 270,169 L 123,169 Z" 
                className={`${getComponentFill('side_skirts')} transition-all duration-300`}
              />

              {/* [PART] Rear Fender +50mm */}
              <path 
                d="M 260,125 L 285,115 Q 330,115 345,140 C 342,148 335,152 320,154 L 280,154 Z" 
                className={`${getComponentFill('rear_fenders')} transition-all duration-300`}
              />

              {/* Base body panel connecting lines for realism */}
              <path d="M 120,125 L 260,125 L 260,160 L 120,160 Z" fill="none" stroke="#222" strokeWidth="1" />
              <path d="M 190,125 L 190,160" fill="none" stroke="#222" strokeWidth="0.5" />
            </svg>
          )}

          {/* REAR VIEW */}
          {activeView === 'rear' && (
            <svg viewBox="0 0 400 240" className="w-[95%] h-auto max-h-[300px] drop-shadow-[0_10px_15px_rgba(192,242,12,0.05)]">
              {/* Back window / Windshield */}
              <path d="M 110,85 L 290,85 L 265,122 L 135,122 Z" fill="#080808" stroke="#1f1f1f" strokeWidth="1" />

              {/* Cabin Outline */}
              <path d="M 98,145 Q 80,75 120,65 L 280,65 Q 320,75 302,145" fill="none" stroke="#222" strokeWidth="1" />

              {/* Tires */}
              <rect x="52" y="160" width="26" height="50" rx="3" fill="#0c0c0c" stroke="#1f1f1f" strokeWidth="1" />
              <rect x="322" y="160" width="26" height="50" rx="3" fill="#0c0c0c" stroke="#1f1f1f" strokeWidth="1" />

              {/* Exhaust tip */}
              <circle cx="280" cy="202" r="7" fill="#222" stroke="#444" strokeWidth="2" />
              <circle cx="280" cy="202" r="5" fill="#000" />

              {/* [PART] GT Wing Rear Profile */}
              <g className="transition-all duration-300">
                {/* Mounts */}
                <path d="M 150,110 L 140,84 L 148,84 L 155,110 Z" className={`${getComponentFill('gt_wing')}`} />
                <path d="M 250,110 L 260,84 L 252,84 L 245,110 Z" className={`${getComponentFill('gt_wing')}`} />
                {/* Main Foil */}
                <path d="M 90,84 C 150,81 250,81 310,84 L 315,76 C 250,73 150,73 85,76 Z" className={`${getComponentFill('gt_wing')}`} />
                {/* Endplates */}
                <path d="M 85,73 L 90,92 L 82,90 L 78,75 Z" className={`${getComponentFill('gt_wing')}`} />
                <path d="M 315,73 L 310,92 L 318,90 L 322,75 Z" className={`${getComponentFill('gt_wing')}`} />
              </g>

              {/* [PART] Rear Wide Fenders +50mm */}
              {/* Left Fender */}
              <path 
                d="M 60,150 Q 80,145 98,150 L 98,185 Q 75,185 62,175 Z" 
                className={`${getComponentFill('rear_fenders')} transition-all duration-300`}
              />
              {/* Right Fender */}
              <path 
                d="M 340,150 Q 320,145 302,150 L 302,185 Q 325,185 338,175 Z" 
                className={`${getComponentFill('rear_fenders')} transition-all duration-300`}
              />

              {/* RX-7 Tail Light strip */}
              <rect x="100" y="132" width="200" height="12" rx="2" fill="#3a0505" stroke="#1c1c1c" strokeWidth="1" />
              {/* Red glow indicator */}
              <rect x="105" y="135" width="190" height="6" rx="1" fill="#cc1111" />

              {/* [PART] Rear Bumper & Diffuser */}
              <path 
                d="M 98,144 L 302,144 L 314,168 L 310,195 Q 260,205 200,205 Q 140,205 90,195 L 86,168 Z" 
                className={`${getComponentFill('rear_bumper')} transition-all duration-300`}
              />
              {/* Diffuser Fins detailing */}
              {isSelected('rear_bumper') && (
                <g stroke="#c0f20c" strokeWidth="1" opacity="0.4">
                  <line x1="170" y1="185" x2="170" y2="204" />
                  <line x1="190" y1="185" x2="190" y2="205" />
                  <line x1="210" y1="185" x2="210" y2="205" />
                  <line x1="230" y1="185" x2="230" y2="204" />
                </g>
              )}
            </svg>
          )}

          {/* HOOD / TOP-DOWN VIEW */}
          {activeView === 'hood' && (
            <svg viewBox="0 0 400 240" className="w-[90%] h-auto max-h-[300px] drop-shadow-[0_10px_15px_rgba(192,242,12,0.05)]">
              {/* Windshield at bottom */}
              <path d="M 60,220 L 340,220 L 290,175 L 110,175 Z" fill="#080808" stroke="#1f1f1f" />

              {/* Side mirrors */}
              <path d="M 100,185 L 75,180 L 78,190 Z" fill="#222" />
              <path d="M 300,185 L 325,180 L 322,190 Z" fill="#222" />

              {/* [PART] Front Fenders (Sides) */}
              <path d="M 85,30 L 100,30 L 115,175 L 68,175 Z" className={`${getComponentFill('front_fenders')} transition-all duration-300`} />
              <path d="M 315,30 L 300,30 L 285,175 L 332,175 Z" className={`${getComponentFill('front_fenders')} transition-all duration-300`} />

              {/* [PART] Vented Hood */}
              <path 
                d="M 105,30 L 295,30 L 280,172 L 120,172 Z" 
                className={`${getComponentFill('vented_hood')} transition-all duration-300`}
              />
              {/* Hood vent detailing */}
              {isSelected('vented_hood') && (
                <g fill="#050505" stroke="#444" strokeWidth="0.5">
                  {/* Triple cooling vents typical for Veilside / RE Amemiya hoods */}
                  <rect x="140" y="55" width="40" height="15" rx="1" />
                  <rect x="220" y="55" width="40" height="15" rx="1" />
                  <rect x="145" y="80" width="35" height="12" rx="1" />
                  <rect x="220" y="80" width="35" height="12" rx="1" />
                  <rect x="150" y="105" width="100" height="18" rx="2" />
                </g>
              )}

              {/* [PART] Front Bumper Nose edge */}
              <path d="M 105,30 Q 200,10 295,30" fill="none" stroke="#222" strokeWidth="1" />
            </svg>
          )}

        </div>

      </div>
    </div>
  );
}
