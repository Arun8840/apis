import { Application, ApplicationStore } from "@/types/application-store-types"
import { Component } from "@/types"

export const initialAppState: ApplicationStore = {
  app: {} as Application,
  selectedComponentId: null,
  setSelectedComponent: (id: string | null) => {},
  setApplication: (app: Application) => {},
  addComponent: (component: Component) => {},
  updateComponent: (component: Component) => {},
  updateComponents: (components: Component[]) => {},
  removeComponent: (id: string) => {},
}
