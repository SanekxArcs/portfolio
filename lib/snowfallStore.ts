import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SnowfallStore {
  isEnabled: boolean
  toggleSnowfall: () => void
}

function isWinterSeason(): boolean {
  const month = new Date().getMonth() // 0=Jan, 1=Feb, ..., 11=Dec
  return month === 11 || month === 0 || month === 1
}

export const useSnowfallStore = create<SnowfallStore>()(
  persist(
    (set) => ({
      isEnabled: isWinterSeason(),
      toggleSnowfall: () => set((state) => ({ isEnabled: !state.isEnabled })),
    }),
    {
      name: 'snowfall-storage',
    }
  )
)
