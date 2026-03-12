import Draggable from "@/components/custom/dnd-components/draggable"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
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
    return items?.map((comp) => {
      const Icon =
        dragItemIcons?.[comp?.label as keyof typeof dragItemIcons] || Server
      return (
        <Draggable
          id={comp?.id}
          key={comp?.id}
          type="component"
          dragData={comp}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon-sm" variant="outline">
                <Icon className="text-muted-foreground group-hover:text-primary" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{comp?.label}</p>
            </TooltipContent>
          </Tooltip>
        </Draggable>
      )
    })
  }
  return (
    <aside className="border-r border-dashed bg-background flex flex-col shrink-0">
      <TooltipProvider>
        <div className="p-2 grid gap-2">{createDragItems()}</div>
      </TooltipProvider>
    </aside>
  )
}

export default ApplicationDragItems
