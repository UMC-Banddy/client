import { create } from 'zustand';

interface SampleState {
  count: number;
  increment: () => void;
  decrement: () => void;
}

export const useSampleStore = create<SampleState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));
