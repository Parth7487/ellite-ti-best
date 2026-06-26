import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Clock, ArrowRight, MessageSquare, Shield, Send, CheckCircle2, HelpCircle } from 'lucide-react';
import { StoreMap } from './StoreMap';

interface ContactPageProps {
  triggerToast: (msg: string) => void;
  setCurrentPage: (page: string) => void;
}

interface FAQItem {
  q: string;
  a: string;
  category: 'orders' | 'shipping' | 'custom';
}

const FAQS: FAQItem[] = [
  {
    q: "How does the custom titanium hardware sizing work?",
    a: "Every custom thread pitch and length is validated by our engineering team. If you request bespoke studs or bolts, we will request thread pitch measurements (e.g. M12x1.5, M12x1.25) and length specs. We also offer a thread pitch gauge tool with your first order.",
    category: 'custom'
  },
  {
    q: "What is the manufacturing lead time for bespoke carbon panels?",
    a: "Because all carbon pieces are laid by hand and autoclaved to order, standard manufacturing takes 4-6 weeks. Custom aerospace-grade weaves or colored kevlar patterns may require 6-8 weeks depending on autoclave schedules.",
    category: 'custom'
  },
  {
    q: "Where do you ship from, and are duties included?",
    a: "We ship worldwide from our distribution centers in Hong Kong, the USA, and Thailand. Standard international orders are shipped DDU (Delivered Duty Unpaid) unless selected otherwise during checkout. Shipping times range from 3-7 business days via DHL Express.",
    category: 'shipping'
  },
  {
    q: "Can I customize the color finish of titanium kits?",
    a: "Yes. Every titanium order can be configured in Raw Titanium, Burnt Iridescent, 24K Gold, or Royal Purple. Custom color matching for specific engine bay schemes is available upon request through our custom engineering line.",
    category: 'orders'
  }
];

