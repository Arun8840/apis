export { type Application } from "."
export type { PageStyles } from "./application-types"
import { Component, Application } from "."
import { PageStyles } from "./application-types"

export interface ApplicationStore {
  app: Application
  selectedComponentId: string | null
  selectedPageId: string | null
  pageStyles: PageStyles | null
  setSelectedComponent: (id: string | null) => void
  setSelectedPage: (id: string | null) => void
  setPageStyles: (styles: PageStyles | null) => void
  setApplication?: (app: Application) => void
  addComponent?: (comp: Component) => void
  updateComponent?: (comp: Component) => void
  updateComponents?: (comps: Component[]) => void
  removeComponent?: (id: string) => void
}
