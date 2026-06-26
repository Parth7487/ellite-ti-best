import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

interface JoinVortexProps {
  triggerToast: (msg: string) => void;
}

export default function JoinVortex({ triggerToast }: JoinVortexProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !sectionRef.current) return;

    const container = containerRef.current;
    const section = sectionRef.current;

    // --- Three.js WebGL Particle Vortex ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const particleCount = 2000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const radius = Math.random() * 40 + 5;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 60;

      positions[i3] = Math.cos(theta) * radius;
      positions[i3 + 1] = y;
      positions[i3 + 2] = Math.sin(theta) * radius;
      sizes[i] = Math.random() * 2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(0x88929c) }, // Titanium Silver
        color2: { value: new THREE.Color(0xc0f20c) }, // JDM Lime Green (matches website theme)
      },
      vertexShader: `
        uniform float time;
        attribute float size;
        varying vec3 vPos;
        void main() {
            vPos = position;
            vec3 pos = position;
            pos.x += sin(time * 2.0 + position.y * 0.1) * 2.0;
            pos.z += cos(time * 1.5 + position.y * 0.1) * 2.0;
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = size * (30.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vPos;
        uniform vec3 color1;
        uniform vec3 color2;
        void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            
            float mixVal = (vPos.y + 30.0) / 60.0;
            vec3 finalColor = mix(color1, color2, clamp(mixVal, 0.0, 1.0) * 0.5);
            
            float alpha = 1.0 - (dist * 2.0);
            gl_FragColor = vec4(finalColor, alpha * 0.6);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    particles.rotation.x = Math.PI / 4;
    particles.rotation.z = Math.PI / 8;
    scene.add(particles);

    let mouseX = 0;
    let targetX = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    };

    section.addEventListener('mousemove', handleMouseMove);
    const resetMouse = () => {
      mouseX = 0;
    };
    section.addEventListener('mouseleave', resetMouse);

    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      material.uniforms.time.value = elapsedTime;
      particles.rotation.y = elapsedTime * 0.05;

      targetX = mouseX * 0.2;
      particles.rotation.y += (targetX - particles.rotation.y) * 0.05;
      camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };
    animate();


    const revealElements = section.querySelectorAll('.gsap-reveal');
    const fadeElements = section.querySelectorAll('.gsap-fade');
    const formElement = section.querySelector('.gsap-form');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.fromTo(
      revealElements,
      { y: 100, rotation: 5, opacity: 0 },
      { y: 0, rotation: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power4.out' }
    )
      .fromTo(
        fadeElements,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' },
        '-=0.4'
      )
      .fromTo(
        formElement,
        { opacity: 0, y: 20, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'back.out(1.2)' },
        '-=0.4'
      );

    // Resize handler
    const resizeObserver = new ResizeObserver(() => {
      if (container.clientWidth && container.clientHeight) {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      }
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      section.removeEventListener('mousemove', handleMouseMove);
      section.removeEventListener('mouseleave', resetMouse);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      triggerToast("✨ Connect request initialized successfully!");

      setTimeout(() => {
        setEmail('');
        setIsSubmitted(false);
      }, 4000);
    }, 1500);
  };

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full border-y border-neutral-900 bg-[#070708] overflow-hidden py-16 md:py-24 text-left" 
      id="join-section"
    >
      {/* Carbon Fiber Background styling */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundColor: '#050505',
          backgroundImage: 'radial-gradient(circle at 50% 50%, transparent 10%, #030303 90%), url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 16 16\'%3E%3Cpath fill=\'%230f0f0f\' d=\'M0 0h8v8H0z\'/%3E%3Cpath fill=\'%23080808\' d=\'M8 8h8v8H8z\'/%3E%3Cpath fill=\'%23141414\' d=\'M0 8h8v8H0z\'/%3E%3Cpath fill=\'%230a0a0a\' d=\'M8 0h8v8H0z\'/%3E%3Cpath fill=\'%23222\' d=\'M0 4h16v1H0zM0 12h16v1H0z\' opacity=\'.15\'/%3E%3Cpath fill=\'%23000\' d=\'M4 0v16h1V0zM12 0v16h1V0z\' opacity=\'.25\'/%3E%3C/svg%3E")',
          backgroundSize: '100% 100%, 16px 16px',
        }}
      />

      {/* Metallic sweep element */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none opacity-20"
        style={{
          background: 'linear-gradient(105deg, transparent 20%, rgba(255, 255, 255, 0.08) 25%, transparent 30%)',
          backgroundSize: '200% 100%',
          animation: 'sweep 8s infinite linear',
        }}
      />
      <style>{`
        @keyframes sweep {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      {/* WebGL Scoped Canvas wrapper */}
      <div 
        className="absolute top-0 left-0 w-full h-full z-20 pointer-events-none overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
        }}
      >
        <div ref={containerRef} className="w-full h-full" />
      </div>

      {/* Digital noise overlay */}
      <div 
        className="absolute inset-0 z-30 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
        }}
      />


      {/* Main Grid Content */}
      <div className="relative z-50 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
        
        {/* Left column JDM Typography */}
        <div className="w-full lg:w-auto flex flex-col gap-3 shrink-0">
          <div className="flex items-center gap-3 text-[#c0f20c] font-mono text-[10px] tracking-[0.25em] uppercase opacity-85">
            <span className="w-1.5 h-1.5 bg-[#c0f20c] rounded-full animate-pulse"></span>
            <span className="gsap-fade">SYS.JOIN_PROTOCOL</span>
          </div>
          
          <h2 className="font-display font-black text-white tracking-wider leading-none text-4xl md:text-5xl lg:text-6xl flex flex-col uppercase">
            <div className="overflow-hidden pb-1">
              <span className="gsap-reveal inline-block">Join the</span>
            </div>
            <div className="overflow-hidden pb-1 -mt-1 md:-mt-2">
              <span className="gsap-reveal inline-block text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-300 to-neutral-600">
                Elites.
              </span>
            </div>
          </h2>
        </div>

        {/* Right column Form Customizer */}
        <div className="w-full lg:max-w-xl flex flex-col gap-6 xl:ml-auto">
          <p className="text-neutral-400 text-xs md:text-sm font-mono uppercase tracking-widest leading-relaxed gsap-fade">
            Exclusive chassis support, telemetry updates, and motorsport priority allocations. <span className="text-[#c0f20c]">No spam.</span>
          </p>

          <form onSubmit={handleSubmit} className="w-full gsap-form">
            <div className="relative flex items-center bg-white/[0.015] border border-neutral-900 focus-within:border-[#c0f20c]/40 focus-within:bg-white/[0.03] rounded transition-all duration-300 overflow-hidden pr-2">
              <input 
                ref={emailRef}
                type="email" 
                required
                disabled={isSubmitting || isSubmitted}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="INITIALIZE: your@email.com" 
                className="bg-transparent border-0 text-white text-xs md:text-sm px-5 py-4 w-full focus:outline-none font-mono tracking-wide placeholder-neutral-700"
              />
              
              <button 
                type="submit" 
                disabled={isSubmitting || isSubmitted}
                className="bg-transparent border-0 p-2 cursor-pointer flex items-center justify-center relative group min-w-[40px] h-[40px]"
                aria-label="Subscribe"
              >
                {/* Button background animates */}
                <div 
                  className="absolute inset-0 bg-[#c0f20c] rounded transition-transform duration-500 ease-out origin-right scale-x-0 group-hover:scale-x-100" 
                  style={{ zIndex: 0 }}
                />

                {isSubmitting ? (
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin relative z-10" />
                ) : isSubmitted ? (
                  <svg className="w-4 h-4 text-black relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                  </svg>
                ) : (
                  <svg 
                    className="w-4 h-4 text-[#c0f20c] group-hover:text-black transition-colors duration-300 relative z-10" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                )}
              </button>
            </div>
            
            {/* Feedback Message */}
            <div 
              className={`mt-3 text-[#c0f20c] font-mono text-[10px] tracking-widest transition-all duration-500 overflow-hidden flex items-center gap-2 ${
                isSubmitted ? 'opacity-100 max-h-8' : 'opacity-0 max-h-0'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
              </svg>
              ACCESS GRANTED. MAINMAINFRAME DISPATCH LOGGED.
            </div>
          </form>
        </div>

      </div>
    </section>
  );
}
