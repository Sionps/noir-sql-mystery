import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface GameState {
  currentLevel: number
  solved: number[]
  bonusClaimed: number[]
  xp: number
  hintsUsed: Record<number, number>
  accusationMade: boolean
  accusedId: number | null
  setLevel: (i: number) => void
  solveLevel: (i: number) => void
  claimBonus: (i: number) => void
  useHint: (levelNum: number) => number
  accuse: (personId: number) => void
  reset: () => void
  hintsLeftForLevel: (levelNum: number) => number
  canAccuse: () => boolean
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      currentLevel: 1,
      solved: [],
      bonusClaimed: [],
      xp: 0,
      hintsUsed: {},
      accusationMade: false,
      accusedId: null,

      setLevel: (i) => set({ currentLevel: i }),

      solveLevel: (i) => {
        if (get().solved.includes(i)) return
        set({ solved: [...get().solved, i], xp: get().xp + 100 })
      },

      claimBonus: (i) => {
        if (get().bonusClaimed.includes(i)) return
        set({ bonusClaimed: [...get().bonusClaimed, i], xp: get().xp + 50 })
      },

      useHint: (levelNum) => {
        const current = get().hintsUsed[levelNum] ?? 0
        if (current >= 3) return current
        const next = current + 1
        set({ hintsUsed: { ...get().hintsUsed, [levelNum]: next } })
        return next
      },

      accuse: (personId) => set({ accusationMade: true, accusedId: personId }),

      reset: () =>
        set({
          currentLevel: 1, solved: [], bonusClaimed: [],
          xp: 0, hintsUsed: {}, accusationMade: false, accusedId: null,
        }),

      hintsLeftForLevel: (levelNum) => 3 - (get().hintsUsed[levelNum] ?? 0),
      canAccuse: () => get().solved.length >= 8,
    }),
    { name: 'noir-sql-v1' }
  )
)
