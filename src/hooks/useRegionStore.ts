import { create } from 'zustand';

import { Region } from '../types/regionType';

export const useRegion = create<Region>((set) => ({
  countryCode: null,
  setCountryCode: (countryCode) => set({ countryCode }),
}));
