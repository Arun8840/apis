import { Application, ApplicationStore, PageStyles } from "@/types/application-store-types"
import { Component } from "@/types"

export const initialAppState: ApplicationStore = {
  app: {} as Application,
  selectedComponentId: null,
  selectedPageId: null,
  pageStyles: null,
  setSelectedComponent: (id: string | null) => {},
  setSelectedPage: (id: string | null) => {},
  setPageStyles: (styles: PageStyles | null) => {},
  setApplication: (app: Application) => {},
  addComponent: (component: Component) => {},
  updateComponent: (component: Component) => {},
  updateComponents: (components: Component[]) => {},
  removeComponent: (id: string) => {},
}
