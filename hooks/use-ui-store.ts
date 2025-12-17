import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  isReducedMotion: boolean;
  hasUserPreference: boolean;
  toggleReducedMotion: () => void;
  setReducedMotion: (value: boolean) => void;
  syncSystemPreference: (value: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isReducedMotion: false,
      hasUserPreference: false,
      toggleReducedMotion: () =>
        set((state) => ({
          isReducedMotion: !state.isReducedMotion,
          hasUserPreference: true,
        })),
      setReducedMotion: (value) =>
        set({
          isReducedMotion: value,
          hasUserPreference: true,
        }),
      syncSystemPreference: (value) =>
        set((state) => {
          if (state.hasUserPreference) return state;
          return { isReducedMotion: value };
        }),
    }),
    {
      name: "ui-storage",
    }
  )
);
