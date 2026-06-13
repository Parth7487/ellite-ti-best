export type FinishType = 'matte' | 'gloss' | 'forged' | 'kevlar';

export interface KitComponent {
  id: string;
  name: string;
  price: number;
  material: 'frp' | 'carbon';
  canFRP: boolean; // GT Wing and Vented Hood are carbon only
  isSelected: boolean;
  finish?: FinishType;
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
