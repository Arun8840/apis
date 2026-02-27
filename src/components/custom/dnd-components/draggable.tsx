"use client"
import { ReactNode } from "react"
import { useDraggable } from "@dnd-kit/core"
import { cn } from "@/lib/utils"
import { DragItems } from "@/types/application-types"

interface AdditionalTypes {
  event?: string
}
interface DraggableProps {
  id: string
  type?: string
  children: ReactNode
  className?: string
  dragData?: DragItems & AdditionalTypes
}

const Draggable = ({
  id,
  type,
  children,
  className,
  dragData,
}: DraggableProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
      data: { accept: type, ...dragData },
    })

  // Remove transition for instant movement during drag
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.9 : undefined,
        cursor: "grab",
        transition: "none", // <--- disables transition for snappier drag
        willChange: "transform", // <--- hint browser for better perf
      }
    : undefined

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(className)}
      style={style}
      tabIndex={0}
      role="button"
    >
      {children}
    </div>
  )
}

export default Draggable
