"use client"

import { CSSProperties, ReactNode } from "react"
import { useDraggable } from "@dnd-kit/core"
import { cn } from "@/lib/utils"
import { DragItems } from "@/types/application-types"
import { Component } from "@/types"

interface AdditionalTypes {
  event?: string
}

interface DraggableProps {
  id: string
  type?: string
  children: ReactNode
  className?: string
  dragData?: (DragItems & AdditionalTypes) | Component
  style?: CSSProperties
  dragHandle?: boolean
}

const Draggable = ({
  id,
  type,
  children,
  className,
  dragData,
  dragHandle = false,
  style: gridStyle,
}: DraggableProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
      data: { ...dragData, accept: type },
    })

  // Merge Grid Coordinates with Dnd-Kit Transform
  const combinedStyle: CSSProperties = {
    ...gridStyle,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.8 : undefined,
    zIndex: isDragging ? 50 : undefined,
    transition: isDragging ? "none" : "none",
    touchAction: "none",
    cursor: isDragging ? "grabbing" : dragHandle ? "auto" : "grab",
  }

  if (dragHandle) {
    // Only handler is draggable, main area is not
    return (
      <div
        ref={setNodeRef}
        className={cn("relative group", className)}
        style={combinedStyle}
      >
        <div
          {...listeners}
          {...attributes}
          className="absolute -top-3 -left-3 z-50 cursor-grab bg-white border rounded shadow p-1 opacity-0 group-hover:opacity-100 transition-opacity active:cursor-grabbing"
        >
          <span className="text-xs">⠿</span>
        </div>
        {children}
      </div>
    )
  } else {
    // Whole area is draggable; no handler shown
    return (
      <div
        ref={setNodeRef}
        className={cn("relative", className)}
        style={combinedStyle}
        {...listeners}
        {...attributes}
      >
        {children}
      </div>
    )
  }
}

export default Draggable
