"use client"
import { cn } from "@/lib/utils"
import { useDndContext, useDroppable } from "@dnd-kit/core"
import { ReactNode } from "react"

interface DroppableProps {
  id: string
  accept?: string | string[]
  children: ReactNode
  className?: string
  data?: Record<string, string>
}

const matchesAccept = (
  accept: string | string[] | undefined,
  activeType: string,
) => {
  if (!accept) return true
  if (Array.isArray(accept)) {
    return accept.includes(activeType)
  }
  return accept === activeType
}

const Droppable = ({
  id,
  accept,
  children,
  className,
  data,
}: DroppableProps) => {
  const { active } = useDndContext()
  const activeType = active?.data?.current?.accept

  const { isOver, setNodeRef } = useDroppable({
    id,
    data: { ...data, accept },
  })

  // check whether the current drag item can be dropped here
  const canDrop = !!activeType && matchesAccept(accept, activeType)

  const baseClass = cn(
    "p-3 size-full border border-dashed border-transparent transition-colors",
    isOver &&
      (canDrop
        ? "bg-blue-200/40 border-blue-400 pointer-events-auto"
        : "bg-red-100/40 border-red-400 pointer-events-none"),
  )

  return (
    <div ref={setNodeRef} className={cn(baseClass, className)}>
      {children}
    </div>
  )
}

export default Droppable
