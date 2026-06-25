import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Phone, Mail, MessageSquare } from 'lucide-react';
import createGlobe from 'cobe';

interface Store {
  id: string;
  country: string;
  city: string;
  address: string[];
  contact: string[];
  coords: { lat: number; lon: number; textAnchor?: 'start' | 'end' };
  type: 'atelier' | 'dealer';
}

const storesData: Store[] = [
  // Ateliers (Green)
  {
    id: 'us',
    country: 'UNITED STATES',
    city: 'Elburn, Illinois',
    address: ['41W972 Compton Hills Rd', 'Elburn, IL 60119', 'United States'],
    contact: ['+1 682 332 2322', 'NATE@MYELITETI.COM'],
    coords: { lat: 41.89, lon: -88.47, textAnchor: 'start' },
    type: 'atelier'
  },
  {
    id: 'th',
    country: 'THAILAND',
    city: 'Thung Khru, Bangkok',
    address: ['136/5 Charoen Suk Alley', 'Thung Khru, Bangkok', '10140'],
    contact: ['+66 8624484553 (WhatsApp)', 'NATE@MYELITETI.COM'],
    coords: { lat: 13.75, lon: 100.50, textAnchor: 'end' },
    type: 'atelier'
  },
  {
    id: 'hk',
    country: 'HONG KONG',
    city: 'Central, Hong Kong',
    address: ['Suite C, Level 7, World Trust Tower', '58 Stanley Street, Central', 'Hong Kong'],
    contact: ['NATE@MYELITETI.COM'],
    coords: { lat: 22.32, lon: 114.17, textAnchor: 'start' },
    type: 'atelier'
  },
  
  // Dealers (Blue)
  {
    id: 'dealer-jp',
    country: 'JAPAN',
    city: 'Tokyo Prefecture',
    address: ['Authorized JDM Distribution Partner', 'Shibuya-ku, Tokyo, Japan'],
    contact: ['DEALERS@MYELITETI.COM'],
    coords: { lat: 35.68, lon: 139.76, textAnchor: 'start' },
    type: 'dealer'
  },
  {
    id: 'dealer-uk',
    country: 'UNITED KINGDOM',
    city: 'Greater London',
    address: ['Authorized UK Distribution Partner', 'London, United Kingdom'],
    contact: ['DEALERS@MYELITETI.COM'],
    coords: { lat: 51.51, lon: -0.13, textAnchor: 'end' },
    type: 'dealer'
  },
  {
    id: 'dealer-de',
    country: 'GERMANY',
    city: 'Nürburg, Rhineland-Palatinate',
    address: ['Authorized European Distribution Partner', 'Nürburg, Germany'],
    contact: ['DEALERS@MYELITETI.COM'],
    coords: { lat: 50.36, lon: 6.95, textAnchor: 'start' },
    type: 'dealer'
  },
  {
    id: 'dealer-ca',
    country: 'CANADA',
    city: 'Vancouver, British Columbia',
    address: ['Authorized North America Partner', 'Vancouver, BC, Canada'],
    contact: ['DEALERS@MYELITETI.COM'],
    coords: { lat: 49.28, lon: -123.12, textAnchor: 'start' },
    type: 'dealer'
  },
  {
    id: 'dealer-au',
    country: 'AUSTRALIA',
    city: 'Sydney, New South Wales',
    address: ['Authorized Oceania Distribution Partner', 'Sydney, NSW, Australia'],
    contact: ['DEALERS@MYELITETI.COM'],
    coords: { lat: -33.87, lon: 151.21, textAnchor: 'end' },
    type: 'dealer'
  }
];

