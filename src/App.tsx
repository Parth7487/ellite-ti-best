import React, { useState, useEffect } from 'react';
import { 
  FinishType, 
  KitComponent, 
  BuildState, 
  Tier2State, 
  Tier3State, 
  CartItem 
} from './types';
import CarVisualizer from './components/CarVisualizer';
import CartDrawer from './components/CartDrawer';
import { 
  ShoppingBag, 
  Search, 
  ChevronDown, 
  Sparkles, 
  Flame, 
  Check, 
  Settings, 
  Sliders, 
  Info, 
  Gauge, 
  Cpu, 
  AlertCircle,
  Clock,
  Truck,
  HelpCircle,
  Layers,
  ArrowRight,
  User,
  ShoppingCart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Nissan 350Z Top Secret Style Widebody Body Kit — real prices from Shopify CSV
const initialTier1Components: KitComponent[] = [
  { id: 'front_bumper', name: 'FRONT BUMPER', price: 955, material: 'carbon', canFRP: true, isSelected: true, finish: 'matte',
    prices: { frp: 955, matte: 2105, gloss: 2105, forged: 2315, kevlar: 2420 } },
  { id: 'front_fender', name: 'FRONT FENDER', price: 1275, material: 'carbon', canFRP: true, isSelected: true, finish: 'matte',
    prices: { frp: 1275, matte: 2805, gloss: 2805, forged: 3085, kevlar: 3225 } },
  { id: 'side_skirt', name: 'SIDE SKIRT', price: 955, material: 'carbon', canFRP: true, isSelected: true, finish: 'matte',
    prices: { frp: 955, matte: 2105, gloss: 2105, forged: 2315, kevlar: 2420 } },
  { id: 'rear_fender', name: 'REAR FENDER', price: 1595, material: 'carbon', canFRP: true, isSelected: true, finish: 'matte',
    prices: { frp: 1595, matte: 3505, gloss: 3505, forged: 3855, kevlar: 4030 } },
  { id: 'rear_bumper', name: 'REAR BUMPER', price: 955, material: 'carbon', canFRP: true, isSelected: true, finish: 'matte',
    prices: { frp: 955, matte: 2105, gloss: 2105, forged: 2315, kevlar: 2420 } },
  { id: 'fuel_cover', name: 'FUEL COVER', price: 195, material: 'carbon', canFRP: true, isSelected: true, finish: 'matte',
    prices: { frp: 195, matte: 425, gloss: 425, forged: 465, kevlar: 485 } },
  { id: 'lower_wing_top_legs', name: 'LOWER WING TOP LEGS', price: 575, material: 'carbon', canFRP: false, isSelected: true, finish: 'matte',
    prices: { matte: 575, gloss: 575, forged: 635, kevlar: 660 } }
];

// Centralized dynamic component price calculator — uses real CSV prices
export const getComponentPrice = (item: KitComponent) => {
  // If we have real per-variant prices, use them directly
  if (item.prices) {
    if (item.material === 'frp' && item.prices.frp) {
      return item.prices.frp;
    }
    if (item.material === 'carbon') {
      const fin = item.finish || 'matte';
      const price = item.prices[fin as keyof typeof item.prices];
      if (price) return price;
    }
  }
  // Fallback to base price
  return item.price;
};

export default function App() {
  // --- Cart State ---
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [shopByCarOpen, setShopByCarOpen] = useState(false);
  const [activeCar, setActiveCar] = useState('Nissan 350Z');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const productImages = [
    '/images/350z-hero-0.jpg',
    '/images/350z-hero-1.jpg',
    '/images/350z-hero-8.jpg',
    '/images/350z-hero-9.jpg'
  ];

  // Toasts / alerts
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // --- Tier 1 State ---
  const [tier1Components, setTier1Components] = useState<KitComponent[]>(initialTier1Components);
  const [tier1Finish, setTier1Finish] = useState<FinishType>('matte');
  const [tier1ActiveView, setTier1ActiveView] = useState<'front' | 'side' | 'rear' | 'hood'>('front');
  const [isCompleteKit, setIsCompleteKit] = useState(true);

  // --- Tier 2 State ---
  const [tier2, setTier2] = useState<Tier2State>({
    finish: 'matte',
    innerShell: 'standard',
    addTitaniumHardware: false
  });

  // --- Tier 3 State ---
  const [tier3, setTier3] = useState<Tier3State>({
    finish: 'raw_ti',
    quantity: 1
  });

  // Custom feedback triggers when selecting parts
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Keep Complete Kit state in sync with selected components:
  // If all 7 components are selected, complete kit toggled = true. Otherwise false.
  useEffect(() => {
    const selectedCount = tier1Components.filter(c => c.isSelected).length;
    if (selectedCount === 7 && !isCompleteKit) {
      setIsCompleteKit(true);
    } else if (selectedCount < 7 && isCompleteKit) {
      setIsCompleteKit(false);
    }
  }, [tier1Components]);

  // Handle master Complete Kit toggle switch clicks
  const handleCompleteKitToggle = () => {
    const nextState = !isCompleteKit;
    setIsCompleteKit(nextState);
    
    // Select or unselect all components
    setTier1Components(prev => prev.map(c => ({
      ...c,
      isSelected: nextState
    })));

    triggerToast(nextState 
      ? "COMPLETE KIT — ALL 7 PIECES selected with 10% discount!" 
      : "Bulk kit deselected. Standard item prices applied."
    );
  };

  // Modify individual component checkbox
  const handleComponentSelectToggle = (id: string) => {
    setTier1Components(prev => prev.map(c => {
      if (c.id === id) {
        const updatedSelected = !c.isSelected;
        // Suggest changing viewpoint based on what they click:
        if (updatedSelected) {
          if (id === 'vented_hood') setTier1ActiveView('hood');
          else if (id === 'gt_wing' || id === 'rear_bumper') setTier1ActiveView('rear');
          else if (id === 'front_bumper') setTier1ActiveView('front');
          else if (id === 'side_skirts' || id === 'front_fenders') setTier1ActiveView('side');
        }
        return { ...c, isSelected: updatedSelected };
      }
      return c;
    }));
  };

  // Modify individual component material (FRP vs CARBON)
  const handleComponentMaterialChange = (id: string, material: 'frp' | 'carbon') => {
    setTier1Components(prev => prev.map(c => {
      if (c.id === id) {
        // If switching to carbon, ensure it has a finish defined
        return { ...c, material, finish: c.finish || 'matte' };
      }
      return c;
    }));
    triggerToast(`${id.replace('_', ' ').toUpperCase()} Material configured to ${material.toUpperCase()}`);
  };

  // Modify individual component finish
  const handleComponentFinishChange = (id: string, finish: FinishType) => {
    setTier1Components(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, finish };
      }
      return c;
    }));
    triggerToast(`${id.replace('_', ' ').toUpperCase()} Finish set to ${finish.toUpperCase()}`);
  };

  // --- Calculations for Tier 1 ---
  // Subtotal counts Selected Parts referencing centralized dynamic calculator
  const calculateTier1Subtotal = () => {
    return tier1Components.reduce((sum, item) => {
      if (!item.isSelected) return sum;
      return sum + getComponentPrice(item);
    }, 0);
  };

  const tier1Subtotal = calculateTier1Subtotal();
  const tier1Discount = isCompleteKit ? Math.round(tier1Subtotal * 0.10) : 0;
  const tier1Total = tier1Subtotal - tier1Discount;
  const selectedTier1Count = tier1Components.filter(c => c.isSelected).length;

  // Add Tier 1 to Cart
  const handleAddTier1ToCart = () => {
    if (selectedTier1Count === 0) {
      triggerToast("❌ Select at least 1 component to build.");
      return;
    }

    const hasCarbon = tier1Components.some(c => c.isSelected && c.material === 'carbon');
    const selectedFins = hasCarbon ? "BESPOKE CLIENT SPEC" : 'FRP STANDARD';

    const cartId = `tier1-${Date.now()}`;
    const selectedPartNames = tier1Components
      .filter(c => c.isSelected)
      .map(c => {
        if (c.material === 'carbon') {
          return `${c.name} (${(c.finish || 'matte').toUpperCase()} CARBON)`;
        }
        return `${c.name} (FRP)`;
      });

    const newCartItem: CartItem = {
      id: cartId,
      title: "TOP SECRET STYLE WIDEBODY BODY KIT",
      subtitle: "NISSAN 350Z FULL BUILD",
      imageType: 'tier1',
      qty: 1,
      unitPrice: tier1Total,
      totalPrice: tier1Total,
      selectedOptions: [
        { label: "Finishing style", value: selectedFins },
        { label: "Pieces", value: `${selectedTier1Count} of 7` },
        { label: "Discount", value: isCompleteKit ? "10% Package Save" : "Standard Build" }
      ],
      specDetails: [
        `Package Finish: INDIVIDUAL CUSTOM SPEC`,
        ...selectedPartNames
      ]
    };

    setCart(prev => [...prev, newCartItem]);
    setIsCartOpen(true);
    triggerToast("✨ Top Secret Widebody Build Added to Cart!");
  };

  // --- Calculations for Tier 2 ---
  const calculateTier2Price = () => {
    let price = 1450; // base GT hood price
    
    // Finish pricing
    if (tier2.finish === 'forged') {
      price += 145; // 10%
    } else if (tier2.finish === 'kevlar') {
      price += 170; // 12% is ~174, let's keep it $170 as in mockup text "+$170"
    }

    // Inner Shell upgrade
    if (tier2.innerShell === 'carbon_underside') {
      price += 550;
    }

    return price;
  };

  const tier2UnitPrice = calculateTier2Price();
  // Titanium Hardware Option
  const tier2HardwarePrice = tier2.addTitaniumHardware ? 95 : 0;
  const tier2Total = tier2UnitPrice + tier2HardwarePrice;

  const handleAddTier2ToCart = () => {
    const cartId = `tier2-${Date.now()}`;
    const desc = [
      `Finish: ${tier2.finish.toUpperCase()}`,
      `Inner Shell: ${tier2.innerShell.replace('_', ' ').toUpperCase()}`,
      `Titanium Hardware: ${tier2.addTitaniumHardware ? 'Included (+$95)' : 'None'}`
    ];

    const newCartItem: CartItem = {
      id: cartId,
      title: "RE AMEMIYA GT CARBON HOOD",
      subtitle: `NISSAN 350Z / HOODS`,
      imageType: 'tier2',
      qty: 1,
      unitPrice: tier2Total,
      totalPrice: tier2Total,
      selectedOptions: [
        { label: "Finish", value: tier2.finish.toUpperCase() },
        { label: "Underside", value: tier2.innerShell === 'standard' ? 'STANDARD' : 'CARBON UNDERSIDE' },
        { label: "Hardware Upgrade", value: tier2.addTitaniumHardware ? "YES" : "NO" }
      ],
      specDetails: desc
    };

    setCart(prev => [...prev, newCartItem]);
    setIsCartOpen(true);
    triggerToast("✨ RE Amemiya Carbon Hood Config Added to Cart!");
  };

  // --- Calculations for Tier 3 ---
  const tier3UnitPrice = 189;
  const tier3Total = tier3UnitPrice * tier3.quantity;

  const handleAddTier3ToCart = () => {
    const cartId = `tier3-${Date.now()}`;
    const newCartItem: CartItem = {
      id: cartId,
      title: "ETI TITANIUM HARDWARE KIT",
      subtitle: "GRADE 5 TITANIUM SEAT-RAIL SPEC",
      imageType: 'tier3',
      qty: tier3.quantity,
      unitPrice: tier3UnitPrice,
      totalPrice: tier3Total,
      selectedOptions: [
        { label: "Metal Finish", value: tier3.finish.replace('_', ' ').toUpperCase() },
        { label: "Specs", value: "Grade 5 Titanium M10 x 1.25" }
      ]
    };

    setCart(prev => [...prev, newCartItem]);
    setIsCartOpen(true);
    triggerToast("✨ Titanium Hardware Package Added to Cart!");
  };

  // Global Cart Actions
  const handleUpdateCartQty = (id: string, newQty: number) => {
    if (newQty < 1) return;
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          qty: newQty,
          totalPrice: item.unitPrice * newQty
        };
      }
      return item;
    }));
  };

  const handleRemoveCartItem = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
    triggerToast("Item removed from your cart.");
  };

  return (
    <div className="min-h-screen bg-[#030303] text-neutral-200 selection:bg-[#c0f20c]/30 selection:text-[#c0f20c] font-sans pb-24">
      
      {/* 1. Announcement Marquee Bar */}
      <div className="w-full bg-[#0a0a0a] border-b border-neutral-900/50 py-2 overflow-hidden relative z-40">
        <div className="whitespace-nowrap flex text-[10px] uppercase font-mono tracking-[0.25em] text-neutral-400">
          <div className="animate-marquee flex gap-8 items-center">
            <span>MADE TO ORDER</span>
            <span className="text-[#c0f20c]">•</span>
            <span>TITANIUM HARDWARE</span>
            <span className="text-[#c0f20c]">•</span>
            <span>RACE-ENGINEERED</span>
            <span className="text-[#c0f20c]">•</span>
            <span>THE MANUFAKTUR FOR JDM</span>
            <span className="text-[#c0f20c]">•</span>
            <span>BUILT FOR THE DRIVEN</span>
            <span className="text-[#c0f20c]">•</span>
            <span>BESPOKE CARBON</span>
            <span className="text-[#c0f20c]">•</span>
            <span>TITANIUM HARDWARE</span>
            <span className="text-[#c0f20c]">•</span>
          </div>
          <div className="animate-marquee flex gap-8 items-center">
            <span>MADE TO ORDER</span>
            <span className="text-[#c0f20c]">•</span>
            <span>TITANIUM HARDWARE</span>
            <span className="text-[#c0f20c]">•</span>
            <span>RACE-ENGINEERED</span>
            <span className="text-[#c0f20c]">•</span>
            <span>THE MANUFAKTUR FOR JDM</span>
            <span className="text-[#c0f20c]">•</span>
            <span>BUILT FOR THE DRIVEN</span>
            <span className="text-[#c0f20c]">•</span>
            <span>BESPOKE CARBON</span>
            <span className="text-[#c0f20c]">•</span>
            <span>TITANIUM HARDWARE</span>
            <span className="text-[#c0f20c]">•</span>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Header — matches Elite TI Shopify store */}
      <header className="sticky top-0 z-30 bg-[#111111] border-b border-neutral-800/50 transition-all">
        <div className="w-full px-4 md:px-8 lg:px-12 py-0 flex items-center justify-between h-[58px]">
          
          {/* Left: Logo */}
          <a href="/" className="shrink-0 flex items-center mr-6 hover:opacity-90 transition-opacity">
            {/* ETI Stylized Logo matching the store */}
            <svg viewBox="0 0 80 32" className="h-7 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* E */}
              <path d="M2 4h18v4.5H7.5v4H17v4.5H7.5v4H20V26H2V4Z" fill="white" />
              {/* T */}
              <path d="M24 4h20v5h-7v17h-6V9h-7V4Z" fill="white" />
              {/* I */}
              <path d="M48 4h6v22h-6V4Z" fill="#c0f20c" />
              {/* Accent slash */}
              <path d="M58 4l6 0l-4 22h-6l4-22Z" fill="#c0f20c" opacity="0.3" />
            </svg>
          </a>

          {/* Center: Navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-[11px] font-display font-bold uppercase tracking-[0.15em] text-white">
            <a href="#vehicles" className="flex items-center gap-1 hover:text-[#c0f20c] transition-colors py-4">
              VEHICLES
              <ChevronDown className="w-3 h-3 text-neutral-500" />
            </a>
            <a href="#catalog" className="hover:text-[#c0f20c] transition-colors py-4">CATALOG</a>
            <a href="#titanium" className="hover:text-[#c0f20c] transition-colors py-4">TITANIUM</a>
            <a href="#motorsports" className="hover:text-[#c0f20c] transition-colors py-4">ETI MOTORSPORTS</a>
            <a href="#story" className="hover:text-[#c0f20c] transition-colors py-4">STORY</a>
            <a href="#contact" className="hover:text-[#c0f20c] transition-colors py-4">CONTACT</a>
            <a href="#swag" className="hover:text-[#c0f20c] transition-colors py-4">SWAG</a>
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 md:gap-3">

            {/* SHOP BY CAR dropdown */}
            <div className="relative hidden md:block">
              <button 
                onClick={() => setShopByCarOpen(!shopByCarOpen)}
                id="shop-by-car-dropdown"
                className="h-8 px-3 bg-[#1a1a1a] border border-neutral-700/60 rounded-full font-mono text-[9px] tracking-widest uppercase text-neutral-300 hover:border-neutral-600 transition-colors flex items-center gap-1.5"
              >
                <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 text-[#c0f20c]" fill="currentColor">
                  <path d="M2.5 9.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm11 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2zM1 7l1.5-4h11L15 7v4h-1.05a2 2 0 0 0-3.9 0H5.95a2 2 0 0 0-3.9 0H1V7z" />
                </svg>
                <span>SHOP BY CAR</span>
                <ChevronDown className="w-3 h-3 text-neutral-500" />
              </button>

              <AnimatePresence>
                {shopByCarOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 mt-1.5 w-60 rounded-lg border border-neutral-800 bg-[#0c0c0c] p-1.5 shadow-2xl z-50 text-[11px] font-mono"
                  >
                    <div className="p-2 text-[9px] text-neutral-500 uppercase tracking-wider border-b border-neutral-900 mb-1">
                      CHASSIS CONFIGURATIONS
                    </div>
                    {[
                      'Nissan 350Z',
                      'Toyota Supra (A80)',
                      'Nissan Skyline GT-R (R34)',
                      'Honda NSX (NA1)'
                    ].map((car) => (
                      <button
                        key={car}
                        onClick={() => {
                          setActiveCar(car);
                          setShopByCarOpen(false);
                          triggerToast(`Switched active catalog layout to ${car}`);
                        }}
                        className={`w-full text-left px-2.5 py-2 rounded transition-colors uppercase ${
                          activeCar === car 
                            ? 'bg-[#c0f20c]/10 text-[#c0f20c] font-bold' 
                            : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
                        }`}
                      >
                        {car}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Country / Currency selector */}
            <button className="hidden lg:flex h-8 px-3 bg-[#1a1a1a] border border-neutral-700/60 rounded-full font-mono text-[9px] tracking-widest uppercase text-neutral-300 hover:border-neutral-600 transition-colors items-center gap-1.5">
              <span>UNITED STATES</span>
              <span className="text-neutral-600">|</span>
              <span>USD $</span>
              <ChevronDown className="w-3 h-3 text-neutral-500" />
            </button>

            {/* Search */}
            <button className="w-9 h-9 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800/50 transition-all">
              <Search className="w-[18px] h-[18px]" />
            </button>

            {/* Account */}
            <button className="w-9 h-9 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800/50 transition-all">
              <User className="w-[18px] h-[18px]" />
            </button>

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              id="cart-drawer-trigger"
              className="w-9 h-9 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800/50 transition-all relative cursor-pointer"
            >
              <ShoppingCart className="w-[18px] h-[18px]" />
              {cart.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#c0f20c] text-black rounded-full text-[8px] font-mono font-bold flex items-center justify-center border-[1.5px] border-[#111111]">
                  {cart.reduce((sum, item) => sum + item.qty, 0)}
                </span>
              )}
            </button>
          </div>

        </div>
      </header>

      {/* Toast alert system for interactive styling changes */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#0e0e0e]/95 border border-[#c0f20c]/45 px-5 py-2.5 rounded shadow-2xl flex items-center gap-2 max-w-sm w-[90%] backdrop-blur-md"
          >
            <div className="w-2 h-2 rounded-full bg-[#c0f20c] animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-wider text-neutral-200 text-center w-full uppercase">
              {toastMessage}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="w-full px-6 md:px-10 lg:px-16 mt-8 space-y-20">
        
        {/* =========================================================================
            TIER 1 SECTION — NISSAN 350Z TOP SECRET STYLE WIDEBODY BODY KIT
            ========================================================================= */}
        <section className="space-y-6">
          <div className="border-b border-neutral-900 pb-5">
            {/* Breadcrumb matching layout */}
            <div className="text-[10px] font-mono tracking-[0.2em] text-neutral-500 uppercase flex items-center gap-1.5 mb-1.5">
              <span>VEHICLES</span>
              <span className="text-neutral-700">/</span>
              <span>NISSAN</span>
              <span className="text-neutral-700">/</span>
              <span className="text-[#c0f20c] font-medium">350Z</span>
            </div>

            {/* Accent badge text */}
            <span className="text-xs font-mono font-extrabold tracking-widest text-[#c0f20c] uppercase">
              NISSAN 350Z SPECIFICATION
            </span>

            {/* Header titles */}
            <h1 className="font-display font-bold text-3xl md:text-4xl text-white tracking-tight mt-1 leading-none">
              NISSAN 350Z TOP SECRET STYLE WIDEBODY BODY KIT
            </h1>
            <p className="text-[10px] font-mono tracking-widest text-neutral-400 mt-2 uppercase">
              BESPOKE CARBON • BUILT TO ORDER • $5,845.00 USD COMPLETE KIT (FRP)
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* LEFT COLUMN: Product image gallery */}
            <div className="lg:col-span-5 space-y-3">
              
              {/* Main product image */}
              <div className="relative rounded-lg overflow-hidden bg-[#0a0a0a] border border-neutral-900 aspect-square">
                <img 
                  src={productImages[activeImageIndex]} 
                  alt={`Nissan 350Z Top Secret Widebody - View ${activeImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                {/* ETI Badge overlay */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="text-[9px] font-mono font-bold tracking-widest text-[#c0f20c] bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded border border-[#c0f20c]/20 uppercase">
                    ETI ATELIER SPEC
                  </span>
                </div>
                {/* Image counter */}
                <div className="absolute bottom-4 right-4 text-[9px] font-mono font-bold text-white/70 bg-black/60 backdrop-blur-sm px-2 py-1 rounded">
                  {activeImageIndex + 1} / {productImages.length}
                </div>
              </div>

              {/* Thumbnail strip */}
              <div className="grid grid-cols-4 gap-2">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`aspect-square rounded-md overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                      activeImageIndex === idx 
                        ? 'border-[#c0f20c] shadow-[0_0_10px_rgba(192,242,12,0.2)]' 
                        : 'border-neutral-800 hover:border-neutral-600 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Fitment badge */}
              <div className="flex items-center gap-3 text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#c0f20c]" />
                  <span>FITMENT: NISSAN 350Z</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#c0f20c]" />
                  <span>7 COMPONENTS</span>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: SELECT COMPONENTS builder config */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Header select */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold tracking-widest text-[#c0f20c]">01</span>
                  <span className="text-xs font-mono font-bold tracking-widest text-white uppercase">SELECT COMPONENTS</span>
                </div>
                <span className="text-[10px] font-mono text-neutral-500 uppercase">Interactive Configurator</span>
              </div>

              {/* COMPLETE KIT TOGGLE SWITCH */}
              <div 
                onClick={handleCompleteKitToggle}
                className={`p-4 rounded-lg border transition-all duration-300 flex items-center justify-between cursor-pointer select-none relative overflow-hidden ${
                  isCompleteKit 
                    ? 'bg-[#c0f20c]/10 border-[#c0f20c] shadow-[0_0_15px_rgba(192,242,12,0.15)]' 
                    : 'bg-[#121212]/40 border-neutral-900 hover:border-neutral-800'
                }`}
              >
                {/* Visual side glow accent on selective complete kit */}
                {isCompleteKit && (
                  <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#c0f20c]" />
                )}

                <div className="flex items-center gap-3.5">
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-300 shrink-0 ${
                    isCompleteKit 
                      ? 'border-[#c0f20c] bg-[#c0f20c] shadow-[0_0_8px_rgba(192,242,12,0.4)]' 
                      : 'border-neutral-700 bg-neutral-950'
                  }`}>
                    {isCompleteKit && <Check className="w-3.5 h-3.5 text-black stroke-[3.5]" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-display font-medium text-xs text-white uppercase tracking-widest">
                        COMPLETE KIT — ALL 7 PIECES
                      </h4>
                      <span className="relative flex h-2 w-2">
                        {isCompleteKit && (
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c0f20c] opacity-75"></span>
                        )}
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${isCompleteKit ? 'bg-[#c0f20c]' : 'bg-neutral-800'}`}></span>
                      </span>
                    </div>
                    <p className="text-[10px] font-mono text-neutral-400 uppercase mt-0.5">
                      Includes matched autoclave fiber casting & factory crating
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-2">
                  <span className="text-[9.5px] font-mono font-extrabold px-2.5 py-1 rounded text-black bg-[#c0f20c] tracking-wider shadow-sm">
                    SAVE 10%
                  </span>
                </div>
              </div>

              {/* COMPONENT ROWS LIST */}
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
                {tier1Components.map((item) => {
                  const currentPrice = getComponentPrice(item);
                  const isCarbon = item.material === 'carbon';
                  const isFRP = item.material === 'frp';
                  const activeFinish = item.finish || 'matte';
                  
                  return (
                    <div 
                      key={item.id}
                      className={`p-4 rounded-lg border transition-all duration-300 relative overflow-hidden ${
                        item.isSelected 
                          ? 'bg-neutral-900/60 border-neutral-700/60 shadow-lg shadow-black/40' 
                          : 'bg-[#0a0a0a]/30 border-neutral-900/60 opacity-60 hover:opacity-95 hover:border-neutral-800 hover:bg-neutral-950/40'
                      }`}
                    >
                      {/* Active indicator top bar glow */}
                      {item.isSelected && (
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c0f20c]/60 to-transparent" />
                      )}

                      <div className="flex items-start justify-between gap-4">
                        {/* Left: Checkbox + Title + material selectors */}
                        <div className="flex-1 flex gap-4">
                          {/* custom checkbox with premium ripple */}
                          <button 
                            onClick={() => handleComponentSelectToggle(item.id)}
                            className={`w-5 h-5 rounded-md border shrink-0 flex items-center justify-center transition-all duration-300 mt-1 cursor-pointer ${
                              item.isSelected 
                                ? 'border-[#c0f20c] bg-gradient-to-br from-[#c0f20c] to-[#aacc00] shadow-[0_0_10px_rgba(192,242,12,0.3)]' 
                                : 'border-neutral-800 bg-neutral-950 hover:border-neutral-600'
                            }`}
                          >
                            {item.isSelected && <Check className="w-3.5 h-3.5 text-black stroke-[3.5]" />}
                          </button>

                          {/* Title & togglers */}
                          <div className="space-y-3 w-full">
                            <div className="flex flex-wrap items-center gap-2">
                              <span 
                                onClick={() => handleComponentSelectToggle(item.id)}
                                className={`font-display text-[13px] font-semibold tracking-wider uppercase cursor-pointer select-none block hover:text-white transition-colors duration-200 ${
                                  item.isSelected ? 'text-white font-bold' : 'text-neutral-500 line-through'
                                }`}
                              >
                                {item.name}
                              </span>
                              
                              {/* Small status indicators */}
                              {item.isSelected && (
                                <span className={`text-[8px] font-mono tracking-widest px-1.5 py-0.5 rounded leading-none ${
                                  isCarbon 
                                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                                    : 'bg-neutral-800 text-neutral-400'
                                }`}>
                                  {isCarbon ? 'BESPOKE WEAVE' : 'STANDARD GELCOAT'}
                                </span>
                              )}
                            </div>

                            {/* FRP vs CARBON materials buttons */}
                            {item.isSelected && (
                              <div className="space-y-3">
                                <div className="flex flex-wrap items-center gap-2.5">
                                  {item.canFRP ? (
                                    <div className="flex bg-neutral-950 p-[3px] rounded-md border border-neutral-850/80">
                                      <button
                                        onClick={() => handleComponentMaterialChange(item.id, 'frp')}
                                        className={`px-3.5 py-1 text-[9px] font-mono font-bold tracking-widest rounded-sm transition-all duration-200 cursor-pointer ${
                                          isFRP
                                            ? 'bg-neutral-800 text-white font-extrabold shadow-sm'
                                            : 'text-neutral-500 hover:text-neutral-300'
                                        }`}
                                      >
                                        FRP
                                      </button>
                                      <button
                                        onClick={() => handleComponentMaterialChange(item.id, 'carbon')}
                                        className={`px-3.5 py-1 text-[9px] font-mono font-bold tracking-widest rounded-sm transition-all duration-200 relative cursor-pointer ${
                                          isCarbon
                                            ? 'bg-gradient-to-r from-neutral-900 to-black text-[#c0f20c] font-extrabold border border-neutral-800'
                                            : 'text-neutral-500 hover:text-neutral-300'
                                        }`}
                                      >
                                        {isCarbon && (
                                          <span className="absolute inset-0 bg-neutral-900 carbon-weave opacity-20 rounded-sm" />
                                        )}
                                        <span className="relative z-10">CARBON</span>
                                      </button>
                                    </div>
                                  ) : (
                                    <span className="text-[8.5px] font-mono font-extrabold text-[#c0f20c]/85 bg-[#c0f20c]/5 border border-[#c0f20c]/20 px-2 py-0.5 rounded tracking-widest uppercase">
                                      CARBON ONLY
                                    </span>
                                  )}
                                </div>

                                {/* Custom Finish Selection with real visual weave previews */}
                                <AnimatePresence>
                                  {isCarbon && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      exit={{ opacity: 0, height: 0 }}
                                      className="space-y-2 pt-1.5 overflow-hidden"
                                    >
                                      <span className="text-[9px] font-mono text-neutral-500 tracking-wider uppercase block">
                                        FIBER SPECIFICATION & FINISH
                                      </span>
                                      <div className="grid grid-cols-4 gap-1.5">
                                        {[
                                          { id: 'matte', name: 'MATTE', info: 'Satin Twill', cost: 'Standard', isPremium: false },
                                          { id: 'gloss', name: 'GLOSS', info: 'Deep Shine', cost: 'Standard', isPremium: false },
                                          { id: 'forged', name: 'FORGED', info: 'Carbon Marble', cost: '+10%', isPremium: true },
                                          { id: 'kevlar', name: 'KEVLAR', info: 'Core Strength', cost: '+12%', isPremium: true }
                                        ].map((fin) => {
                                          const isFinSelected = activeFinish === fin.id;
                                          return (
                                            <button
                                              key={fin.id}
                                              onClick={() => handleComponentFinishChange(item.id, fin.id as FinishType)}
                                              title={`${fin.name} - ${fin.info}`}
                                              className={`relative h-11 rounded-md transition-all duration-300 border flex flex-col justify-center px-2 text-left cursor-pointer overflow-hidden group select-none ${
                                                isFinSelected
                                                  ? 'border-[#c0f20c] text-white shadow-[0_0_12px_rgba(192,242,12,0.1)]'
                                                  : 'border-neutral-900 bg-neutral-950/50 hover:border-neutral-800 text-neutral-400 hover:text-white'
                                              }`}
                                            >
                                              {/* Dynamic background texture representation based on finish */}
                                              {fin.id === 'forged' && (
                                                <div className="absolute inset-0 forged-weave opacity-25 group-hover:opacity-40 transition-opacity" />
                                              )}
                                              {fin.id === 'kevlar' && (
                                                <div className="absolute inset-0 kevlar-weave opacity-20 group-hover:opacity-35 transition-opacity" />
                                              )}
                                              {fin.id === 'gloss' && (
                                                <div className="absolute inset-0 carbon-weave shiny-overlay opacity-20 group-hover:opacity-45 transition-opacity" />
                                              )}
                                              {fin.id === 'matte' && (
                                                <div className="absolute inset-0 carbon-weave opacity-[0.18] group-hover:opacity-30 transition-opacity" />
                                              )}

                                              {/* Content layers */}
                                              <span className="relative z-10 text-[9px] font-mono tracking-widest font-bold leading-none uppercase">
                                                {fin.name}
                                              </span>
                                              <span className="relative z-10 text-[7.5px] font-mono text-neutral-500 mt-0.5 leading-none">
                                                {fin.cost}
                                              </span>
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Right: Dynamic configured pricing */}
                        <div className="text-right shrink-0">
                          <span className={`font-mono text-xs font-bold transition-all ${item.isSelected ? 'text-[#c0f20c]' : 'text-neutral-600'}`}>
                            ${currentPrice.toLocaleString()}
                          </span>
                          {item.isSelected && (
                            <div className="text-[8px] font-mono text-neutral-500 uppercase mt-1">
                              {isFRP ? '-$180 GELCOAT' : activeFinish === 'forged' ? '+10% FORGED' : activeFinish === 'kevlar' ? '+12% KEVLAR' : 'STAND-WEAVE'}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 02 REVIEW BUILD */}
              <div className="space-y-4 pt-4 border-t border-neutral-900">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold tracking-widest text-[#c0f20c]">02</span>
                    <span className="text-xs font-mono font-bold tracking-widest text-white uppercase">REVIEW BUILD SPECS</span>
                  </div>
                  <span className="text-[9px] font-mono text-neutral-500 uppercase">ATELIER ORDER SLIP SV01</span>
                </div>

                {/* Subtotal Box Panel (Style of high-end custom invoice spec card) */}
                <div className="p-6 rounded-lg bg-neutral-950 border border-neutral-900 shadow-2xl relative overflow-hidden space-y-5">
                  
                  {/* Watermark/grid indicator line */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-neutral-800" />
                  
                  {/* Detailed Specs List */}
                  <div className="space-y-2.5 max-h-[160px] overflow-y-auto pr-1">
                    <div className="text-[9px] font-mono tracking-widest text-[#c0f20c] font-bold uppercase mb-1.5 flex items-center justify-between pb-1 border-b border-neutral-900/60">
                      <span>SPECS MANIFEST</span>
                      <span>PRICE</span>
                    </div>
                    {selectedTier1Count === 0 ? (
                      <div className="text-[10px] font-mono text-neutral-600 uppercase text-center py-4">
                        — NO COMPONENTS SELECTED —
                      </div>
                    ) : (
                      tier1Components.filter(c => c.isSelected).map((comp) => {
                        const finalPrice = getComponentPrice(comp);
                        const label = comp.material === 'frp' ? 'FRP Standard' : `${(comp.finish || 'matte').toUpperCase()} Carbon`;
                        return (
                          <div key={comp.id} className="flex justify-between items-baseline text-[10px] font-mono">
                            <span className="text-neutral-400 uppercase truncate max-w-[180px]">{comp.name.replace(' +50MM', '')}</span>
                            <span className="mx-2 flex-grow border-b border-dotted border-neutral-900" />
                            <span className="text-[#c0f20c]/85 uppercase mr-3 text-[9px] font-bold shrink-0">{label}</span>
                            <span className="text-white font-medium shrink-0">${finalPrice.toLocaleString()}</span>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <div className="border-t border-neutral-900" />
                  
                  <div className="grid grid-cols-2 gap-y-3.5 text-xs font-mono text-neutral-400">
                    
                    <div>SELECTIONS</div>
                    <div className="text-right text-white font-bold uppercase">{selectedTier1Count} OF 7 PANELS</div>

                    <div className="border-t border-neutral-900 pt-3.5">SUBTOTAL</div>
                    <div className="text-right text-white font-bold border-t border-neutral-900 pt-3.5">
                      ${tier1Subtotal.toLocaleString()}
                    </div>

                    {isCompleteKit && (
                      <>
                        <div className="text-[#c0f20c] flex items-center gap-1.5 font-bold uppercase text-[11px]">
                          <Sparkles className="w-3 w-3 animate-pulse text-[#c0f20c]" />
                          KIT SAVE (-10%)
                        </div>
                        <div className="text-right text-[#c0f20c] font-extrabold font-mono text-[11px]">
                          -${tier1Discount.toLocaleString()}
                        </div>
                      </>
                    )}
                  </div>

                  <div className="border-t border-neutral-900/60" />

                  {/* Final Pricing */}
                  <div className="flex justify-between items-baseline pt-2">
                    <div>
                      <span className="font-display font-semibold text-[11px] text-neutral-400 tracking-wider block uppercase">TOTAL CONFIGURED SPEC</span>
                      <span className="text-[9px] font-mono text-neutral-500 uppercase mt-0.5 block">Sea Freight calculated at dispatch</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-3xl font-extrabold text-[#c0f20c] tracking-tight glow-text drop-shadow-[0_0_12px_rgba(192,242,12,0.15)]">
                        ${tier1Total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Logistic Bullet badges */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[9px] font-mono text-neutral-500 pt-2 border-t border-neutral-900/40">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#c0f20c] shrink-0" />
                      <span>AUTOCLAVED & THERMOCURED CASTING</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#c0f20c] shrink-0" />
                      <span>ATELIER CRATED SHIPPING COURIER INSURED</span>
                    </div>
                  </div>

                  {/* Kit Actions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                    <button
                      onClick={handleAddTier1ToCart}
                      id="tier1-add-to-cart"
                      className="py-4 bg-[#c0f20c] text-black hover:bg-[#aacc00] font-display font-extrabold text-[11px] uppercase tracking-widest rounded-md transition-all duration-300 shadow-[0_4px_20px_rgba(192,242,12,0.25)] flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-[1px]"
                    >
                      <ShoppingBag className="w-4 h-4 stroke-[3]" /> ADD BUILD TO CART
                    </button>
                    <button
                      onClick={() => triggerToast("Our bespoke specialist team has been notified of your interest. Check your dashboard messages shortly!")}
                      className="py-4 bg-transparent border border-neutral-800 text-neutral-300 hover:border-neutral-600 hover:text-white font-display font-bold text-[11px] uppercase tracking-widest rounded-md transition-all cursor-pointer hover:bg-neutral-900/30"
                    >
                      Want a Custom Finish
                    </button>
                  </div>

                </div>
              </div>

            </div>

          </div>
        </section>

        {/* =========================================================================
            TIER 2 SECTION — CONFIGURABLE COMPONENT (RE Amemiya GT Carbon Hood)
            ========================================================================= */}
        <section className="pt-8 border-t border-neutral-950 space-y-6">
          <div className="text-[10px] font-mono tracking-widest text-[#c0f20c] uppercase">
            TIER 2 — CONFIGURABLE COMPONENT (SAME CHASSIS, SCALED DOWN TO ONE PART)
          </div>

          <div className="bg-[#050505] rounded border border-neutral-900 overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-0">
            
            {/* Left Box: Product photo representation */}
            <div className="md:col-span-4 p-8 bg-neutral-950 border-b md:border-b-0 md:border-r border-neutral-900 flex flex-col justify-between items-start min-h-[300px]">
              
              <div className="w-full">
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block">NISSAN / 350Z / HOODS</span>
                <h3 className="font-display font-bold text-xl text-white tracking-tight uppercase mt-1">
                  RE AMEMIYA GT CARBON HOOD
                </h3>
                <span className="text-xl font-mono font-bold text-[#c0f20c] block mt-1">
                  $1,450
                </span>
              </div>

              {/* Box Placeholder */}
              <div className="w-full aspect-video md:aspect-square rounded border border-neutral-900 bg-[#030303] flex flex-col items-center justify-center p-4 relative overflow-hidden my-4 group">
                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[size:10px_10px]"></div>
                
                {/* SVG representing Carbon Hood Shape */}
                <svg viewBox="0 0 100 80" className="w-2/3 h-auto opacity-50 group-hover:opacity-80 transition-opacity">
                  <path d="M 20,10 L 80,10 L 75,70 L 25,70 Z" fill="none" stroke="#c0f20c" strokeWidth="1.5" />
                  <path d="M 33,25 L 43,25 L 41,35 L 34,35 Z" fill="#c0f20c" fillOpacity="0.3" />
                  <path d="M 67,25 L 57,25 L 59,35 L 66,35 Z" fill="#c0f20c" fillOpacity="0.3" />
                  <path d="M 35,45 L 65,45 L 61,58 L 39,58 Z" fill="#c0f20c" fillOpacity="0.2" />
                </svg>

                <div className="mt-2 text-[9px] font-mono tracking-widest text-neutral-500 uppercase">
                  PRODUCT PHOTO
                </div>
              </div>

              {/* FITMENT */}
              <div className="px-3 py-1 bg-black rounded border border-neutral-900 text-[10px] font-mono uppercase tracking-widest text-[#c0f20c]">
                • FITMENT: FD3S
              </div>

            </div>

            {/* Right Box: Customization controls */}
            <div className="md:col-span-8 p-8 space-y-6 flex flex-col justify-between">
              
              <div className="space-y-6">
                
                {/* 01 FINISH SELECTION */}
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] font-mono font-medium text-neutral-400 uppercase tracking-widest">
                      <span className="text-[#c0f20c] font-bold mr-1">01</span> FINISH
                    </span>
                    <span className="text-[9.5px] font-mono text-[#c0f20c] uppercase font-bold bg-[#c0f20c]/5 border border-[#c0f20c]/15 px-1.5 rounded">{tier2.finish}</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { id: 'matte', name: 'MATTE', info: 'Base finish', extra: 0 },
                      { id: 'gloss', name: 'GLOSS', info: 'Epoxy weaved', extra: 0 },
                      { id: 'forged', name: 'FORGED', info: 'Matrix', extra: 145 },
                      { id: 'kevlar', name: 'KEVLAR', info: 'Argrid dynamic', extra: 170 },
                    ].map((fin) => (
                      <button
                        key={fin.id}
                        onClick={() => {
                          setTier2(prev => ({ ...prev, finish: fin.id as FinishType }));
                          triggerToast(`Hood Finish changed to ${fin.name}`);
                        }}
                        className={`p-2.5 rounded border text-left flex flex-col justify-between h-20 transition-all ${
                          tier2.finish === fin.id
                            ? 'bg-[#c0f20c]/5 border-[#c0f20c]'
                            : 'bg-black border-neutral-900 hover:border-neutral-800'
                        }`}
                      >
                        <span className="font-display font-bold text-[10px] text-white tracking-widest">{fin.name}</span>
                        <div className="text-[9px] font-mono text-[#c0f20c]">
                          {fin.extra > 0 ? `+$${fin.extra}` : 'STANDARD'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 02 INNER SHELL SELECTION */}
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] font-mono font-medium text-neutral-400 uppercase tracking-widest">
                      <span className="text-[#c0f20c] font-bold mr-1">02</span> INNER SHELL
                    </span>
                    <span className="text-[9.5px] font-mono text-neutral-400 uppercase">
                      Underside reinforcement layout
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                    {/* STANDARD */}
                    <button
                      onClick={() => setTier2(prev => ({ ...prev, innerShell: 'standard' }))}
                      className={`p-4 rounded border text-left flex justify-between items-center transition-all ${
                        tier2.innerShell === 'standard'
                          ? 'bg-[#c0f20c]/5 border-[#c0f20c]'
                          : 'bg-black border-neutral-900 hover:border-neutral-800'
                      }`}
                    >
                      <div>
                        <span className="font-display font-bold text-xs text-white tracking-wider block">STANDARD</span>
                        <span className="text-[9.5px] font-mono text-neutral-500 uppercase mt-0.5 block">Fiberglass backing frame</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-neutral-400">INCLUDED</span>
                    </button>

                    {/* CARBON UNDERSIDE */}
                    <button
                      onClick={() => setTier2(prev => ({ ...prev, innerShell: 'carbon_underside' }))}
                      className={`p-4 rounded border text-left flex justify-between items-center transition-all ${
                        tier2.innerShell === 'carbon_underside'
                          ? 'bg-[#c0f20c]/5 border-[#c0f20c]'
                          : 'bg-black border-neutral-900 hover:border-neutral-800'
                      }`}
                    >
                      <div>
                        <span className="font-display font-bold text-xs text-white tracking-wider block">CARBON UNDERSIDE</span>
                        <span className="text-[9.5px] font-mono text-[#c0f20c] uppercase mt-0.5 block">Full reinforcement structure</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#c0f20c]">+$550</span>
                    </button>

                  </div>
                </div>

                {/* HARDWARE OPTIONS CHECKBOX */}
                <div className="pt-2">
                  <label 
                    onClick={() => setTier2(prev => ({ ...prev, addTitaniumHardware: !prev.addTitaniumHardware }))}
                    className="p-3.5 rounded border border-neutral-900 bg-black hover:border-neutral-800 flex items-center justify-between cursor-pointer select-none transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                        tier2.addTitaniumHardware ? 'border-[#c0f20c] bg-[#c0f20c]' : 'border-neutral-800 bg-neutral-950'
                      }`}>
                        {tier2.addTitaniumHardware && <Check className="w-3 h-3 text-black stroke-[3.5]" />}
                      </div>
                      <span className="font-display font-medium text-xs text-white uppercase tracking-wider">
                        ADD TITANIUM HARDWARE KIT
                      </span>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#c0f20c]">+$95</span>
                  </label>
                </div>

              </div>

              {/* Total Row & Add to Cart */}
              <div className="border-t border-neutral-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <span className="text-[9.5px] font-mono text-neutral-500 uppercase tracking-widest block">CONFIGURED PRICE</span>
                  <span className="font-mono text-2xl font-bold text-white">${tier2Total.toLocaleString()}</span>
                </div>
                <button
                  onClick={handleAddTier2ToCart}
                  id="tier2-add-to-cart"
                  className="w-full sm:w-auto px-8 py-3 bg-[#c0f20c] text-black hover:bg-[#aacc00] font-display font-bold text-xs uppercase tracking-widest rounded transition-all shadow-[0_4px_15px_rgba(192,242,12,0.1)] flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 stroke-[2]" /> ADD TO CART
                </button>
              </div>

            </div>

          </div>
        </section>

        {/* =========================================================================
            TIER 3 SECTION — SIMPLE PART (ETI TITANIUM HARDWARE KIT)
            ========================================================================= */}
        <section className="pt-8 border-t border-neutral-950 space-y-6">
          <div className="text-[10px] font-mono tracking-widest text-[#c0f20c] uppercase">
            TIER 3 — SIMPLE PART (TITANIUM, MANIFOLDS): NO BUILDER, JUST FINISH AND GO
          </div>

          <div className="bg-[#050505] rounded border border-neutral-900 p-5 md:p-6 flex flex-col md:flex-row items-stretch justify-between gap-6">
            
            {/* Left Col: Info panel */}
            <div className="flex-1 flex gap-4 items-start">
              
              {/* Box or avatar icon representation */}
              <div className="w-12 h-12 shrink-0 rounded bg-neutral-950 border border-neutral-900 flex items-center justify-center text-[#c0f20c]">
                <Cpu className="w-5 h-5" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">
                    ETI TITANIUM HARDWARE KIT
                  </h3>
                  <span className="text-[8px] font-mono text-[#c0f20c] uppercase tracking-widest px-1.5 py-0.5 border border-[#c0f20c]/35 rounded bg-[#c0f20c]/5 font-bold">
                    ETI ORIGINAL • IN-HOUSE
                  </span>
                </div>
                <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                  GRADE 5 TITANIUM • M10 × 1.25 SEAT-RAIL SPEC • SHIPS BY COURIER
                </p>
              </div>

            </div>

            {/* Right Col: selectors & qty button */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 shrink-0 min-w-0">
              
              {/* Option switch raw vs burnt */}
              <div className="flex border border-neutral-800 rounded bg-black h-9 p-0.5">
                <button
                  onClick={() => {
                    setTier3(prev => ({ ...prev, finish: 'raw_ti' }));
                    triggerToast("Titanium Finish configured to RAW METALLIC TI");
                  }}
                  className={`px-3 py-1.5 text-[9px] font-mono font-bold tracking-widest rounded uppercase transition-all ${
                    tier3.finish === 'raw_ti'
                      ? 'bg-neutral-800 text-white'
                      : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  RAW TI
                </button>
                <button
                  onClick={() => {
                    setTier3(prev => ({ ...prev, finish: 'burnt_blue' }));
                    triggerToast("Titanium Finish configured to BURNT BLUE dynamic spectrum");
                  }}
                  className={`px-3 py-1.5 text-[9px] font-mono font-bold tracking-widest rounded uppercase transition-all ${
                    tier3.finish === 'burnt_blue'
                      ? 'bg-[#3b82f6]/20 text-[#3b82f6] border border-[#3b82f6]/30'
                      : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  BURNT BLUE
                </button>
              </div>

              {/* Quantity Changer */}
              <div className="flex items-center border border-neutral-800 rounded bg-black h-9">
                <button
                  onClick={() => setTier3(prev => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))}
                  className="px-2.5 h-full text-neutral-400 hover:text-white transition-colors"
                >
                  -
                </button>
                <span className="px-3 text-xs font-mono font-bold text-white min-w-[20px] text-center">
                  {tier3.quantity}
                </span>
                <button
                  onClick={() => setTier3(prev => ({ ...prev, quantity: prev.quantity + 1 }))}
                  className="px-2.5 h-full text-neutral-400 hover:text-white transition-colors"
                >
                  +
                </button>
              </div>

              {/* Price & Cart CTA */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-[9px] font-mono text-neutral-500 block uppercase">SUBTOTAL</span>
                  <span className="font-mono text-base font-bold text-[#c0f20c]">${tier3Total.toLocaleString()}</span>
                </div>
                <button
                  onClick={handleAddTier3ToCart}
                  id="tier3-add-to-cart"
                  className="px-6 py-2.5 bg-neutral-900 border border-neutral-800 text-white hover:text-black hover:bg-[#c0f20c] hover:border-transparent font-display font-bold text-xs uppercase tracking-widest rounded transition-all"
                >
                  ADD TO CART
                </button>
              </div>

            </div>

          </div>
        </section>

      </main>

      {/* Slide Drawer Cart */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={() => setCart([])}
      />

      {/* Bottom Legal footer notes */}
      <footer className="mt-20 border-t border-neutral-950 bg-[#020202] py-8 text-center text-neutral-600 text-[10px] font-mono tracking-widest uppercase">
        <p>© 2026 ELITE TI CO., LTD. • ALL CHASSIS TRADEMARKS DESIGNED BY RESPECTIVE MANUFACTURERS</p>
        <p className="mt-1 text-neutral-800">POWERED BY SHOPIFY SECURE API PORTAL • TOKYO ATELIER LABS</p>
      </footer>
      
    </div>
  );
}
