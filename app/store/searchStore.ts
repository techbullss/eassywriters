import { create } from 'zustand';

type SearchState = {
  orderId: string;
  email: string;
  startDate: string;
  endDate: string;
  setFilters: (filters: Partial<SearchState>) => void;
};

export const useSearchStore = create<SearchState>((set) => ({
  orderId: '',
  email: '',
  startDate: '',
  endDate: '',
  setFilters: (filters) => set((state) => ({ ...state, ...filters })),
}));