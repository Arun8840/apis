"use client"
import React, { useOptimistic, useState } from "react"

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable"
import SortableItem from "@/components/custom/dnd-components/sortable" // assumes SortableItem definition from context

// Define the type for the item
type TodoItem = {
  id: string
  label: string
  color: string
}

// Initial items with label and color
const initialItems: TodoItem[] = [
  { id: "1", label: "Buy groceries", color: "#f87171" },
  { id: "2", label: "Walk the dog", color: "#34d399" },
  { id: "3", label: "Write code", color: "#60a5fa" },
  { id: "4", label: "Read book", color: "#fbbf24" },
  { id: "5", label: "Workout", color: "#818cf8" },
  { id: "6", label: "Cook dinner", color: "#f472b6" },
  { id: "7", label: "Call mom", color: "#38bdf8" },
  { id: "8", label: "Clean room", color: "#fde68a" },
]

function TodoContainer() {
  const [items, setItems] = useState<TodoItem[]>(initialItems)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="p-10">
        {/* The Strategy must be rectSortingStrategy for Grids */}
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-4 gap-4">
            {items.map((item) => (
              <SortableItem
                key={item.id}
                id={item.id}
                className="w-full h-20 border p-1 bg-card rounded-xl"
              >
                <div
                  className="size-full flex items-center justify-center"
                  style={{ backgroundColor: item.color }}
                >
                  {item.label}
                </div>
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </div>
    </DndContext>
  )
}

export default TodoContainer
