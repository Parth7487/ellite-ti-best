import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

interface TelemetryRowProps {
  label: string;
  value: string | number;
  unit?: string;
  status?: "nominal" | "warning" | "optimal";
}

function TelemetryRow({ label, value, unit = "", status = "nominal" }: TelemetryRowProps) {
  const statusColors = {
    nominal: "text-emerald-500",
    warning: "text-red-500 animate-pulse",
    optimal: "text-cyan-400"
  };

  return (
    <div className="flex justify-between items-center py-1.5 border-b border-neutral-900 font-mono text-xs">
      <span className="text-neutral-500 uppercase tracking-wider">{label}</span>
      <span className="flex items-center gap-1.5 font-bold">
        <span className={statusColors[status]}>{value}</span>
        {unit && <span className="text-[10px] text-neutral-600 uppercase">{unit}</span>}
      </span>
    </div>
  );
}

interface Props {
  onNavigate: () => void;
}

export default function MotorsportsTelemetry({ onNavigate }: Props) {
  // Telemetry state variables
  const [rpm, setRpm] = useState(7200);
  const [speed, setSpeed] = useState(242);
  const [gForceX, setGForceX] = useState(1.15);
  const [gForceY, setGForceY] = useState(-0.85);
  const [temp, setTemp] = useState(880); // Titanium exhaust temp in C
  const [downforce, setDownforce] = useState(380); // kg at 240km/h

  // Update telemetry values periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setRpm(Math.floor(7000 + Math.random() * 800));
      setSpeed(Math.floor(238 + Math.random() * 8));
      setGForceX(Number((1.0 + Math.random() * 0.4).toFixed(2)));
      setGForceY(Number((-0.6 - Math.random() * 0.4).toFixed(2)));
      setTemp(Math.floor(865 + Math.random() * 30));
      setDownforce(Math.floor(375 + Math.random() * 15));
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full bg-neutral-950 text-white py-24 border-t border-neutral-900 overflow-hidden font-sans">
      {/* Glare and scanlines overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] z-10"
        style={{
          backgroundImage: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))",
          backgroundSize: "100% 4px, 6px 100%"
        }}
      />

      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          
          {/* Left Block: Description & CTA */}
          <div className="w-full lg:w-5/12 space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] tracking-[0.2em] font-mono text-emerald-500 uppercase px-2 py-0.5 border border-emerald-500/30 bg-emerald-500/10 rounded inline-block">
                Alternative Layout 005-A: HUD Telemetry
              </span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight uppercase">
                ETi Motorsports.
              </h2>
            </div>
            
            <p className="text-neutral-400 text-sm leading-relaxed font-light">
              We prove our designs under genuine racing strain. The telemetry dashboard on the right showcases real-time dynamic track loads of our aerodynamic profiles and titanium exhaust assemblies, tested on formula circuits globally.
            </p>

            <p className="text-neutral-500 text-xs font-mono">
              SYSTEM STATUS: CALIBRATED / ONLINE // VER. 4.98
            </p>

            <div>
              <button 
                onClick={onNavigate}
                className="group flex items-center gap-2 border border-emerald-500/40 hover:border-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/20 text-emerald-400 font-mono text-xs uppercase px-6 py-3 transition-all duration-300 rounded shadow-[0_0_15px_rgba(16,185,129,0.05)] hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
              >
                Enter the Program
                <span className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
              </button>
            </div>
          </div>

          {/* Right Block: Telemetry UI Console */}
          <div className="w-full lg:w-7/12">
            <div className="border border-neutral-900 bg-neutral-950 p-6 rounded-lg relative overflow-hidden shadow-2xl">
              {/* Decorative Corner Tabs */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-emerald-500" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-emerald-500" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-emerald-500" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-emerald-500" />

              {/* HUD Header */}
              <div className="flex justify-between items-center border-b border-neutral-900 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase">
                    ETI TELEMETRY LOG [LIVE]
                  </span>
                </div>
                <span className="text-[9px] font-mono text-neutral-600">
                  REFRESH RATE: 6.6Hz
                </span>
              </div>

              {/* HUD Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Left Column stats */}
                <div className="space-y-4">
                  <div className="bg-neutral-900/30 p-4 border border-neutral-900/50 rounded">
                    <span className="text-[9px] font-mono text-neutral-500 block uppercase mb-1">
                      RPM Counter
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-mono font-bold text-white tracking-tight">
                        {rpm}
                      </span>
                      <span className="text-xs font-mono text-emerald-500">RPM</span>
                    </div>
                    {/* RPM Bar */}
                    <div className="w-full h-1.5 bg-neutral-900 rounded-full mt-2 overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-red-500"
                        style={{ width: `${(rpm / 9000) * 100}%` }}
                        transition={{ type: "spring", stiffness: 300 }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <TelemetryRow label="Velocity" value={speed} unit="km/h" status="optimal" />
                    <TelemetryRow label="Downforce Load" value={downforce} unit="kg" />
                    <TelemetryRow label="Exhaust Temp" value={`${temp}°`} unit="C" status={temp > 890 ? "warning" : "nominal"} />
                    <TelemetryRow label="DRS Valve" value="ACTIVE" status="optimal" />
                  </div>
                </div>

                {/* Right Column: G-force grid & other data */}
                <div className="space-y-4">
                  {/* G-Force Map */}
                  <div className="bg-neutral-900/30 border border-neutral-900/50 p-4 rounded flex flex-col items-center justify-center">
                    <span className="text-[9px] font-mono text-neutral-500 block uppercase mb-3 self-start">
                      G-Force Coordinates
                    </span>
                    <div className="relative w-32 h-32 border border-neutral-800 rounded-full flex items-center justify-center">
                      {/* Grid Lines */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-[1px] bg-neutral-900" />
                        <div className="h-full w-[1px] bg-neutral-900" />
                      </div>
                      
                      {/* Target dot representing G-Force */}
                      <motion.div 
                        className="absolute w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                        style={{
                          x: gForceX * 25,
                          y: gForceY * 25
                        }}
                        transition={{ type: "spring", damping: 12, stiffness: 200 }}
                      />
                      
                      {/* Concentric rings */}
                      <div className="absolute w-20 h-20 border border-neutral-900/50 rounded-full" />
                      <div className="absolute w-10 h-10 border border-neutral-900/30 rounded-full" />
                    </div>

                    <div className="flex gap-4 mt-3 font-mono text-[10px] text-neutral-400">
                      <span>LAT: <strong className="text-white">{gForceX}G</strong></span>
                      <span>LNG: <strong className="text-white">{gForceY}G</strong></span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Status Message Footer */}
              <div className="mt-6 pt-4 border-t border-neutral-900 flex flex-wrap gap-4 text-[10px] font-mono text-neutral-500">
                <div>CHASSIS SYNC: <span className="text-emerald-500">100% OK</span></div>
                <div>EXHAUST TYPE: <span className="text-cyan-400">TI-FULL RACE</span></div>
                <div>AERO CONFIG: <span className="text-white">STAGE 3 SPEC</span></div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
