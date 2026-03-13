"use client"

import { DragEndEvent } from "@dnd-kit/core"
import { useCallback } from "react"
import { resolveCollisions } from "@/lib/layout-utils"
import { useApplicationStore } from "@/lib/store/app"
import { useEditorMutations } from "./useEditorMutations"
import { clamp, COLS, ROW_HEIGHT } from "@/lib/editor-utils"
import { AddComponentReqType } from "@/modules/apps/schema"

interface DragData {
  accept?: string
  label?: string
  id?: string
  type?: string
  position?: { w: number; h: number }
  options?: { content?: string }
  style?: Record<string, string | number>
}

interface UseDragHandlersProps {
  appId: string
  pageId: string
  canvasRef: React.RefObject<HTMLDivElement | null>
  colWidth: number
}

export function useDragHandlers({
  appId,
  pageId,
  canvasRef,
  colWidth,
}: UseDragHandlersProps) {
  const { addComponent, updateComponent } = useEditorMutations()
  const applicationData = useApplicationStore((state) => state.app)
  const addAppComp = useApplicationStore((state) => state.addComponent)
  const updateAppComps = useApplicationStore((state) => state.updateComponents)

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, delta, activatorEvent, over } = event
      if (!active || !over || !canvasRef.current || colWidth === 0) return

      const canvas = canvasRef.current
      const canvasRect = canvas.getBoundingClientRect()
      const scrollLeft = canvas.scrollLeft
      const scrollTop = canvas.scrollTop

      const dragData = active.data.current as DragData | undefined
      const isNewItem = dragData?.accept !== "move"

      if (isNewItem) {
        const mouseEvent = activatorEvent as MouseEvent
        const clientOffsetX = mouseEvent.clientX + delta.x
        const clientOffsetY = mouseEvent.clientY + delta.y

        const dropX = clientOffsetX - canvasRect.left + scrollLeft
        const dropY = clientOffsetY - canvasRect.top + scrollTop

        const gridX = clamp(Math.round(dropX / colWidth), 0, COLS - 8)
        const gridY = Math.max(0, Math.round(dropY / ROW_HEIGHT))

        const req: AddComponentReqType = {
          id: crypto.randomUUID(),
          applicationId: appId,
          pageId,
          type: dragData?.label || "",
          position: { x: gridX, y: gridY, w: 8, h: 40 },
          options: { content: "" },
        }

        const existingComponents = applicationData?.components || []
        resolveCollisions(existingComponents, req)

        addAppComp?.(req)
        addComponent.mutate(req)
      } else {
        const itemRect = active?.rect?.current?.translated
        if (!itemRect) return

        const dropX = itemRect.left - canvasRect.left + scrollLeft
        const dropY = itemRect.top - canvasRect.top + scrollTop

        const currentW = dragData?.position?.w || 2
        const currentH = dragData?.position?.h || 2

        const gridX = clamp(Math.round(dropX / colWidth), 0, COLS - currentW)
        const gridY = Math.max(0, Math.round(dropY / ROW_HEIGHT))

        const updatedComp: AddComponentReqType = {
          id: dragData?.id || "",
          applicationId: appId,
          pageId,
          type: dragData?.type || "",
          position: { x: gridX, y: gridY, w: currentW, h: currentH },
          options: { content: dragData?.options?.content },
          style: dragData?.style,
        }

        const existingComponents = applicationData?.components || []
        const newComponents = resolveCollisions(existingComponents, updatedComp)

        updateAppComps?.(newComponents)
        updateComponent.mutate(updatedComp)
      }
    },
    [
      appId,
      pageId,
      canvasRef,
      colWidth,
      applicationData,
      addAppComp,
      addComponent,
      updateAppComps,
      updateComponent,
    ],
  )

  return { handleDragEnd }
}
