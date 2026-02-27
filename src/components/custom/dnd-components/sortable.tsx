"use client"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import React from "react"
import { cn } from "@/lib/utils"
import { Component } from "@/types"

interface AdditionalTypes {
  event?: string
}
interface SortableProps {
  id: string
  data?: Component & AdditionalTypes
  children: React.ReactNode
  className?: string
}

const SortableItem = ({ id, data, children, className }: SortableProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, data })

  const style: React.CSSProperties = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("size-fit", className)}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  )
}

export default SortableItem
