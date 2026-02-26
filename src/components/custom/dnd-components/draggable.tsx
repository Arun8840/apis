"use client"
import { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { DragItems } from "@/types/application-types"
import { useDraggable } from "@dnd-kit/react"

interface DraggableProps {
  id: string
  type?: string
  children: ReactNode
  className?: string
  dragData?: DragItems
}

const Draggable = ({
  id,
  type,
  children,
  className,
  dragData,
}: DraggableProps) => {
  const { ref } = useDraggable({
    id: id,
    type,
    data: { ...dragData },
  })

  return (
    <div ref={ref} className={cn(className)} tabIndex={0} role="button">
      {children}
    </div>
  )
}
export default Draggable
