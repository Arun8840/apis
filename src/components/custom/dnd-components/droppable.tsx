"use client"
import React from "react"
import { cn } from "@/lib/utils"
import { useDroppable } from "@dnd-kit/react"

interface DroppableProps {
  id: string
  accept?: string[]
  data?: Record<string, unknown>
  children: React.ReactNode
  className?: string
}

const baseClass =
  "size-full data-[hovered=true]:bg-blue-600/20 transition-colors p-2"
const Droppable: React.FC<DroppableProps> = ({
  data,
  id,
  accept,
  children,
  className,
}) => {
  const { ref, isDropTarget } = useDroppable({
    id,
    accept,
    data: { ...data },
  })
  return (
    <div
      data-hovered={isDropTarget}
      ref={ref}
      className={cn(baseClass, className)}
    >
      {children}
    </div>
  )
}

export default Droppable
