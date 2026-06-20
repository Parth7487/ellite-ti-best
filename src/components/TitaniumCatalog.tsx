import React, { useState } from 'react';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import { CartItem } from '../types';

interface TitaniumCatalogProps {
  onAddToCart: (item: CartItem) => void;
  triggerToast: (msg: string) => void;
  onNavigate: (path: string) => void;
}

interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  eyebrow: string;
  fitment: string;
  isSale?: boolean;
  isConfigurable?: boolean;
}

const titaniumProducts: Product[] = [
  {
    id: 'ti_turbo_guard',
    title: 'ETI UNIVERSAL TITANIUM TURBO GUARD',
    price: 287,
    image: '/images/prod_ti_turbo_guard.jpg',
    eyebrow: 'Universal Fitment',
    fitment: 'Universal'
  },
  {
    id: 'ti_rb26_manifold',
    title: 'ETI RB25/RB26 TURBO MANIFOLD',
    price: 1250,
    image: '/images/prod_rb26_manifold.jpg',
    eyebrow: 'Skyline GTR R32/R33/R34',
    fitment: 'Nissan',
    isSale: true
  },
  {
    id: 'ti_ek_manifold',
    title: 'ETI EK/EG TURBO MANIFOLD',
    price: 1350,
    image: '/images/prod_ek_manifold.jpg',
    eyebrow: 'Civic EG/EK B-Series',
    fitment: 'Honda',
    isSale: true
  },
  {
    id: 'ti_1jz_ge_manifold',
    title: 'ETI 1JZ GE TURBO MANIFOLD',
    price: 1250,
    image: '/images/prod_1jz_ge_manifold.jpg',
    eyebrow: 'Chaser/Cresta/Mark II',
    fitment: 'Toyota',
    isSale: true
  },
  {
    id: 'ti_1jz_gte_manifold',
    title: 'ETI 1JZ GTE TURBO MANIFOLD',
    price: 1250,
    image: '/images/prod_1jz_gte_manifold.jpg',
    eyebrow: 'Supra MK3 / Chaser R154',
    fitment: 'Toyota',
    isSale: true
  },
  {
    id: 'ti_2jz_ge_mid_manifold',
    title: 'ETI 2JZ GE MID MOUNT TURBO MANIFOLD',
    price: 1250,
    image: '/images/prod_2jz_ge_mid_manifold.jpg',
    eyebrow: 'Supra MK4 / Altezza JJZ',
    fitment: 'Toyota',
    isSale: true
  },
  {
    id: 'ti_2jz_ge_long_manifold',
    title: 'ETI 2JZ GE LONG RUNNER TURBO MANIFOLD',
    price: 1350,
    image: '/images/prod_2jz_ge_long_manifold.jpg',
    eyebrow: 'Supra MK4 / Aristo',
    fitment: 'Toyota'
  },
  {
    id: 'ti_rb20_manifold',
    title: 'ETI RB20/RB25/RB26 TURBO MANIFOLD',
    price: 1250,
    image: '/images/prod_rb20_manifold.jpg',
    eyebrow: 'Nissan Skyline R32/R33/R34',
    fitment: 'Nissan',
    isSale: true
  },
  {
    id: 'ti_mr2_stud_kit',
    title: 'MR2 TITANIUM MANIFOLD STUD KIT',
    price: 85,
    image: '/images/prod_mr2_stud_kit.jpg',
    eyebrow: 'MR2 SW20 3S-GTE',
    fitment: 'Toyota',
    isSale: true
  },
  {
    id: 'ti_supra_bolt_kit',
    title: 'MKIV SUPRA TITANIUM BOLT KIT',
    price: 189,
    image: '/images/prod_supra_bolt_kit.jpg',
    eyebrow: 'Supra MK4 (JZA80)',
    fitment: 'Toyota'
  },
  {
    id: 'ti_rx7_pulley_kit',
    title: 'ETI RX-7 TITANIUM PULLEY HARDWARE',
    price: 145,
    image: '/images/prod_rx7_pulley_kit.jpg',
    eyebrow: 'Mazda RX-7 FD3S',
    fitment: 'Mazda',
    isSale: true
  },
  {
    id: 'ti_rx7_key',
    title: 'ETI RX-7 TITANIUM KEY',
    price: 49.99,
    image: '/images/prod_rx7_key.jpg',
    eyebrow: 'Mazda RX-7 FD3S',
    fitment: 'Mazda'
  },
  {
    id: 'ti_fk_exhaust',
    title: 'ETI TITANIUM FULL EXHAUST FK CIVIC',
    price: 2450,
    image: '/images/prod_fk_exhaust.jpg',
    eyebrow: 'Civic Type R FK8',
    fitment: 'Honda'
  }
];

