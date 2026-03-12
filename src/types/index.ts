import { AddComponentReqType } from "@/modules/apps/schema"
import { ColumnDef } from "@tanstack/react-table"
import React from "react"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export interface DataTableProps<TData, TValue> {
  initialPageSize?: number
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  title?: string | null
  searchBy?: string
  createAction?: React.ComponentType<ButtonProps>
}

export interface ComponentOptionTypes {
  content?: string
  src?: string
}
export interface Component {
  id: string
  type: string
  applicationId: string
  position: {
    x: number
    y: number
    w: number
    h: number
  }
  options?: ComponentOptionTypes
  style?: React.CSSProperties
  isPreview?: boolean
  isResponsive?: boolean
  pageId: string
}
export interface DroppedComponentProps {
  value: Component
  className?: string
  isPreview?: boolean
  dimensions: { colWidth: number; rowHeight: number }
}

export * from "./application-types"
