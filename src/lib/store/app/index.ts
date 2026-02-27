import { create } from "zustand"
import { initialAppState } from "./state"
import { Application, ApplicationStore } from "@/types/application-store-types"
import { Component } from "@/types"

export const useApplicationStore = create<ApplicationStore>((set) => ({
  ...initialAppState,
  setApplication: (app: Application) =>
    set(() => ({
      app,
    })),
  addComponent: (component: Component) => {
    set((state) => ({
      app: {
        ...state?.app,
        components: [...state?.app?.components, component],
      },
    }))
  },

  updateComponent: (component: Component) => {
    set((state) => ({
      app: {
        ...state?.app,
        components: state?.app?.components?.map((comp) => {
          if (comp?.id === component?.id) {
            return {
              ...comp,
              position: component?.position,
            }
          }
          return comp
        }),
      },
    }))
  },
}))
