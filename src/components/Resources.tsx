import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, MessageCircle, BookOpen, ArrowRight, Globe, Package, Shield, Zap, Clock, Users, HelpCircle, FileText, Mail } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect } from 'react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface FAQItem {
  q: string;
  a: string;
  icon: React.ReactNode;
}

const faqs: FAQItem[] = [
  {
    q: 'Where is Elite Ti based?',
    a: "We're based in Thailand and ship globally — heavy volume goes to the U.S. We have partnerships with logistics hubs in both regions to keep lead times tight and costs predictable.",
    icon: <Globe className="w-4 h-4" />,
  },
  {
    q: 'Are your kits real dry carbon?',
    a: "If it says dry carbon, it's pre-preg, autoclave-cured, zero filler. No wet lay. No games. If it's fiberglass or wet carbon, we say so up front. We don't mix materials and call it the same thing.",
    icon: <Package className="w-4 h-4" />,
  },
  {
    q: 'How long does shipping take to the U.S.?',
    a: "Standard air: 5–8 business days. Express available. We're also migrating large items (kits, fenders, bumpers) to ocean freight for the U.S. — this keeps prices low and reduces the tariff hit. Transit time is longer, but landed cost is cleaner.",
    icon: <Clock className="w-4 h-4" />,
  },
  {
    q: 'Are duties or tariffs included?',
    a: "Yes — all U.S. orders include duties and export tariffs. We handle customs clearance on our side. You won't get hit with surprise import fees at the door.",
    icon: <Shield className="w-4 h-4" />,
  },
  {
    q: 'How much is shipping?',
    a: "It depends on item size and weight. See our Shipping Rates or Pricing Policy for full breakdowns. We'll give you exact costs before you commit — no checkout surprises.",
    icon: <Package className="w-4 h-4" />,
  },
  {
    q: 'How do I install your kits?',
    a: "All parts are bolt-on or light prep. If you're not cool with trimming, sanding, or adjusting brackets, take it to a shop that knows JDM installs — not a window tint place. We include fitment notes with every order.",
    icon: <Zap className="w-4 h-4" />,
  },
  {
    q: 'Do you offer discounts for shops or bulk orders?',
    a: "Yep. We've got tiered wholesale pricing. If you're a shop or reseller, hit us up to open an account. Volume pricing kicks in fast and the margins are solid.",
    icon: <Users className="w-4 h-4" />,
  },
  {
    q: 'Can I return parts if they don\'t fit?',
    a: "Only if it's our fault. Everything is pre-fit verified before shipping. If your chassis is bent or your shop botches install, we're not covering it. But if we sent the wrong part or there's a defect — we sort it immediately.",
    icon: <Shield className="w-4 h-4" />,
  },
  {
    q: "What's the warranty?",
    a: "We inspect every part before it ships. If it arrives damaged, send photos within 48 hours. We'll sort it fast. Structural issues on titanium hardware carry a lifetime warranty against fatigue cracks and heat failure.",
    icon: <Shield className="w-4 h-4" />,
  },
  {
    q: 'Can I customize a kit?',
    a: "Yes. We do custom builds, widebody conversions, and one-offs. Send us your specs and let's build something wild. Lead times vary but we've done full bespoke builds in under 10 weeks.",
    icon: <Zap className="w-4 h-4" />,
  },
];

const blogPosts = [
  {
    slug: 'fd3s-body-kit',
    title: 'FD3S RX-7 Body Kit Styles: RE Amemiya vs Knight Sports vs Veilside',
    excerpt: 'Choosing aero for the ultimate JDM canvas: comparing RE Amemiya, Knight Sports, and Veilside styles for the FD3S.',
    tag: 'AERO GUIDE',
    readTime: '8 MIN READ',
    img: '/images/blogs/fd3s-rx7-widebody-kit-studio.jpg',
  },
  {
    slug: 'r34-carbon-aero',
    title: 'R34 Skyline GT-R Carbon Aero: The Buyer\'s Guide',
    excerpt: 'Full breakdown of dry carbon hood options, front lips, and full aero kits for the BNR34 GT-R platform.',
    tag: 'BUYER\'S GUIDE',
    readTime: '10 MIN READ',
    img: '/images/blogs/r34-carbon-hood-weave-detail.jpg',
  },
  {
    slug: 'eti-motorsports',
    title: 'ETi Motorsports: The Driver Sponsorship Program',
    excerpt: 'How we partner with Mad Mike, Rob Dahm, and Jon Wong — and what that means for product development and testing.',
    tag: 'MOTORSPORTS',
    readTime: '6 MIN READ',
    img: '/images/blogs/chaiyavee-evo8-paddock-chang.jpg',
  },
];

const quickLinks = [
  { label: 'Checkout Our All Images', desc: 'Showcase & gallery', icon: '📷', page: 'home' },
  { label: 'Story', desc: 'About Elite Ti & team', icon: '📖', page: 'story' },
  { label: 'Blog', desc: 'Build guides & aero deep dives', icon: '✍️', page: 'blog' },
  { label: 'Contact', desc: 'Get in touch or collab', icon: '📬', page: 'contact' },
  { label: 'Catalog', desc: 'Full carbon & aero catalog', icon: '🗂️', page: 'catalog' },
  { label: 'Titanium', desc: 'Titanium hardware range', icon: '⚙️', page: 'titanium' },
];

