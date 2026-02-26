import { create } from "zustand"
import { initialAppState } from "./state"
import { Application, ApplicationStore } from "@/types/application-store-types"

export const useApplicationStore = create<ApplicationStore>((set) => ({
  ...initialAppState,
  setApplication: (app: Application) =>
    set(() => ({
      app,
    })),
}))
