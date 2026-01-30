
export interface ElementData {
  atomicNumber: number;
  symbol: string;
  name: string;
  persianName: string;
  category: ElementCategory;
  electronConfig: string;
  group: number;
  period: number;
  atomicMass: number;
}

export enum ElementCategory {
  ALKALI_METAL = 'alkali-metal',
  ALKALINE_EARTH = 'alkaline-earth',
  TRANSITION_METAL = 'transition-metal',
  POST_TRANSITION_METAL = 'post-transition-metal',
  METALLOID = 'metalloid',
  NONMETAL = 'nonmetal',
  HALOGEN = 'halogen',
  NOBLE_GAS = 'noble-gas',
  LANTHANIDE = 'lanthanide',
  ACTINIDE = 'actinide'
}
