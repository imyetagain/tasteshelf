import { create } from 'zustand';

import { Action, Dialog } from '../types/dialogType';

export const useDialog = create<Dialog>((set) => ({
  action: null,
  setAction: (action: Action | null) => set({ action }),
}));
