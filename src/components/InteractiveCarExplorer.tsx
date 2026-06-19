import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, X, ShoppingCart, Shield, ArrowRight, Trophy } from 'lucide-react';

interface ComponentItem {
  id: string;
  name: string;
  price: number;
  description: string;
  specs: string[];
  position: { top: string; left: string };
  image: string;
}

const supraComponents: ComponentItem[] = [
  {
    id: 'rear-wing',
    name: 'GT Wing (Track-spec)',
    price: 3295,
    description: 'Adjustable dual-element dry carbon GT wing with CNC-machined 6061-T6 aluminum uprights. Optimizes downforce distribution across the rear axle.',
    specs: ['Adjustable angle of attack (AOA)', 'Carbon weave: 3K Twill Prepreg', 'Reduces drag while boosting high-speed cornering stability'],
    position: { top: '48%', left: '19%' },
    image: '/images/NK7_6693.jpg'
  },
  {
    id: 'rear-diffuser',
    name: 'Carbon Rear Diffuser',
    price: 2195,
    description: 'Full venturi-channel rear diffuser designed to extract high-speed airflow under the chassis, creating a low-pressure area for ground-effect downforce.',
    specs: ['Optimized strakes for laminar flow', 'Seamless fitment with stock rear bumper mounts', 'Matte or gloss high-temp resin finishes available'],
    position: { top: '72%', left: '17%' },
    image: '/images/Supra Grey5.jpg'
  },
  {
    id: 'side-skirts',
    name: 'Carbon Side Skirts',
    price: 1595,
    description: 'Extended carbon skirts designed to prevent high-pressure air from rolling under the chassis side profiles, keeping downforce stable during hard yaw angles.',
    specs: ['Prepreg autoclave cured', '0.5mm precision bolt-on design', 'Includes aerospace Grade 5 titanium fasteners'],
    position: { top: '72%', left: '29%' },
    image: '/images/SUPRA green4.jpg'
  },
  {
    id: 'mirrors',
    name: 'Carbon Ganador Mirrors',
    price: 895,
    description: 'Sleek aerodynamic Ganador-style mirrors crafted in autoclave carbon fiber. Minimizes side-scrim drag coefficient and features integrated blue-tinted heated mirrors.',
    specs: ['Weight: only 380g per pair', 'Integrated anti-glare wide-angle lens', 'OEM plug-and-play harness'],
    position: { top: '52%', left: '32%' },
    image: '/images/NK7_5352.jpg'
  },
  {
    id: 'hood',
    name: 'Carbon Fiber Hood (Vented)',
    price: 2495,
    description: 'Vented carbon hood featuring aggressive ducting to vent radiator heat and alleviate high-pressure build-up inside the engine bay.',
    specs: ['Bakes in autoclave at 120°C', 'Built-in rain guards included', 'Internal skeleton frame retains stock hinge/latch mechanics'],
    position: { top: '56%', left: '44%' },
    image: '/images/NK7_6402.jpg'
  },
  {
    id: 'front-splitter',
    name: 'Carbon Front Splitter',
    price: 1895,
    description: 'Front lip splitter with built-in carbon diffusers. Creates a high-velocity air velocity difference that sucks the front bumper down toward the tarmac.',
    specs: ['Engineered to support up to 150kg downforce', 'Flat under-tray layout', 'Requires optional adjustable support brackets'],
    position: { top: '80%', left: '55%' },
    image: '/images/NK7_6414.jpg'
  }
];