// Initialize marker data for COBE
const markers = storesData.map((s) => ({
  location: [s.coords.lat, s.coords.lon] as [number, number],
  size: 0.03,
  id: s.id,
  color: s.type === 'atelier'
    ? [0.753, 0.949, 0.047] as [number, number, number]
    : [0.0, 0.941, 1.0] as [number, number, number],
}));// Helper function to project geographic coordinates to 2D screen coordinates on the Cobe canvas
const getProjectedCoords = (
  lat: number,
  lon: number,
  phi: number,
  theta: number
) => {
  const rLat = (lat * Math.PI) / 180;
  const rLon = (lon * Math.PI) / 180 - Math.PI;

  const cosLat = Math.cos(rLat);
  const sinLat = Math.sin(rLat);
  const cosLon = Math.cos(rLon);
  const sinLon = Math.sin(rLon);

  // Convert to 3D Cartesian coordinates
  const ux = -cosLat * cosLon;
  const uy = sinLat;
  const uz = cosLat * sinLon;

  // Scale by Cobe sphere radius (0.8) + marker elevation (0.05)
  const scale = 0.85;
  const tX = ux * scale;
  const tY = uy * scale;
  const tZ = uz * scale;

  const cosTheta = Math.cos(theta);
  const sinTheta = Math.sin(theta);
  const cosPhi = Math.cos(phi);
  const sinPhi = Math.sin(phi);

  // Project using rotation matrices
  const c = cosPhi * tX + sinPhi * tZ;
  const s = sinPhi * sinTheta * tX + cosTheta * tY - cosPhi * sinTheta * tZ;

  const x = (c + 1) / 2;
  const y = (-s + 1) / 2;

  // Check Z depth for front/back face visibility
  const depth = -sinPhi * cosTheta * tX + sinTheta * tY + cosPhi * cosTheta * tZ;
  const visible = depth >= 0.08;

  return { x, y, visible };
};

