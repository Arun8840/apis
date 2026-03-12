import { Component } from "."

export interface Application {
  name: string
  id: string
  createdAt: Date
  updatedAt: Date
  description: string
  applicationId: string
  components: Component[]
}

export type ApplicationResponse = Application

export interface DragItems {
  id: string
  type: string
  label: string
}

export type DragItemsResponse = DragItems[]

export interface PageType {
  name: string
  id: string
  createdAt: Date
  updatedAt: Date
  description: string
  applicationId: string
}
