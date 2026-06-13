export type FinishType = 'matte' | 'gloss' | 'forged' | 'kevlar';

export interface KitComponent {
  id: string;
  name: string;
  price: number; // base FRP price
  material: 'frp' | 'carbon';
  canFRP: boolean;
  isSelected: boolean;
  finish?: FinishType;
  // Real per-material prices from CSV
  prices?: {
    frp?: number;
    matte?: number;
    gloss?: number;
    forged?: number;
    kevlar?: number;
  };
}

export interface BuildState {
  components: KitComponent[];
  finish: FinishType;
  isCompleteKitSelected: boolean;
}

export interface Tier2State {
  finish: FinishType;
  innerShell: 'standard' | 'carbon_underside';
  addTitaniumHardware: boolean;
}

export interface Tier3State {
  finish: 'raw_ti' | 'burnt_blue';
  quantity: number;
}

export interface CartItem {
  id: string;
  title: string;
  subtitle: string;
  imageType: 'tier1' | 'tier2' | 'tier3';
  qty: number;
  unitPrice: number;
  totalPrice: number;
  selectedOptions: {
    label: string;
    value: string;
  }[];
  specDetails?: string[];
}
