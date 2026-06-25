import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar, Clock, ArrowLeft, ChevronDown,
  User, Share2, Shield, Terminal, ArrowUpRight, Radio,
  BookOpen, Tag, ExternalLink, Check, ChevronRight
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  readTime: string;
  coverImage: string;
  category: string;
  tag: string;
  sections: {
    type: 'paragraph' | 'heading' | 'image' | 'list' | 'faq' | 'quote';
    content?: string;
    items?: string[];
    faqItems?: { q: string; a: string }[];
    src?: string;
    alt?: string;
  }[];
}

const blogPosts: BlogPost[] = [
  {
    id: 'eti-motorsports-the-drivers',
    title: 'ETi Motorsports: The Drivers',
    excerpt: 'Meet the drivers running ETi carbon in PT Maxnitron Racing Series competition at Chang International Circuit.',
    date: 'JUNE 2026',
    author: 'Nate Benoit',
    readTime: '4 MIN',
    coverImage: '/images/blogs/chaiyavee-kongthed-evo8-eti-carbon-hood.jpg',
    category: 'MOTORSPORTS',
    tag: 'PTRS · EVO VIII',
    sections: [
      { type: 'paragraph', content: 'Plenty of brands talk about "race-proven" parts. Here\'s what that actually means for us: real cars, real drivers, real competition, every round. ETi sponsors drivers in the PT Maxnitron Racing Series (PTRS), racing under the lights at Chang International Circuit in Buriram, and their cars run our parts under the hardest conditions a composite panel will ever see. This page is where you meet them.' },
      { type: 'heading', content: 'Why we sponsor race cars' },
      { type: 'paragraph', content: 'A show car tells you a part looks right. A race car tells you everything else: how a hood behaves under sustained aero load and engine heat, how a trunk handles vibration lap after lap, how interior carbon survives a cabin that bakes in the sun all race weekend. Competition compresses years of street use into a season, and what we learn goes straight back into how we build. Sponsorship isn\'t a marketing line item for us; it\'s product development with lap times.' },
      { type: 'heading', content: 'Tim "Doggzy" Zielinski: the #M12 Evo 8' },
      { type: 'paragraph', content: 'Tim Zielinski campaigns the yellow-and-blue #M12 Evo 8 in PTRS, and the car just delivered: at the latest round at Chang, Tim took first in class and third overall, on a night race that ended with fireworks over the podium. Exactly the kind of weekend a sponsor hopes for, and exactly the kind of abuse that proves parts.' },
      { type: 'image', src: '/images/blogs/tim-zielinski-m12-evo8-ptrs.jpg', alt: 'Tim Zielinski\'s #M12 Evo 8 at speed during the PTRS night race' },
      { type: 'paragraph', content: 'The Evo isn\'t the whole program either. Tim also campaigns an E30 BMW in a separate race series, and both cars carry ETi carbon dashboards. Interior carbon in a race car is the hardest test we can give it. A cabin that cooks under a windshield all weekend is a UV and heat chamber on wheels, and a dash that rattles or warps gets found out in one session. Two cars, two chassis families, two different grids, and a podium to show for it.' },
      { type: 'image', src: '/images/blogs/tim-zielinski-ptrs-podium-chang.jpg', alt: 'Fireworks over the PTRS podium at Chang International Circuit' },
      { type: 'heading', content: 'Chaiyavee Kongthed: the #M28 Evo 8' },
      { type: 'paragraph', content: 'Chaiyavee Kongthed campaigns the #M28 widebody Evo 8 in PTRS. The car runs an ETi carbon fiber hood and trunk: weight off both ends of a car that lives or dies by direction change, with the vented hood pulling heat off a turbocharged 4G63 that gets zero mercy on track.' },
      { type: 'image', src: '/images/blogs/chaiyavee-kongthed-helmet-ptrs.jpg', alt: 'Chaiyavee Kongthed straps in before a PTRS session' },
      { type: 'paragraph', content: 'Race weekends at Chang are exactly the environment carbon is built for: tropical heat, sustained load, and no margin for a panel that flexes or a finish that fades. The #M28\'s hood and trunk have taken it all season.' },
      { type: 'image', src: '/images/blogs/chaiyavee-evo8-paddock-chang.jpg', alt: 'The #M28 Evo 8 in the paddock at Chang International Circuit' },
      { type: 'heading', content: 'The series' },
      { type: 'paragraph', content: 'The PT Maxnitron Racing Series runs full grids at Chang International Circuit, Thailand\'s FIA Grade 1 track, with sedan classes where the Evos hunt and day-into-night races that finish under floodlights. It\'s proper door-to-door club racing with professional organization, and it\'s the perfect proving ground: heat, humidity, curbs, and contact risk, all season long.' },
      { type: 'image', src: '/images/blogs/ptrs-night-race-start-chang.jpg', alt: 'PTRS night race start under the lights at Chang International Circuit' },
      { type: 'heading', content: 'What\'s next' },
      { type: 'paragraph', content: 'Race recaps from PTRS rounds will land here on the blog, results, photos, and the honest engineering notes about what held and what we learned. Follow along on our socials between rounds, and if you\'re racing on ETi parts anywhere in the world, send us your car. Drivers who run our parts hard are the best development team we could ask for.' },
      { type: 'quote', content: 'Race photography courtesy of the PT Maxnitron Racing Series (PTRS). Want the parts these cars run? The hoods, trunks, and interiors in our catalog are the same construction the race program uses, built to order for your chassis. Written by Nate Benoit, founder of Elite Ti.' }
    ]
  },
  {
    id: 'r34-gtr-carbon-aero-buyers-guide',
    title: "R34 GT-R Carbon Aero: The Buyer's Guide",
    excerpt: "Upgrade recommendations for the BNR34: hood, trunk and wing, then front splitter, rear diffuser, and canards.",
    date: 'JUNE 2026',
    author: 'Nate Benoit',
    readTime: '5 MIN',
    coverImage: '/images/blogs/r34-gtr-full-carbon-kit-studio_3231c224-9b5f-45eb-aea8-3d3580854c7f.jpg',
    category: 'TECH GUIDES',
    tag: 'BNR34 · RB26',
    sections: [
      { type: 'paragraph', content: 'The short answer: on a BNR34, buy in this order: hood, then trunk and wing, then the functional aero (front splitter, rear diffuser, canards). Carbon on an R34 is not just a look. It pulls weight off a famously nose-heavy platform and adds downforce where the chassis can actually use it. Here is how to get the most from each dollar.' },
      { type: 'heading', content: 'Start with the hood' },
      { type: 'paragraph', content: 'The biggest single panel, the biggest weight saving, and the strongest visual change on the car. Weight off the nose of an R34 is not cosmetic: it is mass off the front axle of a platform that has always carried its engine forward, so you feel it in turn-in. A vented design adds real cooling for an RB making real power. Pair it with a proper install and hood pins if the car sees track time.' },
      { type: 'image', src: '/images/blogs/r34-carbon-hood-vents-closeup.jpg', alt: 'Vented carbon fiber hood for the Nissan Skyline R34' },
      { type: 'heading', content: 'Trunk and wing' },
      { type: 'paragraph', content: 'The R34\'s iconic rear wing means the trunk carries serious hardware. A carbon trunk drops weight high on the chassis, where it helps most, and it is the natural moment to sort the rear visual. Weave under a body-color wing, or a full carbon wing and trunk together, is one of the best looks on this car.' },
      { type: 'heading', content: 'The aero that earns its keep' },
      { type: 'paragraph', content: 'This is where the R34 rewards function. A front splitter and rear diffuser are the highest-value aero on the car if it sees speed, and the GT-R\'s relatively flat floor makes a diffuser genuinely effective rather than decorative. Canards are the finishing move: real front-end balance on a track car, aggressive stance on a street car.' },
      { type: 'image', src: '/images/blogs/r34-carbon-hood-weave-detail.jpg', alt: 'Carbon fiber twill weave detail on an R34 hood' },
      { type: 'heading', content: 'Street, track, or show' },
      { type: 'list', items: ['Street Build: Vacuum Carbon construction for daily durability and show-grade finish.', 'Track Car: Pre-Preg Dry Carbon for structural integrity under high aero loads.', 'Show Presentation: Glossy 2x2 twill with matched splitters and vents.'] },
      { type: 'heading', content: 'FAQ: R34 GT-R carbon aero' },
      { type: 'faq', faqItems: [
        { q: 'What carbon parts should I buy first for an R34?', a: 'The hood. It is the biggest weight saving, comes off the nose where an R34 needs it most, and is the strongest visual change. Trunk and wing next, then functional aero if the car sees speed.' },
        { q: "Does a carbon hood actually help an R34's handling?", a: "Yes, modestly but real. A carbon hood typically halves that panel's weight, and because it sits high and forward, removing it lowers the center of gravity and takes mass off the front axle. You feel it most in turn-in." },
        { q: 'Vacuum Carbon or Dry Carbon for an R34?', a: 'Vacuum Carbon for street and show. Pre-Preg Dry Carbon for track aero where stiffness under load and every gram matter.' },
        { q: 'Is a vented hood worth it on an R34?', a: 'On a car making real RB power, yes. Vents pull heat out of the engine bay and reduce front-end lift at speed. On a track car they are close to mandatory.' }
      ]}
    ]
  },
  {
    id: 'fd3s-rx7-body-kit-styles-compared',
    title: 'FD3S RX-7 Body Kit Styles Compared',
    excerpt: 'Choosing aero for the ultimate JDM canvas: comparing RE Amemiya, Knight Sports, and Veilside styles.',
    date: 'JUNE 2026',
    author: 'Nate Benoit',
    readTime: '5 MIN',
    coverImage: '/images/blogs/fd3s-rx7-widebody-kit-studio.jpg',
    category: 'DESIGN STUDIES',
    tag: 'FD3S · 13B-REW',
    sections: [
      { type: 'paragraph', content: 'The short answer: the FD3S is the best canvas in the JDM world, which is exactly why choosing aero for one is hard. Every kit ever made for this chassis has a point of view, and mixing points of view is how good FDs go wrong. Pick a direction, commit to it, and the car comes together.' },
      { type: 'heading', content: 'The two schools' },
      { type: 'paragraph', content: 'Period-correct 90s JDM: Wide, low, and dramatic, the style that defined the golden era. These kits commit: widened arches, deep front aprons, the silhouette that filled Option magazine. If your FD is a love letter to the era, this is the lane.' },
      { type: 'paragraph', content: 'Modern function: Time-attack-derived aero — splitters, canards, diffusers, vented panels. Every element earns its place aerodynamically and the look follows the function. This lane suits track-driven FDs and builds that want aggression without the period costume.' },
      { type: 'heading', content: 'The kit styles we build' },
      { type: 'paragraph', content: 'RE Amemiya style: The definitive FD widebody statement. Long front aprons, aggressive arches, the look that is synonymous with a serious RX-7. If you want the FD that turns the whole room, this is it.' },
      { type: 'image', src: '/images/blogs/fd3s-rx7-re-amemiya-widebody-front_6abd268a-1430-463a-ba20-13e3fba6ac4e.jpg', alt: 'FD3S Mazda RX-7 RE Amemiya wide body kit front perspective' },
      { type: 'paragraph', content: 'Knight Sport style: Cleaner and more restrained than full Amemiya, but unmistakably aggressive. A great choice for a street FD that wants presence without going full widebody commitment. Veilside style: the exotic end of the spectrum, smooth and sculptural.' },
      { type: 'image', src: '/images/blogs/fd3s-rx7-veilside-carbon-hood.jpg', alt: 'FD3S Mazda RX-7 with Veilside style carbon fiber hood' },
      { type: 'heading', content: 'Full kit or build in stages?' },
      { type: 'paragraph', content: 'Our FD3S parts work both ways: buy a complete kit, or buy individual components and build toward it. Full kits ensure that body lines flow continuously from splitters to side skirts. Individual staging is easier on the wallet, provided you map out a consistent theme on day one.' },
      { type: 'image', src: '/images/blogs/fd3s-rx7-painted-body-kit.jpg', alt: 'White FD3S Mazda RX-7 with a painted body kit' },
      { type: 'heading', content: 'FAQ: FD3S RX-7 body kits' },
      { type: 'faq', faqItems: [
        { q: 'Which FD3S body kit style should I choose?', a: 'Decide what the car is for first. A show or street statement car wears period-correct widebody (RE Amemiya, Veilside) best. A track-driven FD wants the functional school. Commit to one lane.' },
        { q: 'What is the difference between RE Amemiya and Knight Sport styles?', a: 'RE Amemiya is the full widebody statement, the most aggressive look. Knight Sport is cleaner and more restrained but still aggressive.' },
        { q: 'Does a carbon hood suit an FD3S?', a: 'Yes, it is one of the best first buys on the chassis. The FD is sensitive to weight on the nose, so a carbon hood preserves its handling character while transforming the look.' }
      ]}
    ]
  }
];

