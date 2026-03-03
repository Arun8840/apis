import { create } from "zustand"
import { initialAppState } from "./state"
import { Application, ApplicationStore } from "@/types/application-store-types"
import { Component } from "@/types"

export const useApplicationStore = create<ApplicationStore>((set) => ({
  ...initialAppState,
  selectedComponentId: null,
  setSelectedComponent: (id: string | null) =>
    set(() => ({
      selectedComponentId: id,
    })),
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
              data: component?.data,
            }
          }
          return comp
        }),
      },
    }))
  },
  updateComponents: (components: Component[]) => {
    set((state) => ({
      app: {
        ...state?.app,
        components: state?.app?.components?.map((comp) => {
          const updated = components.find((c) => c.id === comp.id)
          return updated || comp
        }),
      },
    }))
  },
  removeComponent: (id: string) => {
    set((state) => ({
      app: {
        ...state?.app,
        components: state?.app?.components?.filter((comp) => comp?.id !== id),
      },
    }))
  },
}))
