import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';

interface ModelOption {
  value: string;
  label: string;
}

interface BrandOption {
  value: string;
  label: string;
  models: ModelOption[];
}

const brandOptions: BrandOption[] = [
  {
    value: 'MAZDA',
    label: 'MAZDA',
    models: [
      { value: 'FD3S', label: 'RX-7 (FD3S)' },
      { value: 'SE3P', label: 'RX-8 (SE3P)' },
      { value: 'MAZDA 2 / 3', label: 'MAZDA 2 / 3' }
    ]
  },
  {
    value: 'TOYOTA',
    label: 'TOYOTA',
    models: [
      { value: 'JZA80', label: 'SUPRA MK4 (JZA80)' },
      { value: 'A90', label: 'SUPRA MK5 (A90)' },
      { value: 'ZN6', label: 'GT86 / FT86 (ZN6)' },
      { value: 'ZN8', label: 'GR86 (ZN8)' },
      { value: 'SW20', label: 'MR2 (SW20)' }
    ]
  },
  {
    value: 'NISSAN',
    label: 'NISSAN',
    models: [
      { value: 'R32', label: 'SKYLINE GT-R (R32)' },
      { value: 'R33', label: 'SKYLINE GT-R (R33)' },
      { value: 'R34', label: 'SKYLINE GT-R (R34)' },
      { value: 'R35', label: 'GT-R (R35)' },
      { value: 'Z33', label: '350Z (Z33)' },
      { value: 'Z34', label: '370Z (Z34)' },
      { value: 'S15', label: 'SILVIA (S15)' },
      { value: 'S14', label: 'SILVIA (S14)' },
      { value: 'S13', label: '180SX (S13)' },
      { value: 'V35', label: 'G35 (V35)' }
    ]
  },
  {
    value: 'MITSUBISHI',
    label: 'MITSUBISHI',
    models: [
      { value: '8 / 9', label: 'LANCER EVO (8 / 9)' },
      { value: 'X', label: 'LANCER EVO (X)' },
      { value: '3000GT', label: 'GTO / 3000GT' },
      { value: 'FTO', label: 'FTO' }
    ]
  },
  {
    value: 'HONDA',
    label: 'HONDA',
    models: [
      { value: 'FC / FK', label: 'CIVIC (FC / FK)' },
      { value: 'EG / EK', label: 'CIVIC (EG / EK)' },
      { value: 'JAZZ / FIT', label: 'JAZZ / FIT' }
    ]
  },
  {
    value: 'SUBARU',
    label: 'SUBARU',
    models: [
      { value: 'iMPREZA / WRX', label: 'IMPREZA / WRX' }
    ]
  },
  {
    value: 'BMW',
    label: 'BMW',
    models: [
      { value: 'F87', label: 'M2 (F87)' },
      { value: 'E46', label: 'E46' },
      { value: 'E90-E93', label: '3-SERIES (E90-E93)' },
      { value: 'F32 \u00b7 M4', label: '4-SERIES (F32 \u00b7 M4)' },
      { value: 'E60-G30', label: '5-SERIES (E60-G30)' },
      { value: 'E89', label: 'Z4 (E89)' },
      { value: 'HERITAGE & GT', label: 'HERITAGE & GT' }
    ]
  },
  {
    value: 'MERCEDES-BENZ',
    label: 'MERCEDES-BENZ',
    models: [
      { value: 'W140', label: 'S-CLASS (W140)' },
      { value: 'W220', label: 'S-CLASS (W220)' },
      { value: 'R129', label: 'SL (R129)' },
      { value: 'SLR MCLAREN', label: 'SLR MCLAREN' },
      { value: 'MORE MERCEDES', label: 'MORE MERCEDES' }
    ]
  },
  {
    value: 'PORSCHE',
    label: 'PORSCHE',
    models: [
      { value: '718', label: '718' },
      { value: '981 CAYMAN / BOXSTER', label: '981 CAYMAN / BOXSTER' },
      { value: '986 / 987', label: '986 / 987' },
      { value: '911', label: '911' },
      { value: 'CAYENNE', label: 'CAYENNE' },
      { value: 'PANAMERA', label: 'PANAMERA' },
      { value: 'TAYCAN', label: 'TAYCAN' }
    ]
  },
  {
    value: 'LAMBORGHINI',
    label: 'LAMBORGHINI',
    models: [
      { value: 'LAMBORGHINI', label: 'SHOP LAMBORGHINI' }
    ]
  },
  {
    value: 'CHEVROLET',
    label: 'CHEVROLET',
    models: [
      { value: 'C8 CORVETTE', label: 'C8 CORVETTE' }
    ]
  },
  {
    value: 'FORD',
    label: 'FORD',
    models: [
      { value: 'RANGER', label: 'RANGER' }
    ]
  },
  {
    value: 'TESLA',
    label: 'TESLA',
    models: [
      { value: 'MODEL Y', label: 'MODEL Y' },
      { value: 'MODEL S', label: 'MODEL S' },
      { value: 'MODEL X', label: 'MODEL X' },
      { value: 'MODEL 3', label: 'MODEL 3' }
    ]
  }
];