const catColor: Record<string, string> = {
  'MOTORSPORTS': '#c0f20c',
  'TECH GUIDES': '#00f0ff',
  'DESIGN STUDIES': '#ff6b35',
};

// ─── FAQ ITEM ─────────────────────────────────────────────────────────────────
const FAQItem: React.FC<{ question: string; answer: string; idx: number }> = ({ question, answer, idx }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`border rounded-sm cursor-pointer transition-all duration-300 overflow-hidden ${open ? 'border-[#c0f20c]/40 bg-neutral-950' : 'border-neutral-900 bg-neutral-950/40 hover:border-neutral-700'}`}
      onClick={() => setOpen(v => !v)}
    >
      <div className="p-4 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <span className="font-mono text-[7px] text-neutral-600 tracking-widest pt-0.5 shrink-0">Q{String(idx + 1).padStart(2, '0')}</span>
          <span className={`font-mono text-[10px] uppercase tracking-wide leading-relaxed ${open ? 'text-[#c0f20c]' : 'text-neutral-300'}`}>{question}</span>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0 mt-0.5">
          <ChevronDown className="w-4 h-4 text-neutral-600" />
        </motion.div>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-neutral-900/60 pt-3 text-neutral-400 font-sans text-[11px] leading-relaxed tracking-wide text-left">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── BLOG CARD ────────────────────────────────────────────────────────────────