const z350Components: ComponentItem[] = [
  {
    id: 'front-bumper',
    name: 'Carbon Front Bumper Fascia',
    price: 2105,
    description: 'High-downforce front bumper replacement with an integrated carbon splitter and enlarged intakes to feed high-flow cooling ducts.',
    specs: ['Bespoke prepreg vacuum carbon', 'Engineered intake dams for radiator airflow', 'Direct bolt-on replacement fitting stock crash bars'],
    position: { top: '70%', left: '60%' },
    image: '/images/350z-hero-0.jpg'
  },
  {
    id: 'front-fender',
    name: 'Vented Front Fenders',
    price: 2805,
    description: 'Bespoke front fenders adding +50mm track width per side. Sculpted vents alleviate turbulent high-pressure pocket drag inside the wheel wells.',
    specs: ['Weight savings: -4.2kg per fender', 'Aerodynamic heat-extraction vents', 'Compatible with stock liners'],
    position: { top: '58%', left: '46%' },
    image: '/images/350z-hero-1.jpg'
  },
  {
    id: 'side-skirts',
    name: 'Aerodynamic Side Skirts',
    price: 2105,
    description: 'Extended profile side skirts that manage side airflow, preventing high-pressure drafts from leaking underneath the flat bottom under-tray.',
    specs: ['Grade 5 titanium under-fasteners included', 'Vacuum bagged carbon fiber structure', 'Designed for optimal ground clearance'],
    position: { top: '72%', left: '36%' },
    image: '/images/350z-hero-8.jpg'
  },
  {
    id: 'rear-fender',
    name: 'Widebody Rear Fenders',
    price: 3505,
    description: 'Over-fender rear extensions adding +60mm width. Permits wider track setups, aggressive offsets, and wider performance compounds.',
    specs: ['Ultra-light high-tensile carbon build', 'Seamless body flare integration lines', 'Bakes in autoclave at 120°C'],
    position: { top: '55%', left: '26%' },
    image: '/images/350z-hero-9.jpg'
  },
  {
    id: 'rear-bumper',
    name: 'Diffused Rear Bumper',
    price: 2105,
    description: 'Bespoke rear bumper cover with integrated drag-reduction vents and optimized exhaust exits to clean rear turbulent wake.',
    specs: ['Autoclave cured prepreg carbon', 'Direct bolt-on design', 'High UV protective glossy coat'],
    position: { top: '70%', left: '16%' },
    image: '/images/350z-hero-0.jpg'
  },
  {
    id: 'rear-wing',
    name: 'Top Secret GT Wing',
    price: 1895,
    description: 'Dry carbon deck lid spoiler designed specifically for the Z33 chassis to improve rear downforce coefficients at track speeds.',
    specs: ['Calculated foil coordinates', 'Subtle trunk layout alignment', 'Mounts using reinforced structural backing plates'],
    position: { top: '48%', left: '20%' },
    image: '/images/350z-hero-1.jpg'
  }
];

interface InteractiveCarExplorerProps {
  onAddToCart: (product: { id: string; title: string; price: number; category: string }) => void;
}