export default function TitaniumCatalog({ onAddToCart, triggerToast, onNavigate }: TitaniumCatalogProps) {
  const [products] = useState<Product[]>(titaniumProducts);
  const [selectedFitment, setSelectedFitment] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('Featured');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState<boolean>(false);

  const fitmentFilters = ['All', 'Toyota', 'Nissan', 'Honda', 'Mazda', 'Universal'];

  const filteredProducts = products
    .filter(p => {
      if (selectedFitment === 'All') return true;
      return p.fitment.toLowerCase() === selectedFitment.toLowerCase();
    })
    .sort((a, b) => {
      if (sortBy === 'Alphabetically, A-Z') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'Alphabetically, Z-A') {
        return b.title.localeCompare(a.title);
      }
      if (sortBy === 'Price, Low to High') {
        return a.price - b.price;
      }
      if (sortBy === 'Price, High to Low') {
        return b.price - a.price;
      }
      return 0; // Featured
    });

  const handleProductAction = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    const cartId = `titanium-${product.id}-${Date.now()}`;
    const newCartItem: CartItem = {
      id: cartId,
      title: product.title,
      subtitle: `${product.eyebrow} / TITANIUM`,
      imageType: 'tier3',
      qty: 1,
      unitPrice: product.price,
      totalPrice: product.price,
      selectedOptions: [
        { label: 'Fitment Spec', value: product.eyebrow.toUpperCase() },
        { label: 'Material', value: 'GRADE 5 TITANIUM' }
      ],
      specDetails: [
        `Fitment: ${product.eyebrow}`,
        `Material: Grade 5 Titanium`
      ]
    };

    onAddToCart(newCartItem);
    triggerToast(`✨ Added ${product.title} to cart!`);
  };

  return (
    <div className="eti-collection eti-surface select-none min-h-screen pb-20">
      
      {/* Breadcrumbs */}
      <nav className="eti-breadcrumb" aria-label="Breadcrumb">
        <a href="/" onClick={(e) => { e.preventDefault(); onNavigate('/'); }}>Home</a>
        <span aria-hidden="true" className="mx-2">/</span>
        <a href="/collections/all" onClick={(e) => { e.preventDefault(); onNavigate('/collections/all'); }}>Catalog</a>
        <span aria-hidden="true" className="mx-2">/</span>
        <span aria-current="page">Universal Titanium Products</span>
      </nav>

      {/* Collection Hero */}
      <header className="eti-collection-hero">
        <p className="eti-eyebrow">Grade 5 Titanium Fasteners & Manifolds</p>
        <h1 className="eti-collection-title">Universal Titanium Products</h1>
        <p className="eti-collection-subtitle">
          Exotic burned titanium manifolds, strut bars, key blanks, pulley kits, and exhaust systems. Race-engineered strength and weight reduction.
        </p>
        <div className="eti-collection-meta" aria-label="Collection metadata">
          <span>{products.length} pieces</span>
          <span aria-hidden="true" className="eti-meta-dot">·</span>
          <span>Made to Order</span>
          <span aria-hidden="true" className="eti-meta-dot">·</span>
          <span>6–8 Week Lead Time</span>
        </div>
      </header>

      {/* Filter / Sort bar */}
      <div className="max-w-[1500px] mx-auto px-6 md:px-10 lg:px-12 py-4 border-t border-b border-neutral-900 flex justify-between items-center text-xs font-mono mb-8 bg-[#0a0a0b]/80 sticky top-[64px] z-20 backdrop-blur-md">
        
        {/* Left: Filter Trigger */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
            className="flex items-center gap-2 text-white hover:text-[#c0f20c] cursor-pointer bg-transparent border-0 font-mono text-xs"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>FILTER</span>
          </button>
        </div>

        {/* Center/Right: Sort and Count */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-neutral-500 uppercase">SORT BY:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#030303] border border-neutral-900 text-white focus:outline-none pr-8 pl-2 py-1 appearance-none cursor-pointer font-bold"
              >
                <option value="Featured">FEATURED</option>
                <option value="Alphabetically, A-Z">ALPHABETICALLY, A-Z</option>
                <option value="Alphabetically, Z-A">ALPHABETICALLY, Z-A</option>
                <option value="Price, Low to High">PRICE, LOW TO HIGH</option>
                <option value="Price, High to Low">PRICE, HIGH TO LOW</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
          <span className="text-neutral-500 hidden md:inline">
            {filteredProducts.length} PRODUCTS
          </span>
        </div>
      </div>

      {/* Filter Options Panel */}
      {filterDrawerOpen && (
        <div className="max-w-[1500px] mx-auto px-6 md:px-10 lg:px-12 py-6 border-b border-neutral-900 grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 text-xs font-mono animate-fadeIn">
          <div>
            <h4 className="text-neutral-500 mb-3 uppercase tracking-wider">FILTER BY VEHICLE FITMENT:</h4>
            <div className="flex flex-wrap gap-2">
              {fitmentFilters.map(fit => (
                <button
                  key={fit}
                  onClick={() => setSelectedFitment(fit)}
                  className={`px-3 py-1.5 border rounded-none cursor-pointer uppercase transition-colors ${
                    selectedFitment === fit
                      ? 'border-[#c0f20c] bg-[#c0f20c] text-black font-bold'
                      : 'border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white bg-transparent'
                  }`}
                >
                  {fit}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-between items-end">
            <button
              onClick={() => {
                setSelectedFitment('All');
                setFilterDrawerOpen(false);
              }}
              className="text-neutral-500 hover:text-white underline cursor-pointer bg-transparent border-0"
            >
              RESET FILTERS
            </button>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="max-w-[1500px] mx-auto px-6 md:px-10 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((p, index) => (
            <a 
              key={p.id}
              href={`/products/${p.id}`}
              onClick={(e) => handleProductAction(e, p)}
              className="eti-card reveal"
              style={{ '--reveal-delay': `${(index % 8) * 60}ms` } as React.CSSProperties}
            >
              <div className="eti-card-img">
                <img 
                  src={p.image} 
                  alt={p.title} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/prod_350z_ti_hardware_kit.png';
                  }}
                />
                
                {p.isSale && <span className="eti-card-tag">Sale</span>}
                
                <div className="eti-card-ov">
                  <p className="eti-card-eyebrow">
                    {p.eyebrow}
                  </p>
                  <h3 className="eti-card-title">{p.title}</h3>
                  <div className="eti-card-foot">
                    <span className="eti-card-price">
                      ${p.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

    </div>
  );
}
