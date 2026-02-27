import Draggable from "@/components/custom/dnd-components/draggable"
import { Button } from "@/components/ui/button"
import { DragItemsResponse } from "@/types/application-types"
import { Heading, Pilcrow } from "lucide-react"
import React from "react"

interface ApplicationDragItemsProps {
  items: DragItemsResponse
}

const dragItemIcons = {
  Heading: Heading,
  Paragraph: Pilcrow,
}

const ApplicationDragItems: React.FC<ApplicationDragItemsProps> = ({
  items,
}) => {
  const createDragItems = () => {
    return items?.map((comp, compIdx) => {
      const Icon = dragItemIcons?.[comp?.label as keyof typeof dragItemIcons]
      return (
        <Button key={comp?.id} size={"sm"} variant={"secondary"} asChild>
          <Draggable id={comp?.id} type="component" dragData={comp}>
            <Icon /> {comp?.label}
          </Draggable>
        </Button>
      )
    })
  }
  return (
    <aside className="w-64 bg-card p-2 shrink-0 grid grid-cols-2 gap-2">
      {createDragItems()}
    </aside>
  )
}

export default ApplicationDragItems