export const StoreMap: React.FC = () => {
  const [activeStore, setActiveStore] = useState<string | null>(null);
  const [hoveredStore, setHoveredStore] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1.0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<any>(null);

  // References to keep state values accessible in the animate loop without re-running useEffect
  const activeStoreRef = useRef<string | null>(null);
  const hoveredStoreRef = useRef<string | null>(null);

  // Rotations (phi & theta)
  const rotationXRef = useRef<number>(0.2); // Initial tilt theta
  const rotationYRef = useRef<number>(2.5); // Initial rotation phi
  const isDraggingRef = useRef<boolean>(false);
  const isAutoRotatingRef = useRef<boolean>(true);
  const isCenteringRef = useRef<boolean>(false);
  const dragStartXRef = useRef<number>(0);
  const dragStartYRef = useRef<number>(0);
  const dragStartRotXRef = useRef<number>(0);
  const dragStartRotYRef = useRef<number>(0);

  useEffect(() => {
    activeStoreRef.current = activeStore;
    if (activeStore !== null) {
      isCenteringRef.current = true;
      isAutoRotatingRef.current = false;
    }
  }, [activeStore]);

  useEffect(() => {
    hoveredStoreRef.current = hoveredStore;
  }, [hoveredStore]);

  const activeData = storesData.find(s => s.id === activeStore);

  // Initialize COBE Globe
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    let globe: any = null;
    let animationFrameId: number;
    let resizeObserver: ResizeObserver | null = null;

    const initGlobe = (width: number) => {
      if (globe) {
        globe.destroy();
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      
      globe = createGlobe(canvas, {
        devicePixelRatio: dpr,
        width: width * dpr,
        height: width * dpr,
        phi: rotationYRef.current,
        theta: rotationXRef.current,
        dark: 0,
        diffuse: 1.5,
        mapSamples: 16000,
        mapBrightness: 10,
        baseColor: [1, 1, 1],
        markerColor: [0.753, 0.949, 0.047],
        glowColor: [0.94, 0.93, 0.91],
        markerElevation: 0.05,
        markers: storesData.map((s) => ({
          location: [s.coords.lat, s.coords.lon] as [number, number],
          size: (activeStoreRef.current === s.id || hoveredStoreRef.current === s.id) ? 0.05 : 0.03,
          id: s.id,
          color: s.type === 'atelier'
            ? [0.753, 0.949, 0.047] as [number, number, number]
            : [0.0, 0.941, 1.0] as [number, number, number],
        })),
      });

      globeRef.current = globe;
    };

    // Initialize with a ResizeObserver once container size is set
    resizeObserver = new ResizeObserver((entries) => {
      if (entries[0] && canvas) {
        const newWidth = entries[0].contentRect.width;
        if (newWidth > 0) {
          canvas.style.width = '100%';
          canvas.style.height = '100%';
          // Only initialize or re-initialize if globe doesn't exist
          if (!globe) {
            initGlobe(newWidth);
          }
        }
      }
    });
    
    resizeObserver.observe(canvas);

    const animate = () => {
      if (!globe) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      const currentActive = activeStoreRef.current;
      const currentHovered = hoveredStoreRef.current;

      const dynamicMarkers = storesData.map((s) => ({
        location: [s.coords.lat, s.coords.lon] as [number, number],
        size: (currentActive === s.id || currentHovered === s.id) ? 0.05 : 0.03,
        id: s.id,
        color: s.type === 'atelier'
          ? [0.753, 0.949, 0.047] as [number, number, number]
          : [0.0, 0.941, 1.0] as [number, number, number],
      }));

      if (isDraggingRef.current) {
        globe.update({
          phi: rotationYRef.current,
          theta: rotationXRef.current,
          markers: dynamicMarkers
        });
      } else {
        const targetStore = isCenteringRef.current
          ? storesData.find(s => s.id === currentActive)
          : null;
        if (targetStore) {
          const targetRotY = - (targetStore.coords.lon * Math.PI / 180);
          const targetRotX = (targetStore.coords.lat * Math.PI / 180);

          let diffY = targetRotY - rotationYRef.current;
          diffY = Math.atan2(Math.sin(diffY), Math.cos(diffY));

          rotationYRef.current += diffY * 0.05;
          rotationXRef.current += (targetRotX - rotationXRef.current) * 0.05;
        } else {
          if (isAutoRotatingRef.current) {
            rotationYRef.current += 0.0015;
          }
        }
        globe.update({
          phi: rotationYRef.current,
          theta: rotationXRef.current,
          markers: dynamicMarkers
        });
      }

      // Update projected screen coordinates for HTML overlay indicators
      storesData.forEach((s) => {
        const coords = getProjectedCoords(s.coords.lat, s.coords.lon, rotationYRef.current, rotationXRef.current);
        const markerEl = containerRef.current?.querySelector(`[data-marker-id="${s.id}"]`) as HTMLElement;
        if (markerEl) {
          markerEl.style.left = `${coords.x * 100}%`;
          markerEl.style.top = `${coords.y * 100}%`;
          
          if (coords.visible) {
            markerEl.style.opacity = '1';
            markerEl.style.pointerEvents = 'auto';
            markerEl.style.filter = 'none';
          } else {
            markerEl.style.opacity = '0';
            markerEl.style.pointerEvents = 'none';
            markerEl.style.filter = 'blur(8px)';
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Fade in canvas
    setTimeout(() => {
      if (canvas) {
        canvas.style.opacity = '1';
      }
    }, 100);

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      cancelAnimationFrame(animationFrameId);
      if (globe) {
        globe.destroy();
      }
    };
  }, []);

  // Hook up wheel listener to prevent default page scrolling while zooming the globe
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const handleWheelEvent = (e: WheelEvent) => {
      e.preventDefault();
      setZoom(prev => Math.max(0.7, Math.min(1.7, prev + e.deltaY * 0.001)));
    };
    
    canvas.addEventListener('wheel', handleWheelEvent, { passive: false });
    return () => {
      canvas.removeEventListener('wheel', handleWheelEvent);
    };
  }, []);

  // Pointer Drag Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    isAutoRotatingRef.current = false;
    isCenteringRef.current = false;
    dragStartXRef.current = e.clientX;
    dragStartYRef.current = e.clientY;
    dragStartRotXRef.current = rotationXRef.current;
    dragStartRotYRef.current = rotationYRef.current;
    e.currentTarget.style.cursor = 'grabbing';
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isDraggingRef.current) {
      const deltaX = e.clientX - dragStartXRef.current;
      const deltaY = e.clientY - dragStartYRef.current;
      
      rotationYRef.current = dragStartRotYRef.current + deltaX * 0.005;
      rotationXRef.current = Math.max(-0.6, Math.min(0.6, dragStartRotXRef.current + deltaY * 0.005));
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = false;
    e.currentTarget.style.cursor = 'grab';
    if (activeStore === null) {
      isAutoRotatingRef.current = true;
    }
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = false;
    e.currentTarget.style.cursor = 'grab';
    if (activeStore === null) {
      isAutoRotatingRef.current = true;
    }
  };

  return (
    <div className="w-full bg-[#070708] border-t border-neutral-900 pt-16 pb-10 relative overflow-hidden">
      {/* Dynamic pulse keyframe styles */}
      <style>{`
        @keyframes cobe-pulse {
          0% {
            transform: scale(0.9) translate3d(-50%, -50%, 0);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.4) translate3d(-50%, -50%, 0);
            opacity: 0.2;
          }
          100% {
            transform: scale(0.9) translate3d(-50%, -50%, 0);
            opacity: 0.8;
          }
        }
      `}</style>

      {/* Grid overlay background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, #fff 40px, #fff 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, #fff 40px, #fff 41px)',
          }} 
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header */}
        <div className="mb-10 text-left">
          <span className="font-mono text-[9px] tracking-[0.3em] text-[#c0f20c] uppercase font-bold block mb-2">
            004 &mdash; GLOBAL ATELIER NETWORK
          </span>
          <h3 className="font-display font-bold text-2xl md:text-3xl uppercase tracking-[0.2em] text-[#fafaf7]">
            OUR LOCATIONS
          </h3>
          <p className="text-neutral-500 max-w-xl text-[11px] leading-relaxed font-sans mt-2 uppercase tracking-wide">
            Elite Ti carbon composite and grade 5 titanium components are distributed through our core JDM distribution centers.
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
          
          {/* Left Column: Interactive Globe */}
          <div className="lg:col-span-2 relative bg-black/40 border border-neutral-900 p-4 md:p-8 backdrop-blur-sm flex items-center justify-center min-h-[460px] overflow-hidden">
            <div 
              ref={containerRef}
              className="relative w-full max-w-[460px] aspect-square flex items-center justify-center"
              style={{
                transform: `scale(${zoom})`,
                transition: 'transform 0.1s ease-out',
              }}
            >
              <canvas
                ref={canvasRef}
                className="w-full h-full cursor-grab active:cursor-grabbing select-none"
                style={{
                  opacity: 0,
                  transition: 'opacity 1.2s ease',
                  borderRadius: '50%',
                  touchAction: 'none',
                }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerLeave}
              />

              {/* Render anchored marker dots and labels on the canvas */}
              {storesData.map((s) => {
                const isActive = activeStore === s.id || hoveredStore === s.id;
                const color = s.type === 'atelier' ? '#c0f20c' : '#00f0ff';
                return (
                  <div
                    key={s.id}
                    data-marker-id={s.id}
                    className="absolute select-none pointer-events-none"
                    style={{
                      left: "50%",
                      top: "50%",
                      transform: "translate3d(-50%, -50%, 0)",
                      zIndex: 30,
                      opacity: 0,
                      transition: "opacity 0.3s ease",
                    }}
                  >
                    {/* Interactive Clickable Marker Hitbox */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        if (activeStore === s.id) {
                          setActiveStore(null);
                          isCenteringRef.current = false;
                          isAutoRotatingRef.current = true;
                        } else {
                          setActiveStore(s.id);
                          isCenteringRef.current = true;
                          isAutoRotatingRef.current = false;
                        }
                      }}
                      onMouseEnter={() => setHoveredStore(s.id)}
                      onMouseLeave={() => setHoveredStore(null)}
                      className="cursor-pointer pointer-events-auto"
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate3d(-50%, -50%, 0)",
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        backgroundColor: "transparent",
                      }}
                    />

                    {/* Pulsing ring on the globe */}
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: isActive ? "translate3d(-50%, -50%, 0) scale(1.2)" : "translate3d(-50%, -50%, 0) scale(1)",
                        width: isActive ? "20px" : "10px",
                        height: isActive ? "20px" : "10px",
                        borderRadius: "50%",
                        border: `1.5px solid ${color}`,
                        backgroundColor: isActive ? `${color}22` : "transparent",
                        pointerEvents: "none",
                        transition: "width 0.3s, height 0.3s, background-color 0.3s, transform 0.3s",
                      }}
                    />
                    
                    {/* The label */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        if (activeStore === s.id) {
                          setActiveStore(null);
                          isCenteringRef.current = false;
                          isAutoRotatingRef.current = true;
                        } else {
                          setActiveStore(s.id);
                          isCenteringRef.current = true;
                          isAutoRotatingRef.current = false;
                        }
                      }}
                      onMouseEnter={() => setHoveredStore(s.id)}
                      onMouseLeave={() => setHoveredStore(null)}
                      style={{
                        position: "absolute",
                        bottom: "100%",
                        left: "50%",
                        transform: "translate3d(-50%, 0, 0)",
                        marginBottom: isActive ? 12 : 8,
                        padding: "2px 6px",
                        background: "rgba(7, 7, 8, 0.95)",
                        border: `1px solid ${isActive ? color : "rgba(255, 255, 255, 0.15)"}`,
                        color: isActive ? "#ffffff" : "#9e9ea6",
                        fontFamily: "monospace",
                        fontSize: "8px",
                        fontWeight: "bold",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        whiteSpace: "nowrap",
                        pointerEvents: "auto",
                        cursor: "pointer",
                        transition: "border-color 0.3s, margin-bottom 0.3s",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                      }}
                    >
                      {s.country}
                      <span
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: "50%",
                          transform: "translate3d(-50%, -1px, 0)",
                          border: "4px solid transparent",
                          borderTopColor: isActive ? color : "rgba(255, 255, 255, 0.15)",
                          transition: "border-top-color 0.3s",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom floating info capsule */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 border border-neutral-800 px-4 py-1.5 rounded-full font-mono text-[9px] text-neutral-450 tracking-widest pointer-events-none select-none flex items-center gap-1.5 backdrop-blur-sm">
              <span>DRAG TO ROTATE</span>
              <span className="text-neutral-700 font-bold">•</span>
              <span>SCROLL TO ZOOM</span>
            </div>
          </div>

          {/* Right Column: Address Detail Sheet */}
          <div className="lg:col-span-1 h-full flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {activeData ? (
                <motion.div
                  key={activeData.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-black/50 border border-neutral-900 border-t-2 p-6 text-left space-y-5 backdrop-blur-md"
                  style={{ borderTopColor: activeData.type === 'atelier' ? '#c0f20c' : '#00f0ff' }}
                >
                  <div>
                    <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest block font-bold">
                      {activeData.type === 'atelier' ? 'ACTIVE STORE REGION' : 'AUTHORIZED JDM DEALER'}
                    </span>
                    <h4 className="text-lg font-display font-bold text-white uppercase tracking-wider mt-1">
                      {activeData.country}
                    </h4>
                    <span 
                      className="font-mono text-[10px] uppercase tracking-wider block mt-0.5"
                      style={{ color: activeData.type === 'atelier' ? '#c0f20c' : '#00f0ff' }}
                    >
                      {activeData.city}
                    </span>
                  </div>

                  <div className="space-y-2 border-t border-b border-neutral-900 py-4 font-mono text-[11px] text-neutral-400">
                    <div className="flex gap-3 items-start">
                      <MapPin 
                        className="w-4 h-4 shrink-0 mt-0.5" 
                        style={{ color: activeData.type === 'atelier' ? '#c0f20c' : '#00f0ff' }}
                      />
                      <div>
                        {activeData.address.map((line, i) => (
                          <div key={i}>{line}</div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 font-mono text-[11px] text-neutral-400">
                    {activeData.contact.map((contactLine, i) => (
                      <div key={i} className="flex gap-3 items-center">
                        {contactLine.includes('@') ? (
                          <Mail className="w-4 h-4" style={{ color: activeData.type === 'atelier' ? '#c0f20c' : '#00f0ff' }} />
                        ) : contactLine.includes('WhatsApp') ? (
                          <MessageSquare className="w-4 h-4" style={{ color: activeData.type === 'atelier' ? '#c0f20c' : '#00f0ff' }} />
                        ) : (
                          <Phone className="w-4 h-4" style={{ color: activeData.type === 'atelier' ? '#c0f20c' : '#00f0ff' }} />
                        )}
                        <span>{contactLine}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setActiveStore(null);
                      isCenteringRef.current = false;
                      isAutoRotatingRef.current = true;
                    }}
                    className="w-full py-2.5 border border-neutral-800 hover:border-neutral-700 text-neutral-450 hover:text-white bg-transparent font-mono text-[9px] tracking-widest uppercase transition-colors cursor-pointer"
                  >
                    RESET MAP FOCUS
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-black/20 border border-neutral-900 p-6 text-left space-y-4"
                >
                  <span className="font-mono text-[9px] text-[#c0f20c] uppercase tracking-widest block font-bold">ATELIER DIRECTORY</span>
                  <h4 className="text-base font-display font-bold text-white uppercase tracking-wider">
                    GLOBAL OFFICE DIRECTORY
                  </h4>
                  <p className="text-neutral-400 font-sans text-[11px] leading-relaxed">
                    Hover or click a store location dot on the scanline world map to display regional physical addresses, phone lines, and direct email contacts.
                  </p>
                  
                  <div className="space-y-4 border-t border-neutral-900 pt-4">
                    <div>
                      <span className="font-mono text-[8px] text-neutral-600 uppercase tracking-widest block mb-1">CORE ATELIERS</span>
                      <div className="space-y-1 font-mono text-[9px] text-neutral-500">
                        {storesData.filter(s => s.type === 'atelier').map(s => {
                          const isHovered = hoveredStore === s.id || activeStore === s.id;
                          return (
                            <div 
                              key={s.id} 
                              className={`flex justify-between items-center py-0.5 cursor-pointer transition-colors ${isHovered ? 'text-white font-bold' : 'text-neutral-400 hover:text-white'}`}
                              onMouseEnter={() => setHoveredStore(s.id)}
                              onMouseLeave={() => setHoveredStore(null)}
                              onClick={() => {
                                if (activeStore === s.id) {
                                  setActiveStore(null);
                                  isCenteringRef.current = false;
                                  isAutoRotatingRef.current = true;
                                } else {
                                  setActiveStore(s.id);
                                  isCenteringRef.current = true;
                                  isAutoRotatingRef.current = false;
                                }
                              }}
                            >
                              <span>{s.city.split(',')[0].toUpperCase()}</span>
                              <span className="text-[#c0f20c] font-bold">{s.country}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <span className="font-mono text-[8px] text-neutral-600 uppercase tracking-widest block mb-1">OFFICIAL DEALERS</span>
                      <div className="space-y-1 font-mono text-[9px] text-neutral-500">
                        {storesData.filter(s => s.type === 'dealer').map(s => {
                          const isHovered = hoveredStore === s.id || activeStore === s.id;
                          return (
                            <div 
                              key={s.id} 
                              className={`flex justify-between items-center py-0.5 cursor-pointer transition-colors ${isHovered ? 'text-white font-bold' : 'text-neutral-450 hover:text-white'}`}
                              onMouseEnter={() => setHoveredStore(s.id)}
                              onMouseLeave={() => setHoveredStore(null)}
                              onClick={() => {
                                if (activeStore === s.id) {
                                  setActiveStore(null);
                                  isCenteringRef.current = false;
                                  isAutoRotatingRef.current = true;
                                } else {
                                  setActiveStore(s.id);
                                  isCenteringRef.current = true;
                                  isAutoRotatingRef.current = false;
                                }
                              }}
                            >
                              <span>{s.city.split(',')[0].toUpperCase()}</span>
                              <span className="text-[#00f0ff] font-bold">{s.country}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </div>
  );
};

