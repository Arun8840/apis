export interface Application {
  id: string
  title: string
  description: string | null
  createdAt: Date
  updatedAt: Date
}

export type ApplicationResponse = Application

export interface DragItems {
  id: string
  type: string
  label: string
}

export type DragItemsResponse = DragItems[]