interface ResourcesProps {
  onNavigate: (page: string) => void;
}

const FAQRow: React.FC<{ item: FAQItem; index: number }> = ({ item, index }) => {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      className={`border-b border-neutral-900 transition-colors duration-300 ${open ? 'border-[#c0f20c]/20' : ''}`}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-5 gap-4 text-left cursor-pointer bg-transparent border-0 group"
      >
        <div className="flex items-center gap-3">
          <span className={`shrink-0 transition-colors duration-300 ${open ? 'text-[#c0f20c]' : 'text-neutral-600'}`}>
            {item.icon}
          </span>
          <span className={`font-display font-bold text-sm md:text-base uppercase tracking-wider transition-colors duration-300 ${open ? 'text-white' : 'text-neutral-300 group-hover:text-white'}`}>
            {item.q}
          </span>
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className={`shrink-0 transition-colors duration-300 ${open ? 'text-[#c0f20c]' : 'text-neutral-600'}`}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pb-5 pl-7">
              {/* Lime left border accent */}
              <div className="border-l-2 border-[#c0f20c]/40 pl-4">
                <p className="text-neutral-400 font-sans text-sm leading-relaxed">
                  {item.a}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const Resources: React.FC<ResourcesProps> = ({ onNavigate }) => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger reveal on blog cards
      gsap.fromTo('.res-blog-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, stagger: 0.12, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: '.res-blog-grid', start: 'top 80%' }
        }
      );
      // Quick link tiles
      gsap.fromTo('.res-quick-tile',
        { opacity: 0, scale: 0.93 },
        {
          opacity: 1, scale: 1, stagger: 0.08, duration: 0.5, ease: 'back.out(1.5)',
          scrollTrigger: { trigger: '.res-quick-grid', start: 'top 82%' }
        }
      );
    });
    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div className="bg-[#080809] text-[#fafaf7] min-h-screen overflow-x-hidden">

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative py-28 border-b border-neutral-900 overflow-hidden flex items-center justify-center min-h-[42vh]">
        {/* Grid background */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, #fff 40px, #fff 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, #fff 40px, #fff 41px)' }} />
        </div>
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 bg-[#c0f20c]/8 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-[900px] mx-auto px-6 md:px-12 text-center space-y-6 relative z-10">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-mono text-[10px] text-[#c0f20c] tracking-[0.3em] uppercase font-bold block"
          >
            ETI RESOURCES — KNOWLEDGE BASE
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold uppercase tracking-[0.15em] text-white leading-tight"
          >
            RESOURCES
          </motion.h1>

          <div className="w-16 h-[2px] bg-[#c0f20c] mx-auto" />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-neutral-400 font-mono text-xs uppercase tracking-widest max-w-lg mx-auto"
          >
            FAQ · GUIDES · BLOG POSTS · QUICK LINKS — EVERYTHING YOU NEED
          </motion.p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 border-b border-neutral-900">
        <div className="max-w-[860px] mx-auto px-6 md:px-12">

          <div className="flex items-center gap-4 mb-14">
            <HelpCircle className="w-5 h-5 text-[#c0f20c]" />
            <div>
              <span className="font-mono text-[9px] text-[#c0f20c] tracking-[0.25em] uppercase font-bold block mb-1">KNOWLEDGE BASE</span>
              <h2 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-wider text-white">
                FREQUENTLY ASKED <span className="text-[#c0f20c]">QUESTIONS</span>
              </h2>
            </div>
          </div>

          <div className="space-y-0">
            {faqs.map((item, i) => (
              <FAQRow key={i} item={item} index={i} />
            ))}
          </div>

          {/* CTA below FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12 p-6 border border-neutral-800 bg-neutral-950/60 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3">
              <MessageCircle className="w-5 h-5 text-[#c0f20c] shrink-0 mt-0.5" />
              <div>
                <p className="font-display font-bold text-white text-sm uppercase tracking-wider">Still have questions?</p>
                <p className="text-neutral-500 font-mono text-[10px] mt-0.5 uppercase tracking-widest">Our team responds fast. No chatbots.</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('contact')}
              className="shrink-0 flex items-center gap-2 bg-[#c0f20c] hover:bg-[#b0dc0b] text-black font-mono font-bold text-[10px] uppercase tracking-widest px-5 py-2.5 rounded transition-all cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              CONTACT US
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── BLOG POSTS ── */}
      <section className="py-24 border-b border-neutral-900 bg-[#0a0a0b]">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12">

          <div className="flex items-center justify-between mb-14 flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <FileText className="w-5 h-5 text-[#c0f20c]" />
              <div>
                <span className="font-mono text-[9px] text-[#c0f20c] tracking-[0.25em] uppercase font-bold block mb-1">FROM THE ARCHIVE</span>
                <h2 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-wider text-white">
                  BLOG <span className="text-[#c0f20c]">POSTS</span>
                </h2>
              </div>
            </div>
            <button
              onClick={() => onNavigate('blog')}
              className="flex items-center gap-2 text-[#c0f20c] font-mono text-[10px] uppercase tracking-widest hover:gap-3 transition-all cursor-pointer bg-transparent border-0"
            >
              VIEW ALL POSTS <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="res-blog-grid grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.map((post, i) => (
              <div
                key={i}
                onClick={() => onNavigate('blog')}
                className="res-blog-card group cursor-pointer border border-neutral-900 hover:border-[#c0f20c]/30 bg-neutral-950/50 rounded-lg overflow-hidden transition-all duration-400"
              >
                {/* Image */}
                <div className="h-44 overflow-hidden relative bg-neutral-900">
                  <img
                    src={post.img}
                    alt={post.title}
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 filter grayscale group-hover:grayscale-0"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent" />
                  <span className="absolute top-3 left-3 font-mono text-[7px] text-[#c0f20c] bg-black/70 px-2 py-1 uppercase tracking-widest border border-[#c0f20c]/20 rounded">
                    {post.tag}
                  </span>
                </div>

                {/* Text */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[8px] text-neutral-600 uppercase tracking-widest">{post.readTime}</span>
                    <div className="w-4 h-[1px] bg-[#c0f20c]/40 group-hover:w-8 transition-all duration-300" />
                  </div>
                  <h3 className="font-display font-bold text-white text-sm uppercase tracking-wide leading-snug group-hover:text-[#c0f20c] transition-colors duration-300">
                    {post.title}
                  </h3>
                  <p className="text-neutral-500 font-sans text-[11px] leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-1.5 text-[#c0f20c] font-mono text-[9px] uppercase tracking-widest pt-1 group-hover:gap-3 transition-all duration-300">
                    READ ARTICLE <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUICK NAVIGATION ── */}
      <section className="py-24 border-b border-neutral-900">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12">

          <div className="text-center mb-14 space-y-2">
            <span className="font-mono text-[9px] text-[#c0f20c] tracking-[0.25em] uppercase font-bold block">NAVIGATE</span>
            <h2 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-wider text-white">
              QUICK <span className="text-[#c0f20c]">LINKS</span>
            </h2>
            <p className="text-neutral-500 font-mono text-[10px] uppercase tracking-widest">Jump to any section of the site</p>
          </div>

          <div className="res-quick-grid grid grid-cols-2 md:grid-cols-3 gap-4">
            {quickLinks.map((link, i) => (
              <button
                key={i}
                onClick={() => onNavigate(link.page)}
                className="res-quick-tile group text-left p-5 border border-neutral-900 hover:border-[#c0f20c]/40 bg-neutral-950/50 hover:bg-neutral-900/60 rounded-lg transition-all duration-300 cursor-pointer relative overflow-hidden"
              >
                {/* Lime left accent on hover */}
                <div className="absolute top-0 left-0 w-[2px] h-0 bg-[#c0f20c] group-hover:h-full transition-all duration-400" />
                <div className="pl-2 space-y-2">
                  <span className="text-2xl">{link.icon}</span>
                  <div>
                    <p className="font-display font-bold text-white text-sm uppercase tracking-wider group-hover:text-[#c0f20c] transition-colors duration-300">
                      {link.label}
                    </p>
                    <p className="text-neutral-600 font-mono text-[9px] uppercase tracking-widest mt-0.5">
                      {link.desc}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-[#c0f20c]/50 group-hover:text-[#c0f20c] font-mono text-[8px] uppercase tracking-widest transition-all duration-300 group-hover:gap-2">
                    GO <ArrowRight className="w-2.5 h-2.5" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT STRIP ── */}
      <section className="py-20">
        <div className="max-w-[900px] mx-auto px-6 md:px-12 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="font-mono text-[9px] text-[#c0f20c] tracking-[0.25em] uppercase font-bold block mb-3">DIRECT LINE</span>
            <h2 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-wider text-white mb-4">
              READY TO <span className="text-[#c0f20c]">BUILD?</span>
            </h2>
            <p className="text-neutral-400 font-mono text-xs uppercase tracking-widest max-w-md mx-auto mb-8">
              Custom builds, wholesale accounts, sponsorship, or just a question — we reply fast.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate('contact')}
                className="flex items-center justify-center gap-2 bg-[#c0f20c] hover:bg-[#b0dc0b] text-black font-mono font-bold text-[10px] uppercase tracking-widest px-8 py-3.5 rounded transition-all cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                GET IN TOUCH
              </button>
              <button
                onClick={() => onNavigate('story')}
                className="flex items-center justify-center gap-2 border border-neutral-800 hover:border-[#c0f20c]/40 text-neutral-300 hover:text-white font-mono font-bold text-[10px] uppercase tracking-widest px-8 py-3.5 rounded transition-all cursor-pointer bg-transparent"
              >
                <BookOpen className="w-3.5 h-3.5" />
                ABOUT US
              </button>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};
