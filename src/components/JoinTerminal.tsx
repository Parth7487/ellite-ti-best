import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  triggerToast: (msg: string) => void;
}

export default function JoinTerminal({ triggerToast }: Props) {
  const [email, setEmail] = useState("");
  const [stage, setStage] = useState<"idle" | "submitting" | "success">("idle");
  const [logs, setLogs] = useState<string[]>([]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStage("submitting");
    setLogs(["[INIT] Connecting to ETi Mainframe...", "[AUTH] Initiating handshake protocols..."]);

    // Simulate terminal logging steps
    const steps = [
      { delay: 400, log: "[DB] Querying database registry..." },
      { delay: 800, log: `[PENDING] Registering ${email.toUpperCase()}...` },
      { delay: 1200, log: "[SYS] Compiling profile credentials..." },
      { delay: 1600, log: "[SUCCESS] Access granted to chassis drops." },
      { delay: 1900, log: "[DONE] Registration complete." }
    ];

    steps.forEach((step) => {
      setTimeout(() => {
        setLogs((prev) => [...prev, step.log]);
      }, step.delay);
    });

    setTimeout(() => {
      setStage("success");
      triggerToast("✨ REGISTERED TO MAINMainframe!");
    }, 2200);
  };

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  return (
    <section className="w-full bg-black py-20 px-6 border-t border-neutral-900 font-mono">
      <div className="max-w-xl mx-auto">
        <div className="mb-4">
          <span className="text-[10px] tracking-[0.2em] text-emerald-500 uppercase px-2 py-0.5 border border-emerald-500/30 bg-emerald-500/10 rounded">
            Alternative Layout 008-A: CLI Terminal
          </span>
        </div>

        {/* Terminal Frame */}
        <div className="w-full bg-neutral-950 border border-emerald-500/30 rounded-lg shadow-[0_0_30px_rgba(16,185,129,0.03)] overflow-hidden">
          
          {/* Window Header */}
          <div className="flex justify-between items-center bg-neutral-900/50 px-4 py-2 border-b border-neutral-800">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-[9px] text-neutral-500">guest@eti-mainframe:~</span>
            <div className="w-12" /> {/* Spacer */}
          </div>

          {/* Window Body */}
          <div className="p-6 min-h-[220px] text-neutral-300 text-xs space-y-4">
            
            {stage === "idle" && (
              <>
                <p className="text-emerald-500">eti-core --join --list=elites</p>
                <div className="space-y-1">
                  <p className="text-neutral-400">Join the Elites.</p>
                  <p className="text-neutral-500">First access to chassis support, build logs, and drops.</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3 pt-2">
                  <div className="flex items-center gap-2 border-b border-neutral-800 pb-1 focus-within:border-emerald-500/60 transition-colors">
                    <span className="text-emerald-500 font-bold">&gt;</span>
                    <input 
                      type="email" 
                      placeholder="ENTER EMAIL ADDRESS..."
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-transparent border-none outline-none flex-1 text-white text-xs tracking-wider placeholder-neutral-600 font-mono uppercase"
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    className="self-start text-[10px] uppercase border border-emerald-500/30 hover:border-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/20 text-emerald-400 px-4 py-2 transition-all rounded"
                  >
                    Execute Registration
                  </button>
                </form>
              </>
            )}

            {stage === "submitting" && (
              <div className="space-y-1">
                {logs.map((log, idx) => (
                  <p key={idx} className="font-mono text-emerald-400/90">{log}</p>
                ))}
                <div ref={terminalEndRef} />
              </div>
            )}

            {stage === "success" && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4 text-center py-4"
              >
                <pre className="text-emerald-500 font-bold leading-none text-[8px] md:text-[10px] whitespace-pre select-none">
{`   ______   ______  ____  
  / ____/  /_  __/ /  _/  
 / __/      / /    / /    
/ /___     / /   _/ /     
/_____/    /_/   /___/     
Registry Saved Successfully.`}
                </pre>
                <div className="space-y-1">
                  <p className="text-emerald-400 uppercase font-bold">Registration Accepted.</p>
                  <p className="text-neutral-500 text-[10px]">Welcome to the Elites mainframe. Standby for dispatch.</p>
                </div>
                <button 
                  onClick={() => {
                    setEmail("");
                    setStage("idle");
                    setLogs([]);
                  }}
                  className="text-[9px] uppercase text-neutral-500 hover:text-white underline cursor-pointer"
                >
                  Register another address
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
