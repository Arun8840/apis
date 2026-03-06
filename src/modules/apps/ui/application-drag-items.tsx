import Draggable from "@/components/custom/dnd-components/draggable"
import { Button } from "@/components/ui/button"
import { DragItemsResponse } from "@/types/application-types"
import {
  Heading,
  Image,
  MousePointer,
  Pilcrow,
  RectangleEllipsis,
  Server,
  ToggleLeft,
} from "lucide-react"
import React from "react"

interface ApplicationDragItemsProps {
  items: DragItemsResponse
}

const dragItemIcons = {
  Heading: Heading,
  Paragraph: Pilcrow,
  Image: Image,
  Button: MousePointer,
  Switch: ToggleLeft,
  TextInput: RectangleEllipsis,
}

const ApplicationDragItems: React.FC<ApplicationDragItemsProps> = ({
  items,
}) => {
  const createDragItems = () => {
    return items?.map((comp, compIdx) => {
      const Icon =
        dragItemIcons?.[comp?.label as keyof typeof dragItemIcons] || Server
      return (
        <Draggable
          id={comp?.id}
          key={comp?.id}
          type="component"
          dragData={comp}
        >
          <Button size="sm" variant="outline" className="w-full">
            <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
            <span className="text-[9px] font-bold text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-wider text-center px-1">
              {comp?.label}
            </span>
          </Button>
        </Draggable>
      )
    })
  }
  return (
    <aside className="w-64 border-r bg-background flex flex-col shrink-0">
      <div className="p-2 grid lg:grid-cols-2 gap-2">{createDragItems()}</div>
    </aside>
  )
}

export default ApplicationDragItems
