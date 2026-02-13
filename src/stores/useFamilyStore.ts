import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface FamilyInfo {
  id: string
  name: string
  role: "PARENT" | "CHILD"
  nickname: string
  joinedAt: string
}

interface FamilyState {
  currentFamilyId: string | null
  families: FamilyInfo[]
  setCurrentFamily: (familyId: string) => void
  setFamilies: (families: FamilyInfo[]) => void
  getCurrentFamily: () => FamilyInfo | null
}

export const useFamilyStore = create<FamilyState>()(
  persist(
    (set, get) => ({
      currentFamilyId: null,
      families: [],

      setCurrentFamily: (familyId: string) => {
        set({ currentFamilyId: familyId })
      },

      setFamilies: (families: FamilyInfo[]) => {
        set({ families })
        // Auto-select first family if none selected
        const state = get()
        if (!state.currentFamilyId && families.length > 0) {
          set({ currentFamilyId: families[0].id })
        }
      },

      getCurrentFamily: () => {
        const state = get()
        return state.families.find((f) => f.id === state.currentFamilyId) ?? null
      },
    }),
    {
      name: "quest-family",
      partialize: (state) => ({
        currentFamilyId: state.currentFamilyId,
        families: state.families,
      }),
    },
  ),
)
