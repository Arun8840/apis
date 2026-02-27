"use client"
import { cn } from "@/lib/utils"
import { useDroppable, useDndContext } from "@dnd-kit/core"
import { ReactNode } from "react"

interface DroppableProps {
  id: string
  accept?: string | string[]
  children: ReactNode
  className?: string
  data?: Record<string, string>
}

const Droppable = ({
  id,
  accept,
  children,
  className,
  data,
}: DroppableProps) => {
  const { active } = useDndContext()

  const isTypeMatch = () => {
    if (!accept || !active?.data?.current?.accept) return true
    const activeType = active.data.current.accept
    if (Array.isArray(accept)) {
      return accept.includes(activeType)
    }
    return activeType === accept
  }
  const { isOver, setNodeRef } = useDroppable({
    id,
    data: { accept, ...data },
    disabled: accept ? !isTypeMatch() : false,
  })

  const isValidDrop = isTypeMatch()

  const baseClass = cn(
    "p-3 size-full border border-dashed border-transparent transition-colors",
    isValidDrop &&
      (isOver ? "bg-blue-200/40 border-blue-400 pointer-events-auto" : null),
  )

  return (
    <div
      ref={isValidDrop ? setNodeRef : undefined}
      className={cn(baseClass, className)}
    >
      {children}
    </div>
  )
}

export default Droppable
