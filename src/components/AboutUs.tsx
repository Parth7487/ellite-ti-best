import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Check, Send, Shield, Target, Eye, Users, Trophy } from 'lucide-react';

interface Milestone {
  year: string;
  title: string;
  desc: string;
}

const milestones: Milestone[] = [
  { year: '1992', title: 'EVOLUTION I', desc: 'The rally legend is born. 247hp. AWD. The foundation.' },
  { year: '1998', title: 'EVOLUTION V', desc: 'The widebody era begins. Adjustable aluminum wing. Active Yaw Control.' },
  { year: '2005', title: 'EVOLUTION IX', desc: 'MIVEC variable valve timing. The ultimate 4G63 platform.' },
  { year: '2024', title: 'ELITE Ti', desc: 'The future of heritage. Dry carbon and titanium restoration program.' },
];

export const AboutUs: React.FC = () => {
  // Form submission state
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    socialLink: '',
    followers: '',
    vehicle: '',
    contentTypes: [] as string[],
    platforms: [] as string[],
    statement: '',
  });

  const handleContentTypeToggle = (type: string) => {
    setFormData(prev => {
      const active = prev.contentTypes.includes(type)
        ? prev.contentTypes.filter(t => t !== type)
        : [...prev.contentTypes, type];
      return { ...prev, contentTypes: active };
    });
  };

  const handlePlatformToggle = (platform: string) => {
    setFormData(prev => {
      const active = prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform];
      return { ...prev, platforms: active };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="eti-page bg-[#0a0a0b] text-[#fafaf7] min-h-[85vh] overflow-x-hidden">
      
      {/* 1. HERO TITLE BLOCK & INTRO */}
      <section className="relative py-24 border-b border-neutral-900 overflow-hidden">
        {/* Grid pattern background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, #333 40px, #333 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, #333 40px, #333 41px)',
            }} 
          />
        </div>

        {/* Diagonal glow strip */}
        <div className="absolute top-0 right-1/4 w-[1px] h-full bg-gradient-to-b from-[#c0f20c]/30 via-transparent to-transparent rotate-12 origin-top" />

        <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 text-center space-y-6">
          <span className="kicker font-mono text-[10px] tracking-[0.3em] text-[#c0f20c] uppercase font-bold">
            EST. 2022 &mdash; HIGH PERFORMANCE ALLOCATIONS
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold uppercase tracking-[0.2em] text-white leading-tight">
            ABOUT ELITE TI
          </h1>
          
          <div className="w-16 h-[2px] bg-[#c0f20c] mx-auto my-6" />

          <p className="text-neutral-400 font-mono text-xs uppercase tracking-widest max-w-xl mx-auto">
            HONG KONG &bull; UNITED STATES &bull; BANGKOK &bull; WORLDWIDE
          </p>

          <div className="max-w-3xl mx-auto pt-8">
            <p className="text-neutral-350 text-xs md:text-sm leading-relaxed font-sans text-center max-w-2xl mx-auto">
              Elite Ti started with a simple goal: build parts we would trust on our own cars. 
              What began in a small garage has evolved into a global brand known for uncompromising 
              carbon fiber and titanium craftsmanship. Founded by a Marine veteran and lifelong automotive 
              enthusiast, Elite Ti blends discipline, engineering, and artistry to push the limits of performance and design.
            </p>
            <p className="text-neutral-450 text-xs leading-relaxed font-sans mt-4 text-center max-w-2xl mx-auto">
              We specialize in custom carbon fiber and titanium upgrades for JDM, time attack, and 
              high-performance builds. From concept to final fitment, every piece is designed with one 
              mindset: make it lighter, make it stronger, make it perfect.
            </p>
          </div>
        </div>
      </section>

      {/* 2. CORE PHILOSOPHY, MISSION, & VISION (MULTIROW GRID) */}
      <section className="border-b border-neutral-900 bg-[#080809]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-24">
          <div className="text-center mb-16 space-y-2">
            <span className="font-mono text-[9px] text-[#c0f20c] tracking-[0.25em] uppercase font-bold">CORE VALUES</span>
            <h2 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-wider text-white">THE ETI PROTOCOL</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Philosophy */}
            <div className="border border-neutral-900 bg-neutral-950/40 p-8 space-y-6 hover:border-[#c0f20c]/20 transition-all duration-300 relative group">
              <div className="absolute top-0 left-0 w-[2px] h-0 bg-[#c0f20c] group-hover:h-full transition-all duration-300" />
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-[#c0f20c]" />
                <h3 className="font-display font-bold uppercase text-white tracking-widest text-sm">OUR PHILOSOPHY</h3>
              </div>
              <p className="text-neutral-400 text-xs leading-relaxed font-sans text-left">
                Every weave, curve, and bolt we create reflects our pursuit of functional beauty. 
                Performance parts should not only look right but fit right, feel right, and perform under pressure. 
                We work closely with fabricators, tuners, and sponsored drivers who share the same passion. 
                Their input drives our innovation and keeps our standards relentless.
              </p>
            </div>

            {/* Mission */}
            <div className="border border-neutral-900 bg-neutral-950/40 p-8 space-y-6 hover:border-[#c0f20c]/20 transition-all duration-300 relative group">
              <div className="absolute top-0 left-0 w-[2px] h-0 bg-[#c0f20c] group-hover:h-full transition-all duration-300" />
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-[#c0f20c]" />
                <h3 className="font-display font-bold uppercase text-white tracking-widest text-sm">OUR MISSION</h3>
              </div>
              <p className="text-neutral-400 text-xs leading-relaxed font-sans text-left">
                To deliver personalized, high-quality performance components through expert craftsmanship and 
                advanced technology. Every customer should experience exceptional fitment, function, and finish 
                from the first mold bake to the final structural installation on their chassis.
              </p>
            </div>

            {/* Vision */}
            <div className="border border-neutral-900 bg-neutral-950/40 p-8 space-y-6 hover:border-[#c0f20c]/20 transition-all duration-300 relative group">
              <div className="absolute top-0 left-0 w-[2px] h-0 bg-[#c0f20c] group-hover:h-full transition-all duration-300" />
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-[#c0f20c]" />
                <h3 className="font-display font-bold uppercase text-white tracking-widest text-sm">OUR VISION</h3>
              </div>
              <p className="text-neutral-400 text-xs leading-relaxed font-sans text-left">
                To lead the global stage in custom automotive design by staying true to innovation, precision, 
                and individuality. We don't follow trends or manufacture generic mass-production catalog items. 
                We carve out our own lane and set new benchmarks for composite engineering.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE BLOODLINE (VERTICAL INTERACTIVE TIMELINE) */}
      <section className="py-24 border-b border-neutral-900 bg-[#0a0a0b] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#c0f20c]/5 rounded-full blur-[90px] pointer-events-none" />

        <div className="max-w-[1000px] mx-auto px-6 md:px-12">
          <div className="text-center mb-20 space-y-2">
            <h2 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-[0.2em] text-white">
              THE <span className="text-[#c0f20c]">BLOODLINE</span>
            </h2>
            <p className="text-neutral-500 font-mono text-[9px] tracking-widest uppercase">
              Respecting the past. Engineering the future.
            </p>
          </div>

          <div className="relative">
            {/* Vertical Center Line */}
            <div className="absolute left-[13px] md:left-1/2 top-0 bottom-0 w-[1px] bg-neutral-850 md:-translate-x-1/2" />

            <div className="space-y-16">
              {milestones.map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`flex flex-col md:flex-row gap-8 items-start md:items-center relative ${
                    index % 2 === 0 ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Content block */}
                  <div className="flex-1 pl-10 md:pl-0">
                    <div className={`space-y-1.5 ${
                      index % 2 === 0 ? 'md:text-left' : 'md:text-right'
                    }`}>
                      <span className="text-[#c0f20c] font-mono font-bold text-base tracking-wider">
                        {item.year}
                      </span>
                      <h3 className="text-white text-lg font-display font-bold tracking-wider uppercase">
                        {item.title}
                      </h3>
                      <p className={`text-neutral-400 font-sans text-xs leading-relaxed max-w-sm ${
                        index % 2 === 0 ? '' : 'md:ml-auto'
                      }`}>
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  {/* Central Node Indicator */}
                  <div className="absolute left-[7px] md:left-1/2 md:-translate-x-1/2 w-3.5 h-3.5 bg-black border-[2px] border-[#c0f20c] rounded-full z-10 shadow-[0_0_8px_rgba(192,242,12,0.6)]" />

                  {/* Empty Spacer Column for Desktop */}
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. MEET THE CREW (OUR TEAM) */}
      <section className="py-24 border-b border-neutral-900 bg-[#080809]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="text-center mb-16 space-y-2">
            <span className="font-mono text-[9px] text-[#c0f20c] tracking-[0.25em] uppercase font-bold">ATELIER CORE</span>
            <h2 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-wider text-white">MEET THE CREW BEHIND THE CARBON</h2>
            <p className="text-neutral-500 font-mono text-[10px] uppercase max-w-xl mx-auto">
              A collective of builders, designers, and racers who share one belief: quality without compromise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Nate */}
            <div className="border border-neutral-900 bg-neutral-950 p-6 space-y-4 hover:border-neutral-800 transition-all duration-300">
              <div className="h-60 w-full overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-500">
                <img src="/images/350z-hero-0.jpg" alt="Nate" className="w-full h-full object-cover" />
                <div className="absolute bottom-3 left-3 bg-black/80 px-3 py-1 text-[9px] font-mono text-white tracking-widest uppercase">FOUNDER & BUILDER</div>
              </div>
              <div className="space-y-1 text-left">
                <h3 className="font-display font-bold text-white uppercase text-base tracking-wider">NATE</h3>
                <p className="text-[#c0f20c] font-mono text-[9px] tracking-wider uppercase font-bold">SEMA BUILDER & COMPOSITE SPECIALIST</p>
              </div>
              <p className="text-neutral-450 text-[11px] leading-relaxed text-left font-sans">
                "Before ETi was a company, it was just me wrenching on SEMA builds, FDs, a Supra, and whatever else I could get my hands on. 
                I've always cared about clean fitment, real performance, and building things the right way. That mindset shaped ETi from day one."
              </p>
            </div>

            {/* Peter */}
            <div className="border border-neutral-900 bg-neutral-950 p-6 space-y-4 hover:border-neutral-800 transition-all duration-300">
              <div className="h-60 w-full overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-500">
                <img src="/images/350z-hero-8.jpg" alt="Peter" className="w-full h-full object-cover" />
                <div className="absolute bottom-3 left-3 bg-black/80 px-3 py-1 text-[9px] font-mono text-white tracking-widest uppercase">PRODUCTION MANAGER</div>
              </div>
              <div className="space-y-1 text-left">
                <h3 className="font-display font-bold text-white uppercase text-base tracking-wider">PETER</h3>
                <p className="text-[#c0f20c] font-mono text-[9px] tracking-wider uppercase font-bold">RACE FABRICATION & AUTOCLAVE COMPOSITES</p>
              </div>
              <p className="text-neutral-450 text-[11px] leading-relaxed text-left font-sans">
                "I've been in the fabrication and motorsports world for a long time, building custom cars and race setups. 
                My role is keeping production tight, making sure every piece is consistent, and guaranteeing the final fit is 0.5mm precise."
              </p>
            </div>

            {/* Lita */}
            <div className="border border-neutral-900 bg-neutral-950 p-6 space-y-4 hover:border-neutral-800 transition-all duration-300">
              <div className="h-60 w-full overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-500">
                <img src="/images/350z-hero-9.jpg" alt="Lita" className="w-full h-full object-cover" />
                <div className="absolute bottom-3 left-3 bg-black/80 px-3 py-1 text-[9px] font-mono text-white tracking-widest uppercase">BRAND VISUALS</div>
              </div>
              <div className="space-y-1 text-left">
                <h3 className="font-display font-bold text-white uppercase text-base tracking-wider">LITA</h3>
                <p className="text-[#c0f20c] font-mono text-[9px] tracking-wider uppercase font-bold">CREATIVE DIRECTOR & CAMPAIGN LEADER</p>
              </div>
              <p className="text-neutral-450 text-[11px] leading-relaxed text-left font-sans">
                "I take care of the brand's visuals, photos, videos, and aesthetic presence. 
                I make sure everything looks clean, sharp, and consistent. Working with carbon and high-performance builds keeps the work exciting."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SPONSORED DRIVERS */}
      <section className="py-24 border-b border-neutral-900 bg-[#0a0a0b]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="text-center mb-16 space-y-2">
            <span className="font-mono text-[9px] text-[#c0f20c] tracking-[0.25em] uppercase font-bold">ETI RACING UNIT</span>
            <h2 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-wider text-white">SPONSORED DRIVERS</h2>
            <p className="text-neutral-500 font-mono text-[10px] uppercase max-w-xl mx-auto">
              Our drivers represent the best in JDM, drift, and time attack culture. They test, push, and prove our builds under absolute abuse.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Mad Mike */}
            <div className="border border-neutral-900 bg-neutral-950 p-6 space-y-4 hover:border-neutral-805 transition-all">
              <div className="h-48 w-full overflow-hidden relative grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-300">
                <img src="/images/SUPRA green2.jpg" alt="Mad Mike Whiddett" className="w-full h-full object-cover" />
              </div>
              <h3 className="font-display font-bold text-white uppercase text-sm tracking-widest text-left flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#c0f20c]" /> MAD MIKE WHIDDETT
              </h3>
              <p className="text-neutral-450 text-[11px] leading-relaxed text-left font-sans">
                Mad Mike needs no introduction. Drift icon, rotary fanatic, and the mind behind some of the wildest RX-7 builds on the planet. 
                We support his Formula Drift program with the same mindset he brings to every car: go harder than anyone else.
              </p>
            </div>

            {/* Rob Dahm */}
            <div className="border border-neutral-900 bg-neutral-950 p-6 space-y-4 hover:border-neutral-805 transition-all">
              <div className="h-48 w-full overflow-hidden relative grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-300">
                <img src="/images/SUPRA green3.jpg" alt="Rob Dahm" className="w-full h-full object-cover" />
              </div>
              <h3 className="font-display font-bold text-white uppercase text-sm tracking-widest text-left flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#c0f20c]" /> ROB DAHM
              </h3>
              <p className="text-neutral-450 text-[11px] leading-relaxed text-left font-sans">
                Rob is a legend in the rotary world and the creator of one of the most extreme RX-7s ever built. 
                His Pikes Peak program is all about pushing boundaries. Working with him lets us test our parts in real abuse conditions.
              </p>
            </div>

            {/* Jon Wong */}
            <div className="border border-neutral-900 bg-neutral-950 p-6 space-y-4 hover:border-neutral-805 transition-all">
              <div className="h-48 w-full overflow-hidden relative grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-300">
                <img src="/images/SUPRA green4.jpg" alt="Jon Wong" className="w-full h-full object-cover" />
              </div>
              <h3 className="font-display font-bold text-white uppercase text-sm tracking-widest text-left flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#c0f20c]" /> JON WONG
              </h3>
              <p className="text-neutral-450 text-[11px] leading-relaxed text-left font-sans">
                Jon is a high-end builder and long-time supporter of precision JDM culture. 
                His FD RX-7, MK4 Supra, and other custom vehicles reflect the exact values we care about: clean work and thoughtful mods.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SPONSORSHIP FORM */}
      <section className="py-24 bg-[#080809]">
        <div className="max-w-[800px] mx-auto px-6">
          <div className="text-center mb-12 space-y-2">
            <span className="font-mono text-[9px] text-[#c0f20c] tracking-[0.25em] uppercase font-bold">COLLABORATION PROGRAM</span>
            <h2 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-wider text-white">SPONSORSHIP & ALLOCATIONS</h2>
            <p className="text-neutral-400 text-xs max-w-xl mx-auto leading-relaxed">
              We’re excited to work with passionate creators, racers, and builders who live and breathe car culture. 
              If you’ve got a strong fan base and want to rep Elite Ti, fill out this form to request a 30% discount as part of our collab program.
            </p>
          </div>

          {!formSubmitted ? (
            <form onSubmit={handleSubmit} className="border border-neutral-900 bg-neutral-950/80 p-8 md:p-10 space-y-6 text-left">
              {/* Row 1: Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">FIRST NAME</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.firstName}
                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-850 p-3 text-xs text-white font-mono placeholder-neutral-600 focus:border-[#c0f20c] outline-none"
                    placeholder="Ken"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">LAST NAME</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.lastName}
                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-850 p-3 text-xs text-white font-mono placeholder-neutral-600 focus:border-[#c0f20c] outline-none"
                    placeholder="Block"
                  />
                </div>
              </div>

              {/* Row 2: Email & Social */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">EMAIL ADDRESS</label>
                  <input 
                    type="email" 
                    required 
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-850 p-3 text-xs text-white font-mono placeholder-neutral-600 focus:border-[#c0f20c] outline-none"
                    placeholder="ken.block@racing.com"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">SOCIAL MEDIA / YOUTUBE LINK</label>
                  <input 
                    type="url" 
                    required 
                    value={formData.socialLink}
                    onChange={e => setFormData({ ...formData, socialLink: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-850 p-3 text-xs text-white font-mono placeholder-neutral-600 focus:border-[#c0f20c] outline-none"
                    placeholder="https://youtube.com/c/yourchannel"
                  />
                </div>
              </div>

              {/* Row 3: Followers & Vehicle */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">TOTAL FOLLOWERS OR SUBSCRIBERS</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.followers}
                    onChange={e => setFormData({ ...formData, followers: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-850 p-3 text-xs text-white font-mono placeholder-neutral-600 focus:border-[#c0f20c] outline-none"
                    placeholder="e.g. 250,000"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">WHAT CAR(S) DO YOU DRIVE OR FEATURE?</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.vehicle}
                    onChange={e => setFormData({ ...formData, vehicle: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-850 p-3 text-xs text-white font-mono placeholder-neutral-600 focus:border-[#c0f20c] outline-none"
                    placeholder="Mazda RX-7 FD3S / Toyota Supra MK4"
                  />
                </div>
              </div>

              {/* Content Type Toggles */}
              <div className="space-y-2">
                <label className="font-mono text-[10px] text-neutral-500 block uppercase tracking-widest">WHAT KIND OF CONTENT DO YOU CREATE?</label>
                <div className="flex flex-wrap gap-2">
                  {['Youtube Vlogs', 'Shorts/Reels Video', 'Build and Install', 'Product Reviews', 'Show/Car Meets', 'Others'].map(type => {
                    const isSelected = formData.contentTypes.includes(type);
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleContentTypeToggle(type)}
                        className={`px-3 py-2 text-[10px] font-mono border uppercase tracking-wider transition-colors duration-250 cursor-pointer ${
                          isSelected 
                            ? 'bg-[#c0f20c] border-[#c0f20c] text-black font-bold' 
                            : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                        }`}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Platforms Toggles */}
              <div className="space-y-2">
                <label className="font-mono text-[10px] text-neutral-500 block uppercase tracking-widest">WHERE DO YOU USUALLY POST YOUR CONTENT?</label>
                <div className="flex flex-wrap gap-2">
                  {['Youtube', 'Facebook', 'Instagram', 'Tiktok', 'Threads', 'Others'].map(platform => {
                    const isSelected = formData.platforms.includes(platform);
                    return (
                      <button
                        key={platform}
                        type="button"
                        onClick={() => handlePlatformToggle(platform)}
                        className={`px-3 py-2 text-[10px] font-mono border uppercase tracking-wider transition-colors duration-250 cursor-pointer ${
                          isSelected 
                            ? 'bg-[#c0f20c] border-[#c0f20c] text-black font-bold' 
                            : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                        }`}
                      >
                        {platform}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Textarea */}
              <div className="space-y-1">
                <label className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">TELL US BRIEFLY WHY YOU WANT TO COLLAB WITH ELITE TI</label>
                <textarea 
                  required 
                  rows={4}
                  value={formData.statement}
                  onChange={e => setFormData({ ...formData, statement: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-850 p-3 text-xs text-white font-mono placeholder-neutral-600 focus:border-[#c0f20c] outline-none resize-none"
                  placeholder="Tell us about your build timeline, track plans, and marketing ideas..."
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full py-4 bg-[#c0f20c] hover:bg-[#a6d107] text-black font-display font-bold text-xs uppercase tracking-widest transition-all duration-250 cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" /> SUBMIT APPLICATION
              </button>
            </form>
          ) : (
            <div className="border border-[#c0f20c]/40 bg-neutral-950/80 p-12 text-center space-y-6 relative overflow-hidden">
              {/* Decorative top green indicator line */}
              <div className="absolute top-0 left-0 w-full h-[3px] bg-[#c0f20c]" />
              
              <div className="w-12 h-12 bg-[#c0f20c]/10 border border-[#c0f20c]/30 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-6 h-6 text-[#c0f20c]" />
              </div>
              
              <div className="space-y-2">
                <h3 className="font-display font-bold text-white text-xl uppercase tracking-wider">APPLICATION TRANSMITTED</h3>
                <p className="text-neutral-400 text-xs max-w-md mx-auto leading-relaxed">
                  Your allocation reference code has been successfully generated. The Elite Ti sponsorships board 
                  will review your build profile and media reach. Response will be delivered to <span className="text-[#c0f20c] font-mono">{formData.email}</span> within 72 hours.
                </p>
              </div>

              <div className="border-t border-neutral-900 pt-6">
                <button
                  onClick={() => {
                    setFormSubmitted(false);
                    setFormData({
                      firstName: '',
                      lastName: '',
                      email: '',
                      socialLink: '',
                      followers: '',
                      vehicle: '',
                      contentTypes: [],
                      platforms: [],
                      statement: '',
                    });
                  }}
                  className="font-mono text-[10px] text-[#c0f20c] hover:underline uppercase tracking-wider cursor-pointer"
                >
                  &larr; SUBMIT ANOTHER APPLICATION
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

    </div>
  );
};