interface ModelFinderProps {
  onSearch: (query: string, message: string) => void;
}

export const ModelFinder: React.FC<ModelFinderProps> = ({ onSearch }) => {
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');

  const currentBrandData = brandOptions.find(b => b.value === selectedBrand);
  const availableModels = currentBrandData ? currentBrandData.models : [];

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBrand(e.target.value);
    setSelectedModel(''); // Reset model selection
  };

  const handleSearch = () => {
    if (selectedModel) {
      const modelLabel = availableModels.find(m => m.value === selectedModel)?.label || selectedModel;
      onSearch(selectedModel, `Filtered catalog by ${selectedBrand} ${modelLabel}`);
    } else if (selectedBrand) {
      onSearch(selectedBrand, `Filtered catalog by ${selectedBrand}`);
    } else {
      onSearch('', 'Show all catalog products');
    }
  };

  return (
    <div className="relative w-full z-20 my-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-[#0b0b0c] border border-neutral-900 p-8 md:p-10 relative overflow-hidden shadow-2xl rounded-none"
      >
        {/* Top lighting indicator */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#c0f20c]/60 to-transparent opacity-65 pointer-events-none" />

        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-2 tracking-[0.2em] text-white uppercase">
            SHOP BY COLLECTION
          </h2>
          <p className="text-neutral-500 font-mono text-[9px] tracking-widest uppercase">
            Choose options from below and find your customization
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          {/* Brand dropdown */}
          <div className="md:col-span-5 relative group">
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-neutral-500 group-hover:text-white transition-colors z-10">
              <ChevronDown size={14} />
            </div>
            <select
              value={selectedBrand}
              onChange={handleBrandChange}
              className="w-full h-12 bg-neutral-950 border border-neutral-850 text-neutral-450 hover:border-neutral-700 focus:border-neutral-700 pl-4 pr-10 font-mono text-xs uppercase tracking-wider appearance-none focus:text-white focus:outline-none transition-all duration-300 rounded-none cursor-pointer"
            >
              <option value="">Select Brand</option>
              {brandOptions.map(brand => (
                <option key={brand.value} value={brand.value}>
                  {brand.label}
                </option>
              ))}
            </select>
          </div>

          {/* Model dropdown */}
          <div className="md:col-span-5 relative group">
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-neutral-500 group-hover:text-white transition-colors z-10">
              <ChevronDown size={14} />
            </div>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={!selectedBrand}
              className="w-full h-12 bg-neutral-950 border border-neutral-850 text-neutral-450 hover:border-neutral-700 focus:border-neutral-700 pl-4 pr-10 font-mono text-xs uppercase tracking-wider appearance-none focus:text-white focus:outline-none transition-all duration-300 rounded-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <option value="">Select Model</option>
              {availableModels.map(model => (
                <option key={model.value} value={model.value}>
                  {model.label}
                </option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <div className="md:col-span-2">
            <button
              onClick={handleSearch}
              className="w-full h-12 bg-neutral-900 hover:bg-[#c0f20c] hover:text-black border border-neutral-800 hover:border-[#c0f20c] text-white font-mono text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 rounded-none cursor-pointer"
            >
              <span>Search</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