export const InteractiveCarExplorer: React.FC<InteractiveCarExplorerProps> = ({ onAddToCart }) => {
  const [activeComponent, setActiveComponent] = useState<string | null>(null);
  const [hoveredComponent, setHoveredComponent] = useState<string | null>(null);
  const [activeChassis, setActiveChassis] = useState<'350z' | 'supra'>('350z');

  const componentsList = activeChassis === '350z' ? z350Components : supraComponents;
  const chassisImage = activeChassis === '350z' ? '/images/350z-hero-1.jpg' : '/images/SUPRA green3.jpg';
  const completeKitPrice = activeChassis === '350z' ? 13800 : 9800;
  const completeKitTitle = activeChassis === '350z' ? '350Z Complete Aero Kit' : 'Supra Complete Aero Kit';

  const activeData = componentsList.find(c => c.id === (hoveredComponent || activeComponent));

  const handleChassisChange = (chassis: '350z' | 'supra') => {
    setActiveChassis(chassis);
    setActiveComponent(null);
    setHoveredComponent(null);
  };

  return (
    <section className="py-24 relative overflow-hidden bg-[#0a0a0b] border-t border-neutral-900">
      {/* Subtle Grid Overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 50px, #333 50px, #333 51px), repeating-linear-gradient(90deg, transparent, transparent 50px, #333 50px, #333 51px)',
          }} 
        />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header with Title and Chassis Selector Tabs */}
        <div className="mb-16 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 border-b border-neutral-900 pb-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-left"
          >
            <span className="kicker font-mono text-[10px] tracking-[0.3em] text-[#c0f20c] mb-3 block uppercase font-bold">
              002 &mdash; HIGH SPEED LABS
            </span>
            <h2 className="font-display font-bold text-4xl md:text-5xl uppercase tracking-[0.2em] text-[#fafaf7]">
              EXPLORE AERO
            </h2>
            <p className="text-neutral-400 max-w-xl text-xs leading-relaxed font-sans mt-3">
              Elite Ti prepreg carbon composite components are 3D laser-scanned and autoclave-cured for precise motorsport performance. Explore specs by hovering or clicking.
            </p>
          </motion.div>

          {/* Immersive JDM Chassis Selector */}
          <div className="flex gap-2 font-mono text-[9px] uppercase tracking-wider self-start lg:self-end">
            <button 
              onClick={() => handleChassisChange('350z')}
              className={`px-4 py-2 border transition-all cursor-pointer ${activeChassis === '350z' ? 'bg-[#c0f20c] border-[#c0f20c] text-black font-bold' : 'border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white'}`}
            >
              NISSAN 350Z Z33
            </button>
            <button 
              onClick={() => handleChassisChange('supra')}
              className={`px-4 py-2 border transition-all cursor-pointer ${activeChassis === 'supra' ? 'bg-[#c0f20c] border-[#c0f20c] text-black font-bold' : 'border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white'}`}
            >
              TOYOTA SUPRA JZA80
            </button>
            <button 
              onClick={() => triggerAlert('rx7')}
              className="px-4 py-2 border border-neutral-900 text-neutral-600 cursor-not-allowed hover:bg-neutral-950 flex items-center gap-1.5"
            >
              MAZDA RX-7 FD3S <span className="text-[8px] bg-neutral-900 px-1 py-0.5 rounded text-neutral-500 font-sans tracking-normal">LOCK</span>
            </button>
            <button 
              onClick={() => triggerAlert('r34')}
              className="px-4 py-2 border border-neutral-900 text-neutral-600 cursor-not-allowed hover:bg-neutral-950 flex items-center gap-1.5"
            >
              SKYLINE R34 GTR <span className="text-[8px] bg-neutral-900 px-1 py-0.5 rounded text-neutral-500 font-sans tracking-normal">LOCK</span>
            </button>
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          
          {/* Left: Interactive Car Image with Hotspots */}
          <div className="lg:col-span-2 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative aspect-video bg-neutral-950 border border-neutral-900 overflow-hidden group/image"
            >
              {/* Car Image */}
              <img
                src={chassisImage}
                alt={`Elite Ti ${activeChassis.toUpperCase()} Aero Showcase`}
                className="w-full h-full object-cover opacity-80 group-hover/image:opacity-85 transition-opacity duration-500"
              />

              {/* Grid layout markers */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

              {/* Interactive Hotspots */}
              {componentsList.map((component) => {
                const isActive = hoveredComponent === component.id || activeComponent === component.id;

                return (
                  <button
                    key={component.id}
                    className="absolute group z-20 cursor-pointer"
                    style={{ top: component.position.top, left: component.position.left }}
                    onMouseEnter={() => setHoveredComponent(component.id)}
                    onMouseLeave={() => setHoveredComponent(null)}
                    onClick={() => setActiveComponent(activeComponent === component.id ? null : component.id)}
                  >
                    <div className="relative flex items-center justify-center">
                      
                      {/* Outer pulsing ring */}
                      {!isActive && (
                        <div className="absolute w-8 h-8 rounded-full border border-[#c0f20c]/60 animate-ping pointer-events-none" />
                      )}

                      {/* Hotspot dot */}
                      <div 
                        className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-300 backdrop-blur-sm ${
                          isActive
                            ? 'bg-[#c0f20c] border-[#c0f20c] scale-110 shadow-[0_0_15px_rgba(192,242,12,0.8)]'
                            : 'bg-black/80 border-neutral-500 hover:border-[#c0f20c] hover:scale-110'
                        }`}
                      >
                        {isActive ? (
                          <X className="text-black w-3.5 h-3.5 stroke-[2.5]" />
                        ) : (
                          <Plus className="text-white group-hover:text-[#c0f20c] w-3.5 h-3.5 transition-colors stroke-[2]" />
                        )}
                      </div>

                      {/* Permanent line connecting to title when active or hovered */}
                      {isActive && (
                        <div className="absolute left-7 top-1/2 -translate-y-1/2 bg-[#c0f20c] text-black px-2 py-0.5 whitespace-nowrap shadow-2xl backdrop-blur-md z-30 rounded-none text-left border border-black font-display font-bold text-[9px] uppercase tracking-wider hidden md:block">
                          {component.name}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </motion.div>

            {/* Component Count & Labels */}
            <div className="mt-4 flex items-center justify-between border-b border-neutral-900 pb-3 font-mono text-[9px]">
              <div className="flex items-center gap-2 text-neutral-500">
                <span className="w-1.5 h-1.5 bg-[#c0f20c] rounded-full inline-block animate-ping" />
                <span>{activeChassis === '350z' ? 'NISSAN 350Z Z33 PROGRAM' : 'TOYOTA SUPRA JZA80 PROGRAM'}</span>
                <span className="text-neutral-700">|</span>
                <span>{componentsList.length} SCHEMATICS LOADED</span>
              </div>
              <p className="text-[#c0f20c] tracking-widest uppercase font-bold">
                HOVER SPEC SHEET OR HOTSPOTS TO DISCLOSE SPECS
              </p>
            </div>
          </div>

          {/* Right: Details Panel / Specification Board */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <AnimatePresence mode="wait">
                {activeData ? (
                  <motion.div
                    key={activeData.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="border border-neutral-900 border-t-2 border-t-[#c0f20c] bg-neutral-950 shadow-2xl overflow-hidden rounded-none text-left"
                  >
                    {/* Component Preview Image */}
                    <div className="aspect-video relative overflow-hidden bg-neutral-900 border-b border-neutral-950">
                      <img
                        src={activeData.image}
                        alt={activeData.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent pointer-events-none" />
                    </div>

                    {/* Details content */}
                    <div className="p-6 space-y-4">
                      <div>
                        <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest block">SELECTED SCHEMATIC</span>
                        <h3 className="text-xl font-display font-bold text-[#fafaf7] tracking-wider uppercase mt-1">
                          {activeData.name}
                        </h3>
                      </div>
                      
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-mono font-bold text-[#c0f20c]">
                          ${activeData.price.toLocaleString()}
                        </span>
                        <span className="text-neutral-500 text-[10px] font-mono uppercase tracking-widest">USD EXCL. TAX</span>
                      </div>
                      
                      <p className="text-neutral-400 text-xs leading-relaxed font-sans">
                        {activeData.description}
                      </p>

                      {/* Specs Checklist */}
                      <div className="bg-neutral-900/50 p-4 border border-neutral-900 space-y-3">
                        <span className="text-[9px] font-mono tracking-widest text-[#c0f20c] uppercase font-bold block">
                          COMPOSITE DATA METRICS
                        </span>
                        <div className="space-y-2">
                          {activeData.specs.map((spec, i) => (
                            <div key={i} className="flex items-start gap-2.5">
                              <div className="w-1.5 h-1.5 bg-[#c0f20c] shrink-0 mt-1" />
                              <span className="text-neutral-200 text-[11px] leading-tight font-sans">{spec}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* CTA Buttons */}
                      <div className="space-y-3 pt-2">
                        <button 
                          onClick={() => onAddToCart({ id: activeData.id, title: activeData.name, price: activeData.price, category: 'carbon' })}
                          className="w-full h-11 bg-[#c0f20c] hover:bg-[#aacc00] text-black font-mono text-[10px] tracking-widest uppercase font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer border-0"
                        >
                          <ShoppingCart className="w-3.5 h-3.5 stroke-[2]" />
                          ALLOCATE COMPONENT
                        </button>
                        <button 
                          onClick={() => setActiveComponent(null)}
                          className="w-full h-11 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white bg-transparent font-mono text-[9px] tracking-widest uppercase transition-colors cursor-pointer"
                        >
                          CLOSE SCHEMATIC OVERVIEW
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  /* Interactive Program Stats Card instead of empty box */
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border border-neutral-900 bg-neutral-950 p-6 shadow-2xl rounded-none text-left space-y-6"
                  >
                    <div>
                      <span className="font-mono text-[9px] text-[#c0f20c] uppercase tracking-widest block font-bold">PROGRAM METADATA</span>
                      <h3 className="text-lg font-display font-bold text-white uppercase tracking-wider mt-1">{activeChassis === '350z' ? 'Z33 AERO DIRECTORY' : 'JZA80 AERO DIRECTORY'}</h3>
                      <p className="text-neutral-300 text-[10px] font-sans mt-1 leading-relaxed">
                        Select a component from the list below or click an image hotspot to load technical data sheets.
                      </p>
                    </div>

                    {/* Interactive List */}
                    <div className="border-t border-b border-neutral-900 py-3 space-y-1.5">
                      {componentsList.map((comp) => {
                        const isHovered = hoveredComponent === comp.id;
                        return (
                          <div 
                            key={comp.id}
                            className={`flex justify-between items-center py-2 px-3 border border-transparent hover:border-neutral-900 hover:bg-neutral-900/40 cursor-pointer transition-all duration-200 ${isHovered ? 'bg-neutral-900/30 border-neutral-800' : ''}`}
                            onMouseEnter={() => setHoveredComponent(comp.id)}
                            onMouseLeave={() => setHoveredComponent(null)}
                            onClick={() => setActiveComponent(comp.id)}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className={`w-1.5 h-1.5 transition-colors ${isHovered ? 'bg-[#c0f20c]' : 'bg-neutral-500'}`} />
                              <span className={`text-[11px] font-mono transition-colors uppercase ${isHovered ? 'text-[#c0f20c] font-bold' : 'text-neutral-200'}`}>
                                {comp.name}
                              </span>
                            </div>
                            <span className="text-[11px] font-mono text-[#c0f20c] font-bold">
                              ${comp.price.toLocaleString()}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Chassis Program Telemetry Stats */}
                    <div className="bg-neutral-950 border border-neutral-900 p-4 space-y-3 font-mono text-[9px]">
                      <span className="text-neutral-400 uppercase tracking-widest block font-bold">CHASSIS TEST TELEMETRY</span>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-neutral-500 block uppercase">MATERIAL LEVEL</span>
                          <span className="text-white block uppercase font-bold mt-0.5">3K TWILL PREPREG</span>
                        </div>
                        <div>
                          <span className="text-neutral-500 block uppercase">CURING METHOD</span>
                          <span className="text-white block uppercase font-bold mt-0.5">AUTOCLAVE 120°C</span>
                        </div>
                        <div>
                          <span className="text-neutral-500 block uppercase">WEIGHT REDUCTION</span>
                          <span className="text-white block uppercase font-bold mt-0.5">{activeChassis === '350z' ? '-65.0 KG TOTAL' : '-55.0 KG TOTAL'}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500 block uppercase">DOWNFORCE (200KMH)</span>
                          <span className="text-white block uppercase font-bold mt-0.5">{activeChassis === '350z' ? '+160 KG RATING' : '+145 KG RATING'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Checkout CTA */}
                    <button 
                      onClick={() => onAddToCart({ id: activeChassis === '350z' ? 'z33-aero-kit' : 'supra-aero-kit', title: completeKitTitle, price: completeKitPrice, category: 'carbon' })}
                      className="w-full h-11 bg-neutral-900 hover:bg-[#c0f20c] text-white hover:text-black border border-neutral-800 hover:border-transparent font-mono text-[10px] tracking-widest uppercase font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ShoppingCart className="w-3.5 h-3.5 stroke-[2]" />
                      ALLOCATE COMPLETE AERO KIT (${completeKitPrice.toLocaleString()})
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>

        {/* Bottom Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 text-center"
        >
          <button 
            onClick={() => onAddToCart({ id: activeChassis === '350z' ? 'z33-aero-kit' : 'supra-aero-kit', title: completeKitTitle, price: completeKitPrice, category: 'carbon' })}
            className="border border-[#c0f20c]/60 hover:border-[#c0f20c] text-[#c0f20c] hover:bg-[#c0f20c] hover:text-black px-8 h-12 font-mono text-[10px] tracking-widest uppercase transition-all duration-300 font-bold bg-transparent cursor-pointer"
          >
            SHOP COMPLETE {activeChassis.toUpperCase()} AERO KIT &mdash; ${completeKitPrice.toLocaleString()}
          </button>
        </motion.div>

      </div>
    </section>
  );
};

// Simple helper to trigger a simulation or toast notification
const triggerAlert = (chassis: string) => {
  alert(`CHASSIS ALLOCATION RESERVED: The ${chassis.toUpperCase()} wind-tunnel and autoclaving specs are currently locked. Sign up for allocations alerts via our newsletter at the bottom of the page.`);
};