const BlogCard: React.FC<{ post: BlogPost; onClick: () => void; featured?: boolean }> = ({ post, onClick, featured }) => {
  const accent = catColor[post.category] || '#c0f20c';

  if (featured) {
    return (
      <motion.div
        onClick={onClick}
        whileHover={{ scale: 1.004 }}
        transition={{ type: 'spring', stiffness: 200, damping: 30 }}
        className="relative cursor-pointer group overflow-hidden rounded-sm border border-neutral-900 hover:border-neutral-700 transition-colors duration-500"
      >
        <div className="relative h-[500px] w-full overflow-hidden">
          <motion.img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-700 group-hover:scale-105"
            style={{ transition: 'transform 0.8s ease, opacity 0.7s ease' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070708] via-[#070708]/55 to-transparent" />
          {/* Corner brackets */}
          {[['top-4 left-4', 'border-t-2 border-l-2'], ['top-4 right-4', 'border-t-2 border-r-2'], ['bottom-4 left-4', 'border-b-2 border-l-2'], ['bottom-4 right-4', 'border-b-2 border-r-2']].map(([pos, borders], i) => (
            <div key={i} className={`absolute ${pos} w-5 h-5 opacity-50 transition-opacity duration-300 group-hover:opacity-100`} style={{ borderColor: accent } as React.CSSProperties & { [key: string]: string }} />
          ))}
          {/* Badges */}
          <div className="absolute top-4 left-10 flex items-center gap-2.5">
            <span className="text-[7px] font-mono tracking-[0.2em] uppercase px-2.5 py-1 font-bold rounded-sm" style={{ background: `${accent}20`, color: accent, border: `1px solid ${accent}40` }}>{post.category}</span>
            <span className="text-[7px] font-mono text-neutral-600 tracking-widest uppercase hidden lg:block">{post.tag}</span>
          </div>
          <div className="absolute top-4 right-10 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: accent }} />
            <span className="text-[7px] font-mono text-neutral-500 tracking-widest uppercase">FEATURED</span>
          </div>
          {/* Bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-8 space-y-4">
            <div className="flex items-center gap-4 text-[8px] font-mono text-neutral-500 uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" style={{ color: accent }} /> {post.date}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-3 h-3 text-neutral-600" /> {post.readTime} READ</span>
              <span className="text-neutral-700">·</span>
              <span className="font-mono" style={{ color: accent }}>{post.tag}</span>
            </div>
            <h2 className="font-display font-bold text-white text-3xl md:text-4xl uppercase tracking-wide leading-tight max-w-2xl group-hover:text-[#c0f20c] transition-colors duration-400">
              {post.title}
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-xl">{post.excerpt}</p>
            <div className="flex items-center gap-2 pt-1">
              <span className="font-mono text-[9px] font-bold uppercase tracking-widest flex items-center gap-2" style={{ color: accent }}>
                READ FULL ARTICLE <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 220, damping: 28 }}
      className="relative cursor-pointer group overflow-hidden rounded-sm border border-neutral-900 hover:border-neutral-700 bg-neutral-950/60 flex flex-col transition-colors duration-400"
    >
      <div className="relative h-52 overflow-hidden bg-neutral-900">
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-full object-cover opacity-40 group-hover:opacity-65 group-hover:scale-105 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
        <div className="absolute top-3 left-3">
          <span className="text-[7px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-sm font-bold" style={{ background: `${accent}18`, color: accent, border: `1px solid ${accent}35` }}>{post.category}</span>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow space-y-3">
        <div className="flex items-center gap-3 text-[7.5px] font-mono text-neutral-500 uppercase tracking-widest">
          <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" style={{ color: accent }} /> {post.date}</span>
          <span className="flex items-center gap-1.5"><Clock className="w-3 h-3 text-neutral-700" /> {post.readTime}</span>
        </div>
        <h3 className="font-display font-bold text-white text-sm uppercase tracking-wider leading-snug group-hover:text-[#c0f20c] transition-colors duration-300 flex-grow">{post.title}</h3>
        <p className="text-neutral-500 text-[10px] leading-relaxed line-clamp-2">{post.excerpt}</p>
        <div className="pt-2 flex items-center justify-between border-t border-neutral-900/60">
          <span className="font-mono text-[7.5px] text-neutral-600 uppercase tracking-widest flex items-center gap-1.5"><User className="w-3 h-3" /> {post.author}</span>
          <span className="font-mono text-[7.5px] font-bold flex items-center gap-1 group-hover:gap-2 transition-all duration-300" style={{ color: accent }}>READ <ArrowUpRight className="w-3 h-3" /></span>
        </div>
      </div>
      <div className="h-[2px] w-0 group-hover:w-full transition-all duration-500 origin-left" style={{ background: `linear-gradient(to right, ${accent}, transparent)` }} />
    </motion.div>
  );
};

// ─── ARTICLE NAVIGATOR SIDEBAR ─────────────────────────────────────────────────
const ArticleNavigator: React.FC<{
  post: BlogPost;
  scrollPercent: number;
  activeHeadingIdx: number;
  allPosts: BlogPost[];
  onSelectPost: (p: BlogPost) => void;
}> = ({ post, scrollPercent, activeHeadingIdx, allPosts, onSelectPost }) => {
  const accent = catColor[post.category] || '#c0f20c';
  const headings = post.sections.filter(s => s.type === 'heading').map(s => s.content!);
  const related = allPosts.filter(p => p.id !== post.id).slice(0, 2);

  return (
    <div className="space-y-5 font-mono select-none">
      {/* Progress */}
      <div className="border border-neutral-900 bg-neutral-950/80 rounded-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-900">
          <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">READING PROGRESS</span>
          <span className="text-[11px] font-bold" style={{ color: accent }}>{Math.round(scrollPercent)}%</span>
        </div>
        <div className="p-4 space-y-3">
          {/* Progress bar */}
          <div className="h-1.5 bg-neutral-900 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: accent }}
              animate={{ width: `${scrollPercent}%` }}
              transition={{ duration: 0.15 }}
            />
          </div>
          <div className="flex justify-between text-[9px] text-neutral-600 uppercase tracking-widest">
            <span>START</span>
            <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> {post.readTime} READ</span>
            <span>END</span>
          </div>
        </div>
      </div>

      {/* Table of Contents */}
      {headings.length > 0 && (
        <div className="border border-neutral-900 bg-neutral-950/80 rounded-sm overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-900">
            <BookOpen className="w-3.5 h-3.5 text-neutral-600" />
            <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">IN THIS ARTICLE</span>
          </div>
          <div className="p-3 space-y-0.5">
            {headings.map((h, i) => {
              const isActive = i === activeHeadingIdx;
              const isPast = i < activeHeadingIdx;
              return (
                <a
                  key={i}
                  href={`#heading-${i}`}
                  onClick={e => { e.preventDefault(); document.getElementById(`heading-${i}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                  className={`flex items-start gap-3 px-3 py-2.5 rounded-sm transition-all duration-300 cursor-pointer no-underline ${
                    isActive ? 'bg-neutral-900' : 'hover:bg-neutral-900/40'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isPast
                      ? <Check className="w-3 h-3" style={{ color: accent }} />
                      : <div className={`w-2 h-2 rounded-full border-2 transition-all duration-300 ${
                          isActive ? '' : 'border-neutral-800'
                        }`} style={isActive ? { borderColor: accent, background: accent, boxShadow: `0 0 6px ${accent}` } : {}} />
                    }
                  </div>
                  <span className={`text-[10px] leading-snug uppercase tracking-wide transition-colors duration-300 ${
                    isActive ? 'font-bold' : isPast ? 'text-neutral-600' : 'text-neutral-500'
                  }`} style={isActive ? { color: accent } : {}}>
                    {h}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* Author Card */}
      <div className="border border-neutral-900 bg-neutral-950/80 rounded-sm overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-900">
          <User className="w-3 h-3 text-neutral-600" />
          <span className="text-[7px] text-neutral-500 uppercase tracking-widest font-bold">AUTHOR</span>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm border border-neutral-800 bg-neutral-900 flex items-center justify-center overflow-hidden shrink-0">
              <img src="/images/350z-hero-0.jpg" alt={post.author} className="w-full h-full object-cover opacity-60" />
            </div>
            <div>
              <div className="text-[9px] text-white font-bold uppercase tracking-wider">{post.author}</div>
              <div className="text-[7px] text-neutral-600 uppercase tracking-widest mt-0.5">FOUNDER · ELITE TI</div>
            </div>
          </div>
          <p className="text-[9px] text-neutral-500 leading-relaxed">SEMA builder, composite specialist, and the mind behind Elite Ti. Wrenching on JDM platforms since before it was cool.</p>
          <div className="flex items-center gap-1.5 text-[7px] uppercase tracking-widest" style={{ color: accent }}>
            <ExternalLink className="w-2.5 h-2.5" />
            <span className="font-bold cursor-pointer hover:underline">VIEW FULL PROFILE</span>
          </div>
        </div>
      </div>

      {/* Article meta */}
      <div className="border border-neutral-900 bg-neutral-950/80 rounded-sm overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-900">
          <Tag className="w-3 h-3 text-neutral-600" />
          <span className="text-[7px] text-neutral-500 uppercase tracking-widest font-bold">ARTICLE DETAILS</span>
        </div>
        <div className="p-4 space-y-2.5">
          {[
            { label: 'CATEGORY', val: post.category, color: accent },
            { label: 'PLATFORM', val: post.tag },
            { label: 'PUBLISHED', val: post.date },
            { label: 'EST. READ', val: `${post.readTime} READ` },
            { label: 'SECTIONS', val: `${headings.length} CHAPTERS` },
          ].map(({ label, val, color }) => (
            <div key={label} className="flex items-center justify-between border-b border-neutral-900/50 pb-2 last:border-none last:pb-0">
              <span className="text-[6.5px] text-neutral-700 uppercase tracking-widest font-bold">{label}</span>
              <span className="text-[7.5px] font-bold" style={color ? { color } : { color: 'white' }}>{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Related articles */}
      {related.length > 0 && (
        <div className="border border-neutral-900 bg-neutral-950/80 rounded-sm overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-900">
            <ChevronRight className="w-3 h-3 text-neutral-600" />
            <span className="text-[7px] text-neutral-500 uppercase tracking-widest font-bold">MORE FROM ETI</span>
          </div>
          <div className="divide-y divide-neutral-900">
            {related.map(rel => {
              const relAccent = catColor[rel.category] || '#c0f20c';
              return (
                <div key={rel.id} onClick={() => onSelectPost(rel)} className="p-4 cursor-pointer hover:bg-neutral-900/40 transition-colors duration-200 group">
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-12 rounded-sm overflow-hidden bg-neutral-900 shrink-0 border border-neutral-900">
                      <img src={rel.coverImage} alt={rel.title} className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="text-[6.5px] uppercase tracking-widest font-bold" style={{ color: relAccent }}>{rel.category}</div>
                      <p className="text-[8.5px] text-neutral-300 uppercase tracking-wide leading-snug font-bold group-hover:text-white transition-colors duration-200 line-clamp-2">{rel.title}</p>
                      <div className="text-[6.5px] text-neutral-700 uppercase tracking-widest">{rel.readTime} READ</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export const BlogPage: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [scrollPercent, setScrollPercent] = useState(0);
  const [activeHeadingIdx, setActiveHeadingIdx] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const categories = ['ALL', 'MOTORSPORTS', 'TECH GUIDES', 'DESIGN STUDIES'];
  const filtered = activeCategory === 'ALL' ? blogPosts : blogPosts.filter(p => p.category === activeCategory);
  const featured = activeCategory === 'ALL' ? filtered[0] : null;
  const grid = activeCategory === 'ALL' ? filtered.slice(1) : filtered;

  // Scroll tracking
  // Scroll tracking for progress bar
  useEffect(() => {
    if (!selectedPost) { setScrollPercent(0); setActiveHeadingIdx(0); return; }
    const onScroll = () => {
      const el = document.documentElement;
      const progress = Math.min(100, Math.max(0, (window.scrollY / (el.scrollHeight - window.innerHeight)) * 100));
      setScrollPercent(progress);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    setScrollPercent(0);
    return () => window.removeEventListener('scroll', onScroll);
  }, [selectedPost]);

  // IntersectionObserver: update active TOC heading as user scrolls to each section
  useEffect(() => {
    if (!selectedPost) return;
    // Small delay so headings are mounted
    const timer = setTimeout(() => {
      const headingEls = document.querySelectorAll('[data-heading-idx]');
      if (headingEls.length === 0) return;

      const observer = new IntersectionObserver(
        (entries) => {
          // Find the topmost visible heading
          const visible = entries
            .filter(e => e.isIntersecting)
            .map(e => parseInt((e.target as HTMLElement).dataset.headingIdx || '0'));
          if (visible.length > 0) {
            setActiveHeadingIdx(Math.min(...visible));
          }
        },
        {
          rootMargin: '-10% 0px -70% 0px', // trigger when heading enters top 30% of viewport
          threshold: 0,
        }
      );

      headingEls.forEach(el => observer.observe(el));
      return () => observer.disconnect();
    }, 150);

    return () => clearTimeout(timer);
  }, [selectedPost]);
  // GSAP entrance on list
  useEffect(() => {
    if (!selectedPost && listRef.current) {
      const cards = listRef.current.querySelectorAll('.blog-entry');
      gsap.fromTo(cards, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out', overwrite: true });
    }
  }, [selectedPost, activeCategory]);

  const handleShare = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}#blog-${id}`).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleSelectPost = (post: BlogPost) => {
    setSelectedPost(post);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setSelectedPost(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full bg-[#070708] min-h-screen text-[#fafaf7] pt-20 relative overflow-x-hidden">
      {/* Ambient grid */}
      <div className="fixed inset-0 opacity-[0.022] pointer-events-none z-0">
        <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 48px,#fff 48px,#fff 49px),repeating-linear-gradient(90deg,transparent,transparent 48px,#fff 48px,#fff 49px)' }} />
      </div>
      <div className="fixed top-[79px] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#c0f20c]/30 to-transparent z-10" />

      {/* Sticky reading progress bar */}
      {selectedPost && (
        <div className="fixed top-[80px] left-0 w-full h-[2px] bg-transparent z-50 pointer-events-none">
          <motion.div
            className="h-full"
            style={{ background: catColor[selectedPost.category] || '#c0f20c' }}
            animate={{ width: `${scrollPercent}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      )}

      <AnimatePresence mode="wait">
        {!selectedPost ? (
          /* ── LIST VIEW ── */
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            ref={listRef}
            className="max-w-7xl mx-auto px-5 md:px-10 pb-24 relative z-10"
          >
            {/* Page header */}
            <div className="pt-10 pb-8 border-b border-neutral-900 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <p className="font-mono text-[8px] tracking-[0.3em] text-[#c0f20c] uppercase font-bold mb-3">ETI ARCHIVE · TECHNICAL BULLETINS</p>
                <h1 className="font-display font-bold text-4xl md:text-5xl uppercase tracking-[0.15em] text-white">ELITE TI CATALOG</h1>
                <p className="text-neutral-500 text-[11px] mt-2 max-w-md leading-relaxed font-mono uppercase tracking-wide">Composite reports, aero data, and vehicle restoration diaries.</p>
              </div>
              <div className="flex items-center gap-4 font-mono text-[8px] border border-neutral-900 bg-neutral-950/80 px-4 py-3 rounded-sm shrink-0">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#c0f20c] animate-pulse" /><span className="text-neutral-600 uppercase tracking-widest">STREAMS: <span className="text-[#c0f20c] font-bold">ONLINE</span></span></div>
                  <div className="text-neutral-600 uppercase tracking-widest">ARCHIVES: <span className="text-white font-bold">{blogPosts.length}</span></div>
                </div>
                <div className="w-[1px] h-6 bg-neutral-900" />
                <div className="space-y-1">
                  <div className="text-neutral-600 uppercase tracking-widest">SYS: <span className="text-cyan-400 font-bold">STABLE</span></div>
                  <div className="text-neutral-600 uppercase tracking-widest">FREQ: <span className="text-white font-bold">5.82 GHz</span></div>
                </div>
              </div>
            </div>

            {/* Category filters */}
            <div className="flex flex-wrap gap-2 mb-10">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 text-[8px] font-mono border uppercase tracking-widest rounded-sm transition-all duration-200 cursor-pointer ${activeCategory === cat ? 'bg-[#c0f20c] border-[#c0f20c] text-black font-bold shadow-[0_0_12px_rgba(192,242,12,0.2)]' : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Featured */}
            {featured && (
              <div className="blog-entry mb-10">
                <BlogCard post={featured} onClick={() => handleSelectPost(featured)} featured />
              </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {grid.map(post => (
                <div key={post.id} className="blog-entry">
                  <BlogCard post={post} onClick={() => handleSelectPost(post)} />
                </div>
              ))}
            </div>

            {grid.length === 0 && !featured && (
              <div className="text-center py-24 font-mono text-neutral-700 text-xs uppercase tracking-widest">
                <Radio className="w-8 h-8 mx-auto mb-4 text-neutral-800" />
                NO ARCHIVES FOUND FOR THIS CATEGORY
              </div>
            )}
          </motion.div>
        ) : (
          /* ── READER VIEW ── */
          <motion.div
            key="reader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="relative z-10"
          >
            {/* Hero image */}
            <div className="relative h-[50vh] md:h-[58vh] w-full overflow-hidden">
              <img src={selectedPost.coverImage} alt={selectedPost.title} className="w-full h-full object-cover opacity-45" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070708] via-[#070708]/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#070708]/60 to-transparent" />

              {/* Top bar */}
              <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-[7px] font-mono tracking-[0.2em] uppercase px-2.5 py-1 rounded-sm font-bold" style={{ background: `${catColor[selectedPost.category]}18`, color: catColor[selectedPost.category] || '#c0f20c', border: `1px solid ${catColor[selectedPost.category] || '#c0f20c'}35` }}>
                    {selectedPost.category}
                  </span>
                  <span className="font-mono text-[7px] text-neutral-600 uppercase tracking-widest hidden md:block">{selectedPost.tag}</span>
                </div>
                <button onClick={handleBack} className="flex items-center gap-2 font-mono text-[8px] text-neutral-400 hover:text-[#c0f20c] uppercase tracking-widest font-bold cursor-pointer group transition-colors bg-black/60 backdrop-blur-sm px-3 py-2 border border-neutral-800 rounded-sm">
                  <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" /> BACK TO LOGS
                </button>
              </div>

              {/* Hero title */}
              <div className="absolute bottom-0 left-0 right-0 px-6 md:px-10 pb-8 max-w-5xl">
                <h1 className="font-display font-bold text-white text-3xl md:text-5xl uppercase tracking-wide leading-tight mb-4">
                  {selectedPost.title}
                </h1>
                <div className="flex flex-wrap items-center gap-5 text-[8px] font-mono text-neutral-400 uppercase tracking-widest">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-[#c0f20c]" /> {selectedPost.date}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-3 h-3 text-neutral-600" /> {selectedPost.readTime} READ</span>
                  <span className="flex items-center gap-1.5"><User className="w-3 h-3 text-neutral-600" /> {selectedPost.author}</span>
                  <button onClick={e => handleShare(selectedPost.id, e)} className="flex items-center gap-1.5 hover:text-[#c0f20c] transition-colors cursor-pointer">
                    <Share2 className="w-3 h-3" /> {copiedId === selectedPost.id ? 'COPIED!' : 'SHARE'}
                  </button>
                </div>
              </div>
            </div>

            {/* Content + Sidebar */}
            <div className="max-w-7xl mx-auto px-5 md:px-10 pb-24">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pt-10">
                {/* Article content */}
                <div className="lg:col-span-2 space-y-7 text-left">
                  {(() => {
                    let headingCounter = -1;
                    return selectedPost.sections.map((sect, i) => {
                    const accent = catColor[selectedPost.category] || '#c0f20c';
                    if (sect.type === 'heading') headingCounter++;
                    const hIdx = headingCounter;
                    switch (sect.type) {
                      case 'paragraph':
                        return <p key={i} className="text-neutral-300 text-sm md:text-[15px] leading-relaxed">{sect.content}</p>;
                      case 'heading':
                        return (
                          <h2
                            key={i}
                            id={`heading-${hIdx}`}
                            data-heading-idx={hIdx}
                            className="font-display font-bold text-white uppercase text-base md:text-xl tracking-wider mt-10 mb-3 border-l-[3px] pl-4"
                            style={{ borderColor: accent }}
                          >
                            {sect.content}
                          </h2>
                        );
                      case 'quote':
                        return (
                          <div key={i} className="relative border border-neutral-800 bg-neutral-950/80 rounded-sm p-5 my-6 overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-[3px]" style={{ backgroundImage: 'repeating-linear-gradient(45deg,#c0f20c,#c0f20c 6px,#000 6px,#000 12px)' }} />
                            <div className="flex items-center gap-2 font-mono text-[8px] text-[#c0f20c] font-bold mb-3 mt-1 uppercase tracking-widest">
                              <Shield className="w-3.5 h-3.5 animate-pulse" /> VERIFIED FIELD REPORT · ARCHIVE LOCKED
                            </div>
                            <p className="italic text-neutral-400 text-sm leading-relaxed">{sect.content}</p>
                          </div>
                        );
                      case 'list':
                        return (
                          <ul key={i} className="space-y-3 my-6">
                            {sect.items?.map((item, j) => (
                              <li key={j} className="flex items-start gap-3 text-sm text-neutral-300 leading-relaxed">
                                <span className="font-bold shrink-0 mt-1" style={{ color: accent }}>›</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        );
                      case 'image':
                        return (
                          <div key={i} className="my-8 space-y-2 group/img">
                            <div className="relative overflow-hidden rounded-sm border border-neutral-900 bg-neutral-950">
                              <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-cyan-400/40 z-10" />
                              <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-cyan-400/40 z-10" />
                              <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-cyan-400/40 z-10" />
                              <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-cyan-400/40 z-10" />
                              <img src={sect.src} alt={sect.alt} className="w-full h-auto max-h-[440px] object-cover opacity-60 group-hover/img:opacity-90 transition-all duration-500 group-hover/img:scale-[1.01]" />
                            </div>
                            <p className="text-[8px] font-mono text-neutral-600 uppercase tracking-widest text-center">FIG.{i + 1} — {sect.alt}</p>
                          </div>
                        );
                      case 'faq':
                        return (
                          <div key={i} className="space-y-2 my-8">
                            <div className="flex items-center gap-2 font-mono text-[8px] text-neutral-600 uppercase tracking-widest mb-4">
                              <Terminal className="w-3.5 h-3.5" /> DIAGNOSTIC INDEX · Q&amp;A
                            </div>
                            {sect.faqItems?.map((faq, fi) => <FAQItem key={fi} question={faq.q} answer={faq.a} idx={fi} />)}
                          </div>
                        );
                      default: return null;
                    }
                  });
                  })()}
                  {/* Bottom nav */}
                  <div className="pt-10 border-t border-neutral-900 flex items-center justify-between">
                    <button onClick={handleBack} className="flex items-center gap-2 font-mono text-[9px] text-[#c0f20c] hover:text-white uppercase tracking-widest font-bold cursor-pointer transition-colors">
                      <ArrowLeft className="w-3.5 h-3.5" /> BACK TO LOGS
                    </button>
                    <span className="font-mono text-[7px] text-neutral-700 uppercase tracking-widest">END OF TRANSMISSION</span>
                  </div>
                </div>

                {/* Sidebar: Article Navigator */}
                <div className="lg:col-span-1 hidden lg:block">
                  <div className="sticky top-24">
                    <ArticleNavigator
                      post={selectedPost}
                      scrollPercent={scrollPercent}
                      activeHeadingIdx={activeHeadingIdx}
                      allPosts={blogPosts}
                      onSelectPost={handleSelectPost}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
