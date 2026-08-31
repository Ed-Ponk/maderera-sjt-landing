import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SedeState {
  activeSedeSlug: string;
  setActiveSedeSlug: (slug: string) => void;
}

export const useSedeStore = create<SedeState>()(
  persist(
    (set) => ({
      activeSedeSlug: "talara",
      setActiveSedeSlug: (slug: string) => set({ activeSedeSlug: slug }),
    }),
    {
      name: "maderera-sjt-sede",
    }
  )
);
