import { Component } from "."

export interface Application {
  title: string
  description: string | null
  id: string
  createdAt: Date
  updatedAt: Date
  components: Component[]
}

export interface ApplicationStore {
  app: Application
  setApplication?: (app: Application) => void
}
