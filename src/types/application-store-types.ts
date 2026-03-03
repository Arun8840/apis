export { type Application } from "."
import { Component, Application } from "."

export interface ApplicationStore {
  app: Application
  selectedComponentId: string | null
  setSelectedComponent: (id: string | null) => void
  setApplication?: (app: Application) => void
  addComponent?: (comp: Component) => void
  updateComponent?: (comp: Component) => void
  updateComponents?: (comps: Component[]) => void
  removeComponent?: (id: string) => void
}