export default function ContactPage({ triggerToast, setCurrentPage }: ContactPageProps) {
  // Tabs: 'inquiry' (General) or 'bespoke' (Bespoke request)
  const [activeTab, setActiveTab] = useState<'inquiry' | 'bespoke'>('inquiry');

  // Hub Clocks
  const [hkTime, setHkTime] = useState('');
  const [laTime, setLaTime] = useState('');
  const [bgkTime, setBgkTime] = useState('');

  // Selected Hub details
  const [selectedHub, setSelectedHub] = useState<'HK' | 'USA' | 'TH'>('HK');

  // General Inquiry Form
  const [inquiryForm, setInquiryForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  // Bespoke Configurator Form Steps
  const [bespokeStep, setBespokeStep] = useState(1);
  const [bespokeForm, setBespokeForm] = useState({
    make: '',
    model: '',
    year: '',
    partType: 'carbon-panel',
    finish: 'burnt',
    details: '',
    customName: '',
    customEmail: ''
  });
  const [bespokeSubmitted, setBespokeSubmitted] = useState(false);

  // FAQ search & filters
  const [faqCategory, setFaqCategory] = useState<'all' | 'orders' | 'shipping' | 'custom'>('all');
  const [faqSearch, setFaqSearch] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Live clocks update loop
  useEffect(() => {
    const updateTimes = () => {
      const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      
      setHkTime(new Date().toLocaleTimeString('en-US', { ...options, timeZone: 'Asia/Hong_Kong' }));
      setLaTime(new Date().toLocaleTimeString('en-US', { ...options, timeZone: 'America/Los_Angeles' }));
      setBgkTime(new Date().toLocaleTimeString('en-US', { ...options, timeZone: 'Asia/Bangkok' }));
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySubmitted(true);
    triggerToast("✨ Inquiry successfully dispatched to support!");
  };

  const handleBespokeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBespokeSubmitted(true);
    triggerToast("⚡ Bespoke engineering request registered!");
  };

  const filteredFAQs = FAQS.filter(faq => {
    const matchesCategory = faqCategory === 'all' || faq.category === faqCategory;
    const matchesSearch = faq.q.toLowerCase().includes(faqSearch.toLowerCase()) || 
                          faq.a.toLowerCase().includes(faqSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const hubs = {
    HK: {
      name: "ETI PACIFIC HUB (HONG KONG)",
      address: "Unit 802, King's Centre, Kowloon, Hong Kong",
      phone: "+852 2398 8122",
      email: "pacific@eti-motorsports.com",
      time: hkTime,
      tz: "GMT+8"
    },
    USA: {
      name: "ETI NORTH AMERICA HUB (LOS ANGELES)",
      address: "1080 S. Grand Avenue, Los Angeles, CA 90015",
      phone: "+1 (213) 559-0820",
      email: "usa@eti-motorsports.com",
      time: laTime,
      tz: "GMT-7"
    },
    TH: {
      name: "ETI PRODUCTION FACTORY (BANGKOK)",
      address: "42 Chom Thong Rd, Bangkok 10150, Thailand",
      phone: "+66 2 476 1120",
      email: "factory@eti-motorsports.com",
      time: bgkTime,
      tz: "GMT+7"
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-neutral-200 py-12 px-4 md:px-8 max-w-[1400px] mx-auto relative">
      
      {/* Background elements */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-[#c0f20c]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/3 blur-[160px] rounded-full pointer-events-none" />

      {/* Page Header */}
      <div className="text-center mb-16 relative z-10">
        <span className="font-mono text-[10px] text-[#c0f20c] tracking-[0.3em] uppercase block mb-3">007 — ENGINEERING SUPPORT</span>
        <h1 className="font-display text-4xl md:text-5xl uppercase font-bold tracking-wider text-white mb-6">
          CONNECT WITH THE <span className="text-[#c0f20c]">MANUFAKTUR</span>
        </h1>
        <p className="max-w-2xl mx-auto text-neutral-400 text-sm md:text-base leading-relaxed">
          Need support for your build? Submit a custom fitment spec sheet, consult our JDM specialists, or track an autoclave schedule.
        </p>

        {/* Tab Controls */}
        <div className="flex justify-center mt-10">
          <div className="bg-[#0b0b0c] p-1 border border-neutral-900 rounded-full flex gap-1">
            <button
              onClick={() => setActiveTab('inquiry')}
              className={`px-6 py-2.5 rounded-full font-mono text-[10px] tracking-widest uppercase transition-all cursor-pointer border-0 ${
                activeTab === 'inquiry' 
                  ? 'bg-[#c0f20c] text-black font-bold' 
                  : 'bg-transparent text-neutral-400 hover:text-white'
              }`}
            >
              General Inquiry
            </button>
            <button
              onClick={() => setActiveTab('bespoke')}
              className={`px-6 py-2.5 rounded-full font-mono text-[10px] tracking-widest uppercase transition-all cursor-pointer border-0 ${
                activeTab === 'bespoke' 
                  ? 'bg-[#c0f20c] text-black font-bold' 
                  : 'bg-transparent text-neutral-400 hover:text-white'
              }`}
            >
              Bespoke Fitment Form
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* LEFT COLUMN: INTERACTIVE HUB SELECTOR & Live Clocks */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Hub Selector Card */}
          <div className="bg-[#0a0a0b]/80 border border-neutral-900 rounded-2xl p-6 backdrop-blur-md">
            <h3 className="font-display font-bold text-xs uppercase tracking-widest text-white mb-6 pb-3 border-b border-neutral-900">
              GLOBAL HUBS & TIMEZONES
            </h3>
            
            <div className="flex flex-col gap-3">
              {(Object.keys(hubs) as Array<keyof typeof hubs>).map((key) => {
                const isActive = selectedHub === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedHub(key)}
                    className={`w-full text-left p-4 border rounded-xl transition-all cursor-pointer bg-transparent ${
                      isActive 
                        ? 'border-[#c0f20c] bg-[#c0f20c]/5 shadow-[0_0_15px_rgba(192,242,12,0.06)]' 
                        : 'border-neutral-900 hover:border-neutral-800 hover:bg-[#111112]/40'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className={`font-mono text-xs font-bold tracking-wider ${isActive ? 'text-[#c0f20c]' : 'text-neutral-400'}`}>
                        {key === 'HK' ? 'Hong Kong' : key === 'USA' ? 'Los Angeles' : 'Bangkok, TH'}
                      </span>
                      <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-neutral-900 text-neutral-500">
                        {hubs[key].tz}
                      </span>
                    </div>
                    <div className="font-mono text-xl font-bold tracking-widest text-[#fafaf7]">
                      {hubs[key].time || '--:--:--'}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Hub Details */}
            <div className="mt-8 pt-6 border-t border-neutral-900 text-left flex flex-col gap-4">
              <div>
                <span className="font-mono text-[9px] text-[#c0f20c] uppercase tracking-wider block mb-1">STATION ADDRESS</span>
                <p className="text-xs text-neutral-300 leading-relaxed font-sans">{hubs[selectedHub].address}</p>
              </div>
              <div>
                <span className="font-mono text-[9px] text-[#c0f20c] uppercase tracking-wider block mb-1">COMMUNICATION</span>
                <a href={`mailto:${hubs[selectedHub].email}`} className="text-xs text-neutral-300 hover:text-white transition-colors block mb-1 font-mono">
                  {hubs[selectedHub].email}
                </a>
                <a href={`tel:${hubs[selectedHub].phone}`} className="text-xs text-neutral-300 hover:text-white transition-colors block font-mono">
                  {hubs[selectedHub].phone}
                </a>
              </div>
            </div>
          </div>

          {/* Core Values Card */}
          <div className="bg-[#0a0a0b]/80 border border-neutral-900 rounded-2xl p-6 backdrop-blur-md text-left">
            <h3 className="font-display font-bold text-xs uppercase tracking-widest text-white mb-5 pb-3 border-b border-neutral-900">
              AUTOCLAVE SCHEDULES & LOGISTICS
            </h3>
            <ul className="space-y-4 list-none p-0 m-0">
              <li className="flex gap-3">
                <Shield className="w-5 h-5 text-[#c0f20c] shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-neutral-200">ISO-9001 Titanium</h4>
                  <p className="text-[11px] text-neutral-400 mt-1">We utilize aerospace Grade 5 titanium (Ti-6Al-4V) for all structural hardware.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <MessageSquare className="w-5 h-5 text-[#c0f20c] shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-neutral-200">Engineering Feedback</h4>
                  <p className="text-[11px] text-neutral-400 mt-1">All custom requests are reviewed directly by motorsport layout technicians within 24 hours.</p>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* RIGHT COLUMN: ACTIVE TAB PANEL */}
        <div className="lg:col-span-8">
          
          {/* TAB 1: GENERAL INQUIRY */}
          {activeTab === 'inquiry' && (
            <div className="bg-[#0a0a0b]/80 border border-neutral-900 rounded-2xl p-8 backdrop-blur-md text-left min-h-[600px] flex flex-col justify-between">
              <div>
                <h2 className="font-display font-bold text-xl text-white uppercase tracking-wider mb-2">
                  General Consultation
                </h2>
                <p className="text-neutral-400 text-xs mb-8">
                  Get in touch for lead-time updates, fitment suggestions, or wholesale inquiries.
                </p>

                {inquirySubmitted ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <CheckCircle2 className="w-16 h-16 text-[#c0f20c] mb-6 animate-pulse" />
                    <h3 className="font-display text-2xl font-bold uppercase text-white tracking-wider mb-3">
                      DISPATCH SUCCESSFUL
                    </h3>
                    <p className="text-neutral-400 text-xs max-w-sm mb-6 leading-relaxed">
                      Your query has been securely transmitted. An ETi engineering rep will reply at your registered email within 12 business hours.
                    </p>
                    <button 
                      onClick={() => setInquirySubmitted(false)}
                      className="px-6 py-2.5 rounded-full border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors font-mono text-[9px] tracking-widest uppercase cursor-pointer bg-transparent"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="font-mono text-[9px] text-[#c0f20c] tracking-widest uppercase">Your Name</label>
                        <input 
                          type="text" 
                          required 
                          value={inquiryForm.name}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                          className="bg-[#111112] border border-neutral-850 rounded-xl px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-[#c0f20c] transition-colors"
                          placeholder="E.g. Kenji Sato"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="font-mono text-[9px] text-[#c0f20c] tracking-widest uppercase">Email Address</label>
                        <input 
                          type="email" 
                          required 
                          value={inquiryForm.email}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                          className="bg-[#111112] border border-neutral-850 rounded-xl px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-[#c0f20c] transition-colors"
                          placeholder="sato@driftmail.com"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[9px] text-[#c0f20c] tracking-widest uppercase">Subject</label>
                      <input 
                        type="text" 
                        required 
                        value={inquiryForm.subject}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, subject: e.target.value })}
                        className="bg-[#111112] border border-neutral-850 rounded-xl px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-[#c0f20c] transition-colors"
                        placeholder="Autoclave status, Order #1042, etc."
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[9px] text-[#c0f20c] tracking-widest uppercase">Message Content</label>
                      <textarea 
                        rows={6}
                        required 
                        value={inquiryForm.message}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                        className="bg-[#111112] border border-neutral-850 rounded-xl px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-[#c0f20c] transition-colors resize-none font-sans"
                        placeholder="Detail your request or build questions here..."
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-[#c0f20c] hover:bg-[#aacc00] text-black font-bold font-mono text-[10px] tracking-widest uppercase py-4 rounded-xl transition-all cursor-pointer border-0 flex items-center justify-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Dispatch Inquiry
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: BESPOKE REQUEST FORM */}
          {activeTab === 'bespoke' && (
            <div className="bg-[#0a0a0b]/80 border border-neutral-900 rounded-2xl p-8 backdrop-blur-md text-left min-h-[600px] flex flex-col justify-between">
              <div>
                {/* Stepper indicator */}
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-neutral-900">
                  <div>
                    <h2 className="font-display font-bold text-xl text-white uppercase tracking-wider">
                      Bespoke Fitment Request
                    </h2>
                    <p className="text-neutral-400 text-xs mt-1">
                      Initiate custom engineering for a new chassis pattern.
                    </p>
                  </div>
                  {!bespokeSubmitted && (
                    <div className="font-mono text-[10px] text-neutral-400 bg-neutral-900 px-3 py-1 rounded-full border border-neutral-800">
                      STEP <span className="text-[#c0f20c] font-bold">{bespokeStep}</span> OF 3
                    </div>
                  )}
                </div>

                {bespokeSubmitted ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <CheckCircle2 className="w-16 h-16 text-[#c0f20c] mb-6 animate-pulse" />
                    <h3 className="font-display text-2xl font-bold uppercase text-white tracking-wider mb-3">
                      SPEC SHEET RECEIVED
                    </h3>
                    <p className="text-neutral-400 text-xs max-w-sm mb-6 leading-relaxed">
                      Thank you for submitting your custom fitment specifications. Our aerodynamics team will analyze your {bespokeForm.year} {bespokeForm.make} {bespokeForm.model} request and email a custom feasibility blueprint inside 24 hours.
                    </p>
                    <button 
                      onClick={() => {
                        setBespokeSubmitted(false);
                        setBespokeStep(1);
                        setBespokeForm({
                          make: '',
                          model: '',
                          year: '',
                          partType: 'carbon-panel',
                          finish: 'burnt',
                          details: '',
                          customName: '',
                          customEmail: ''
                        });
                      }}
                      className="px-6 py-2.5 rounded-full border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors font-mono text-[9px] tracking-widest uppercase cursor-pointer bg-transparent"
                    >
                      Submit Another Fitment
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleBespokeSubmit} className="space-y-6">
                    {/* STEP 1: VEHICLE SPEC */}
                    {bespokeStep === 1 && (
                      <div className="space-y-6">
                        <div className="p-4 bg-neutral-900/30 border border-neutral-900 rounded-xl mb-6">
                          <p className="text-[11px] text-[#c0f20c] font-mono uppercase tracking-wider mb-1">Step 1: Vehicle Profile</p>
                          <p className="text-xs text-neutral-400">Please provide the exact year, make, and model of your chassis.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="flex flex-col gap-2">
                            <label className="font-mono text-[9px] text-[#c0f20c] tracking-widest uppercase">Year</label>
                            <input 
                              type="text" 
                              required 
                              value={bespokeForm.year}
                              onChange={(e) => setBespokeForm({ ...bespokeForm, year: e.target.value })}
                              className="bg-[#111112] border border-neutral-850 rounded-xl px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-[#c0f20c] transition-colors"
                              placeholder="E.g. 1999"
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="font-mono text-[9px] text-[#c0f20c] tracking-widest uppercase">Make</label>
                            <input 
                              type="text" 
                              required 
                              value={bespokeForm.make}
                              onChange={(e) => setBespokeForm({ ...bespokeForm, make: e.target.value })}
                              className="bg-[#111112] border border-neutral-850 rounded-xl px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-[#c0f20c] transition-colors"
                              placeholder="E.g. Toyota"
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="font-mono text-[9px] text-[#c0f20c] tracking-widest uppercase">Model / Chassis Code</label>
                            <input 
                              type="text" 
                              required 
                              value={bespokeForm.model}
                              onChange={(e) => setBespokeForm({ ...bespokeForm, model: e.target.value })}
                              className="bg-[#111112] border border-neutral-850 rounded-xl px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-[#c0f20c] transition-colors"
                              placeholder="E.g. Supra RZ (JZA80)"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end mt-8">
                          <button 
                            type="button" 
                            disabled={!bespokeForm.year || !bespokeForm.make || !bespokeForm.model}
                            onClick={() => setBespokeStep(2)}
                            className="bg-[#c0f20c] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#aacc00] text-black font-bold font-mono text-[10px] tracking-widest uppercase px-6 py-3.5 rounded-xl transition-all cursor-pointer border-0 flex items-center gap-1.5"
                          >
                            Next Step <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* STEP 2: PART DESIGN */}
                    {bespokeStep === 2 && (
                      <div className="space-y-6">
                        <div className="p-4 bg-neutral-900/30 border border-neutral-900 rounded-xl mb-6">
                          <p className="text-[11px] text-[#c0f20c] font-mono uppercase tracking-wider mb-1">Step 2: Component Configuration</p>
                          <p className="text-xs text-neutral-400">Configure what parts and aesthetics you require for your build.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="flex flex-col gap-2">
                            <label className="font-mono text-[9px] text-[#c0f20c] tracking-widest uppercase">Component Class</label>
                            <select
                              value={bespokeForm.partType}
                              onChange={(e) => setBespokeForm({ ...bespokeForm, partType: e.target.value })}
                              className="bg-[#111112] border border-neutral-850 rounded-xl px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-[#c0f20c] transition-colors cursor-pointer"
                            >
                              <option value="carbon-panel">Bespoke Carbon Panel (Hoods, Wings, Lips)</option>
                              <option value="titanium-bolts">Titanium Engine Bay / Chassis Hardware Kit</option>
                              <option value="suspension-bracing">Bespoke Titanium Strut / Bracing System</option>
                              <option value="custom-dev">Full Aerodynamic Prototype / One-Off Design</option>
                            </select>
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="font-mono text-[9px] text-[#c0f20c] tracking-widest uppercase">Target Finish</label>
                            <select
                              value={bespokeForm.finish}
                              onChange={(e) => setBespokeForm({ ...bespokeForm, finish: e.target.value })}
                              className="bg-[#111112] border border-neutral-850 rounded-xl px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-[#c0f20c] transition-colors cursor-pointer"
                            >
                              <option value="burnt">Burnt Titanium (Iridescent accents)</option>
                              <option value="raw">Raw Titanium (Brushed satin grey)</option>
                              <option value="matte-carbon">Matte Dry Carbon Weave (12K / 3K)</option>
                              <option value="gloss-carbon">Gloss UV-Protected Carbon Weave (2x2)</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex justify-between mt-8">
                          <button 
                            type="button" 
                            onClick={() => setBespokeStep(1)}
                            className="px-6 py-3.5 rounded-xl border border-neutral-850 text-neutral-400 hover:text-white transition-all cursor-pointer bg-transparent"
                          >
                            Back
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setBespokeStep(3)}
                            className="bg-[#c0f20c] hover:bg-[#aacc00] text-black font-bold font-mono text-[10px] tracking-widest uppercase px-6 py-3.5 rounded-xl transition-all cursor-pointer border-0 flex items-center gap-1.5"
                          >
                            Next Step <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* STEP 3: DETAILS & DISPATCH */}
                    {bespokeStep === 3 && (
                      <div className="space-y-6">
                        <div className="p-4 bg-neutral-900/30 border border-neutral-900 rounded-xl mb-6">
                          <p className="text-[11px] text-[#c0f20c] font-mono uppercase tracking-wider mb-1">Step 3: Build Specifications</p>
                          <p className="text-xs text-neutral-400">Describe the specific measurements or design intent and provide your info.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="flex flex-col gap-2">
                            <label className="font-mono text-[9px] text-[#c0f20c] tracking-widest uppercase">Full Name</label>
                            <input 
                              type="text" 
                              required 
                              value={bespokeForm.customName}
                              onChange={(e) => setBespokeForm({ ...bespokeForm, customName: e.target.value })}
                              className="bg-[#111112] border border-neutral-850 rounded-xl px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-[#c0f20c] transition-colors"
                              placeholder="E.g. Dominic Toretto"
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="font-mono text-[9px] text-[#c0f20c] tracking-widest uppercase">Contact Email</label>
                            <input 
                              type="email" 
                              required 
                              value={bespokeForm.customEmail}
                              onChange={(e) => setBespokeForm({ ...bespokeForm, customEmail: e.target.value })}
                              className="bg-[#111112] border border-neutral-850 rounded-xl px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-[#c0f20c] transition-colors"
                              placeholder="dom@rx7.com"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="font-mono text-[9px] text-[#c0f20c] tracking-widest uppercase">Spec Description & Dimensions</label>
                          <textarea 
                            rows={4}
                            required 
                            value={bespokeForm.details}
                            onChange={(e) => setBespokeForm({ ...bespokeForm, details: e.target.value })}
                            className="bg-[#111112] border border-neutral-850 rounded-xl px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-[#c0f20c] transition-colors resize-none font-sans"
                            placeholder="Detail your specs, dimensions, thread sizes, or desired downforce profiles here..."
                          />
                        </div>

                        <div className="flex justify-between mt-8">
                          <button 
                            type="button" 
                            onClick={() => setBespokeStep(2)}
                            className="px-6 py-3.5 rounded-xl border border-neutral-850 text-neutral-400 hover:text-white transition-all cursor-pointer bg-transparent"
                          >
                            Back
                          </button>
                          <button 
                            type="submit"
                            disabled={!bespokeForm.customName || !bespokeForm.customEmail || !bespokeForm.details}
                            className="bg-[#c0f20c] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#aacc00] text-black font-bold font-mono text-[10px] tracking-widest uppercase px-8 py-3.5 rounded-xl transition-all cursor-pointer border-0 flex items-center gap-1.5"
                          >
                            Dispatch Spec Sheet
                          </button>
                        </div>
                      </div>
                    )}
                  </form>
                )}
              </div>
            </div>
          )}

        </div>

      </div>

      <StoreMap />

      {/* OFFICIAL DEALERS SECTION */}
      <div className="mt-24 border-t border-neutral-900 pt-16 text-left max-w-[1400px] mx-auto">
        <div className="text-center mb-12">
          <span className="font-mono text-[10px] text-[#c0f20c] tracking-[0.3em] uppercase block mb-3">AUTHORIZED PARTNERS</span>
          <h2 className="font-display text-2xl md:text-3xl font-bold uppercase text-white tracking-wider mb-6">
            OFFICIAL DEALERS
          </h2>
          <p className="text-neutral-400 text-xs md:text-sm max-w-2xl mx-auto leading-relaxed">
            Purchase authentic Elite Ti components through our trusted global network of authorized tuning shops and distributors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { region: "NORTH AMERICA", name: "Evasive Motorsports", location: "Cerritos, CA", url: "evasivemotorsports.com" },
            { region: "EUROPE", name: "JDM Distro", location: "Dublin, Ireland", url: "jdmdistro.com" },
            { region: "JAPAN", name: "Top Secret", location: "Chiba, Japan", url: "topsecret-jpn.com" },
            { region: "AUSTRALIA", name: "JDMYard", location: "Sydney, NSW", url: "jdmyard.com" }
          ].map((dealer, idx) => (
            <div key={idx} className="bg-[#0b0b0c]/60 border border-neutral-900 rounded-xl p-6 transition-all duration-300 hover:border-[#c0f20c]/40 hover:bg-[#111112]/80 group">
              <div className="font-mono text-[9px] text-[#c0f20c] tracking-widest uppercase mb-4">{dealer.region}</div>
              <h3 className="font-display font-bold text-white text-lg tracking-wide uppercase mb-1">{dealer.name}</h3>
              <p className="text-neutral-500 text-xs font-mono mb-4">{dealer.location}</p>
              <a href={`https://${dealer.url}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[10px] font-mono text-neutral-400 uppercase tracking-widest group-hover:text-white transition-colors">
                {dealer.url} <ArrowRight className="w-3 h-3 text-[#c0f20c]" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ SECTION */}
      <div className="mt-24 border-t border-neutral-900 pt-16 text-left max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="font-mono text-[10px] text-[#c0f20c] tracking-[0.3em] uppercase block mb-3">FAQ DATABASE</span>
          <h2 className="font-display text-2xl md:text-3xl font-bold uppercase text-white tracking-wider mb-6">
            FREQUENT QUESTIONS
          </h2>
          
          {/* FAQ Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mt-6 max-w-2xl mx-auto">
            <input 
              type="text" 
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              placeholder="Search FAQ keywords..."
              className="flex-1 bg-[#0b0b0c] border border-neutral-850 rounded-xl px-4 py-2.5 text-xs text-neutral-200 focus:outline-none focus:border-[#c0f20c] transition-colors"
            />
            <div className="flex gap-2 justify-center">
              {(['all', 'custom', 'shipping', 'orders'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFaqCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg font-mono text-[8px] tracking-widest uppercase transition-all cursor-pointer border border-neutral-850 ${
                    faqCategory === cat 
                      ? 'bg-[#c0f20c] border-[#c0f20c] text-black font-bold' 
                      : 'bg-[#0b0b0c] text-neutral-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-4">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx}
                  className="bg-[#0b0b0c]/60 border border-neutral-900 rounded-xl overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full text-left p-5 flex justify-between items-center bg-transparent border-0 cursor-pointer text-white"
                  >
                    <span className="text-sm font-bold tracking-wide pr-4">{faq.q}</span>
                    <HelpCircle className={`w-4 h-4 text-neutral-500 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#c0f20c]' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-0 text-xs text-neutral-400 leading-relaxed border-t border-neutral-900/50 mt-1">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-neutral-500 text-xs font-mono">
              NO MATCHING FAQ ENTRIES FOUND.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
