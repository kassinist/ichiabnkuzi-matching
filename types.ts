
export interface Store {
  id: string;
  name: string;
  address: string;
  distanceKm: number;
  rating: number;
  verified: boolean;
}

export type PrizeGrade = 'A' | 'B' | 'C' | 'D' | 'E' | 'Last One';

export interface Prize {
  id: string;
  title: string;
  grade: PrizeGrade;
  series: string;
}

export interface InventoryItem {
  id: string;
  store: Store;
  prize: Prize;
  quantity: number;
  price: number;
  photos: string[];
  status: 'public' | 'reserved' | 'sold';
  registeredAt: Date;
  score?: number;
}

export interface SearchFilters {
  query: string;
  radius: number;
  prizeGrade: PrizeGrade | 'all';
}

export type SortOption = 'score' | 'distance' | 'price' | 'newest';
