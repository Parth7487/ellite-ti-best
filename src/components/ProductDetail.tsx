import React, { useState } from 'react';
import { ArrowLeft, ShoppingBag, ShieldCheck, Truck, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { CartItem } from '../types';

interface ProductDetailProps {
  product: {
    id: string;
    title: string;
    price: number;
    image: string;
    eyebrow: string;
    fitment: string;
    description?: string;
  };
  onAddToCart: (item: CartItem) => void;
  onNavigate: (path: string) => void;
  triggerToast: (msg: string) => void;
}

export default function ProductDetail({ product, onAddToCart, onNavigate, triggerToast }: ProductDetailProps) {
  const [selectedFinish, setSelectedFinish] = useState<'burnt' | 'raw' | 'gold' | 'purple'>('burnt');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<string>('description');
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    specs: true,
    leadTime: false,
    shipping: false
  });

  const toggleAccordion = (section: string) => {
    setOpenAccordions(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getFinishLabel = () => {
    switch (selectedFinish) {
      case 'burnt': return 'BURNT IRIDESCENT';
      case 'raw': return 'RAW SHOT-PEENED';
      case 'gold': return 'ANODIZED GOLD';
      case 'purple': return 'ANODIZED PURPLE';
    }
  };

  const handleAddToCart = () => {
    const cartId = `titanium-detail-${product.id}-${selectedFinish}-${Date.now()}`;
    const calculatedPrice = product.price;

    const newCartItem: CartItem = {
      id: cartId,
      title: product.title,
      subtitle: `${product.eyebrow} / ${getFinishLabel()}`,
      imageType: 'tier3',
      qty: quantity,
      unitPrice: calculatedPrice,
      totalPrice: calculatedPrice * quantity,
      selectedOptions: [
        { label: 'Fitment Spec', value: product.eyebrow.toUpperCase() },
        { label: 'Finish Option', value: getFinishLabel() },
        { label: 'Material', value: 'GRADE 5 Ti-6Al-4V TITANIUM' }
      ],
      specDetails: [
        `Fitment: ${product.eyebrow}`,
        `Finish: ${getFinishLabel()}`,
        `Material: Grade 5 Titanium`
      ]
    };

    onAddToCart(newCartItem);
    triggerToast(`✨ Added ${quantity}x ${product.title} (${getFinishLabel()}) to cart!`);
  };

  // Get description based on product or fallback
  const getProductDescription = () => {
    if (product.description) return product.description;

    switch (product.id) {
      case 'ti_rx7_wheel_studs':
        return 'ETi Titanium Wheel Studs 55mm — Grade 5 Ti-6Al-4V conversion studs to replace OEM bolts with stud + nut setup. Standard 12x1.5 thread, 55mm length. The hardware change that simplifies wheel changes and drops rotational mass. Key Features Grade 5 Ti-6Al-4V titanium — aerospace spec, full strength rating.';
      case 'ti_rx7_key_fd':
      case 'ti_rx7_key':
        return 'Grade 5 titanium ignition key for Mazda RX-7 generations FB, FC, and FD. Available in 4 finishes: Burnt, Black, Raw Polished, or Anodized colors.';
      case 'ti_350z_hw_kit':
        return 'Elevate the form and function of your 350Z with our exclusive 96-piece (104 pieces for HR) Titanium Hardware Kit, designed to provide a seamless upgrade for your vehicle\'s front trunk, interior, and engine bay. This kit is the definitive choice for 350Z owners who demand precision, durability, and a premium finish.';
      case 'ti_supra_bolt_kit_v2':
        return 'ETi Titanium Bolt Kit — MKIV Supra (JZA80) Upgrade your MKIV Supra with EliteTi\'s comprehensive 184-piece Titanium Bolt Kit. Built for the enthusiast who accepts no compromises, this kit is a complete hardware upgrade for both performance and finish.';
      case 'ti_evo_manifold':
        return 'ETi Evo 8/9 Turbo Manifold – Maximum Power & Precision Flow Available in Titanium, Steam Pipe, or 304 Stainless Steel Unleash the full potential of your Mitsubishi Evolution 8 & 9 with the ETi Turbo Manifold, engineered for maximum exhaust flow, faster spool, and improved throttle response.';
      case 'ti_ek_strut_bar':
        return 'If you’re pushing your EG, EK, or DC2 Integra hard—whether it’s on the street or the track—chassis flex is robbing you of grip and precision. Our Titanium Strut Bar locks down your front end, giving you tighter steering response, sharper cornering, and improved stability without adding unnecessary weight.';
      case 'ti_turbo_guard':
        return 'ETi Universal Titanium Turbo Guard — titanium mesh compressor inlet guard machined for the 4″ and 4.5″ inlet sizes that match Garrett G-Series, Precision Gen2, BorgWarner EFR, and other large-frame compressor housings. Protects the compressor wheel from debris with minimal airflow restriction.';
      default:
        return 'Bespoke Grade 5 Ti-6Al-4V titanium component. Designed for high stress motorsport applications, corrosion resistance, and extreme weight reduction. Hand-burned or anodized to order in our Illinois workshop.';
    }
  };

  // Get technical specifications based on product
  const getProductSpecs = () => {
    const baseSpecs = [
      { name: 'Material', value: 'Grade 5 Ti-6Al-4V Aerospace Titanium' },
      { name: 'Tensile Strength', value: '950 MPa (Extreme Duty)' },
      { name: 'Weight Saving', value: '45% lighter than standard steel hardware' },
      { name: 'Corrosion Profile', value: 'Completely immune to salt, moisture, and road chemicals' }
    ];

    if (product.id.includes('studs')) {
      return [
        ...baseSpecs,
        { name: 'Thread Pitch', value: 'M12 x 1.5' },
        { name: 'Overall Length', value: '55mm' },
        { name: 'Includes', value: '20x Studs, 20x Open-Ended Lug Nuts' }
      ];
    }

    if (product.id.includes('manifold')) {
      return [
        ...baseSpecs,
        { name: 'Wall Thickness', value: '1.2mm Motorsports-Grade Piping' },
        { name: 'Flange Profile', value: '12mm Precision CNC Cut' },
        { name: 'Spool Improvement', value: 'Up to 250 RPM quicker spool' }
      ];
    }

    if (product.id.includes('key')) {
      return [
        ...baseSpecs,
        { name: 'Keyway Profile', value: 'OEM Spec Mazda Double-Cut' },
        { name: 'Thickness', value: '2.5mm reinforced base' }
      ];
    }

    if (product.id.includes('kit') || product.id.includes('hw')) {
      return [
        ...baseSpecs,
        { name: 'Bolt Head Style', value: 'Premium 12-Point Race Spec' },
        { name: 'Washers', value: 'Included (matching titanium finish)' }
      ];
    }

    return baseSpecs;
  };

  return (
    <div className="eti-surface min-h-screen pb-24 text-white">
      
      {/* Top navigation path & back button */}
      <div className="max-w-[1500px] mx-auto px-6 md:px-10 lg:px-12 py-6">
        <button 
          onClick={() => onNavigate('/collections/all')}
          className="flex items-center gap-2 text-neutral-400 hover:text-[#c0f20c] font-mono text-xs uppercase transition-colors bg-transparent border-0 cursor-pointer mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO COLLECTION</span>
        </button>

        {/* Breadcrumb */}
        <nav className="text-[10px] font-mono tracking-[0.2em] text-neutral-500 uppercase flex items-center gap-1.5 mb-8">
          <span className="hover:text-white cursor-pointer" onClick={() => onNavigate('/')}>HOME</span>
          <span className="text-neutral-700">/</span>
          <span className="hover:text-white cursor-pointer" onClick={() => onNavigate('/collections/all')}>TITANIUM CATALOG</span>
          <span className="text-neutral-700">/</span>
          <span className="text-[#c0f20c] font-medium">{product.title}</span>
        </nav>
      </div>

      {/* Main product detail section */}
      <div className="max-w-[1500px] mx-auto px-6 md:px-10 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16 items-start">
        
        {/* LEFT COLUMN: Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative rounded-lg overflow-hidden border border-neutral-900 aspect-square bg-[#070708] flex items-center justify-center">
            {/* Color overlay to preview the selection finish */}
            <div className={`absolute inset-0 transition-opacity duration-300 pointer-events-none mix-blend-color opacity-30 ${
              selectedFinish === 'burnt' ? 'bg-gradient-to-tr from-blue-600 via-purple-600 to-amber-500' :
              selectedFinish === 'gold' ? 'bg-amber-400' :
              selectedFinish === 'purple' ? 'bg-fuchsia-600' : 'bg-transparent'
            }`} />
            
            <img 
              src={product.image} 
              alt={product.title} 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/prod_350z_ti_hardware_kit.png';
              }}
            />
            
            {/* Lead Time Overlay Badge */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="text-[9px] font-mono font-bold tracking-widest text-[#c0f20c] bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded border border-[#c0f20c]/20 uppercase">
                6-8 WEEKS MANUFACTURE LEAD TIME
              </span>
            </div>
          </div>

          {/* Quick finish display thumbnails */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { id: 'burnt', name: 'Burnt Blue', bg: 'linear-gradient(45deg, #2563eb, #7c3aed, #d97706)' },
              { id: 'raw', name: 'Raw Ti', bg: '#8e9196' },
              { id: 'gold', name: 'Gold', bg: '#ca8a04' },
              { id: 'purple', name: 'Purple', bg: '#a21caf' }
            ].map((finish) => (
              <button
                key={finish.id}
                onClick={() => setSelectedFinish(finish.id as any)}
                className={`relative aspect-video rounded border transition-all flex flex-col items-center justify-center gap-1.5 py-2 cursor-pointer ${
                  selectedFinish === finish.id 
                    ? 'border-[#c0f20c] bg-neutral-900/60 shadow-[0_0_10px_rgba(192,242,12,0.15)]' 
                    : 'border-neutral-900 bg-neutral-950 hover:border-neutral-800'
                }`}
              >
                <div 
                  className="w-4 h-4 rounded-full border border-white/10" 
                  style={{ background: finish.bg }}
                />
                <span className="text-[8px] font-mono uppercase tracking-wider text-neutral-400">
                  {finish.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Options and pricing */}
        <div className="lg:col-span-6 space-y-8">
          
          {/* Header titles & price */}
          <div className="border-b border-neutral-900 pb-6 space-y-3">
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#c0f20c] uppercase">
              {product.eyebrow}
            </span>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-white tracking-tight leading-tight uppercase">
              {product.title}
            </h1>
            <div className="flex items-baseline gap-4 pt-2">
              <span className="text-2xl font-mono font-bold text-[#c0f20c]">
                ${product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
              </span>
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                Excl. taxes / Made to order
              </span>
            </div>
          </div>

          {/* Configuration Form */}
          <div className="space-y-6">
            
            {/* Finish selection buttons */}
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-neutral-400 uppercase tracking-widest">SELECT FINISH COLOR</span>
                <span className="text-[#c0f20c] font-bold">{getFinishLabel()}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'burnt', label: 'Burnt Iridescent' },
                  { id: 'raw', label: 'Raw Shot-Peened' },
                  { id: 'gold', label: 'Anodized Gold' },
                  { id: 'purple', label: 'Anodized Purple' }
                ].map((finish) => (
                  <button
                    key={finish.id}
                    onClick={() => setSelectedFinish(finish.id as any)}
                    className={`py-3 px-4 border rounded text-xs font-mono uppercase tracking-wider transition-all text-left flex justify-between items-center cursor-pointer ${
                      selectedFinish === finish.id 
                        ? 'border-[#c0f20c] bg-[#c0f20c]/5 text-white font-bold' 
                        : 'border-neutral-900 bg-neutral-950/40 text-neutral-400 hover:border-neutral-800'
                    }`}
                  >
                    <span>{finish.label}</span>
                    <div className={`w-2.5 h-2.5 rounded-full border border-white/20 ${
                      finish.id === 'burnt' ? 'bg-gradient-to-tr from-blue-500 to-amber-500' :
                      finish.id === 'gold' ? 'bg-yellow-500' :
                      finish.id === 'purple' ? 'bg-purple-600' : 'bg-neutral-400'
                    }`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector & Action Button */}
            <div className="flex gap-4 items-end pt-4">
              
              {/* Qty Selector */}
              <div className="space-y-2 shrink-0">
                <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-widest">QTY</label>
                <div className="flex items-center border border-neutral-900 bg-neutral-950 rounded overflow-hidden h-12">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 text-neutral-400 hover:text-white bg-transparent border-0 font-mono text-base cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-mono text-sm font-bold text-white select-none">
                    {quantity}
                  </span>
                  <button 
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-10 text-neutral-400 hover:text-white bg-transparent border-0 font-mono text-base cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add To Cart Button */}
              <button
                onClick={handleAddToCart}
                className="flex-1 h-12 bg-[#c0f20c] hover:bg-[#b0dc0b] text-black font-mono text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-all cursor-pointer rounded"
              >
                <ShoppingBag className="w-4 h-4 text-black" />
                <span>ALLOCATE ORDER BUILD</span>
              </button>
            </div>
          </div>

          {/* Accordion Sheets */}
          <div className="border-t border-neutral-900 pt-6 space-y-4">
            
            {/* Description Sheet */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">PRODUCT OVERVIEW</h4>
              <p className="text-xs font-mono text-neutral-400 leading-relaxed uppercase">
                {getProductDescription()}
              </p>
            </div>

            {/* Specs Accordion */}
            <div className="border-t border-neutral-900 pt-4">
              <button
                onClick={() => toggleAccordion('specs')}
                className="w-full flex justify-between items-center text-xs font-mono uppercase tracking-wider text-neutral-300 py-2 cursor-pointer bg-transparent border-0"
              >
                <span>TECHNICAL SPECIFICATIONS</span>
                {openAccordions.specs ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
              </button>
              
              {openAccordions.specs && (
                <div className="mt-3 overflow-hidden rounded border border-neutral-900 bg-neutral-950/40 text-xs font-mono">
                  <div className="divide-y divide-neutral-900/60">
                    {getProductSpecs().map((spec, i) => (
                      <div key={i} className="flex p-3 justify-between items-baseline uppercase">
                        <span className="text-neutral-500">{spec.name}</span>
                        <span className="text-neutral-300 text-right max-w-xs">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Lead Time Info Box */}
            <div className="border-t border-neutral-900 pt-4">
              <button
                onClick={() => toggleAccordion('leadTime')}
                className="w-full flex justify-between items-center text-xs font-mono uppercase tracking-wider text-neutral-300 py-2 cursor-pointer bg-transparent border-0"
              >
                <span>MADE-TO-ORDER WARRANTY</span>
                {openAccordions.leadTime ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
              </button>
              
              {openAccordions.leadTime && (
                <div className="mt-3 p-4 bg-neutral-950/40 border border-neutral-900 rounded space-y-3 font-mono text-xs text-neutral-400 uppercase leading-relaxed">
                  <p>
                    All Elite Ti pieces are custom made in low volumes to maintain precise tolerances. Due to our extensive autoclave curing and burn tempering, allow between 6-8 weeks for delivery.
                  </p>
                  <p>
                    Each component is serialized and carries a lifetime structural warranty against fatigue cracks and heat failure.
                  </p>
                </div>
              )}
            </div>
            
          </div>

          {/* Quick trust metrics */}
          <div className="grid grid-cols-3 gap-4 border-t border-neutral-900 pt-8 text-[9px] font-mono text-neutral-500 uppercase tracking-widest text-center">
            <div className="flex flex-col items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#c0f20c] opacity-80" />
              <span>100% GR5 TITANIUM</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Truck className="w-5 h-5 text-[#c0f20c] opacity-80" />
              <span>INSURED GLOBAL S/P</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <RefreshCw className="w-5 h-5 text-[#c0f20c] opacity-80" />
              <span>LIFETIME STRUCTURAL warranty</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
