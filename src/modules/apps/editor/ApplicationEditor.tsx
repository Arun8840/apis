"use client"

import { useEffect, useMemo, useRef } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import useResizeObserver from "use-resize-observer"
import { toast } from "sonner"
import { useParams } from "next/navigation"

import { api } from "@/lib/eden.client"
import { useApplicationStore } from "@/lib/store/app"
import { Skeleton } from "@/components/ui/skeleton"
import ApplicationDragItems from "../ui/application-drag-items"
import AppItems from "../ui/app-items"
import { AddComponentReqType } from "../schema"
import { Application } from "@/types/application-store-types"

const COLS = 12
const ROW_HEIGHT = 50

function ApplicationEditor() {
  const params = useParams()
  const applicationId = params?.id as string

  // Canvas reference
  const canvasRef = useRef<HTMLDivElement>(null)

  // Calculate canvas width for dynamic grid calculations
  const { width: canvasWidth = 0 } = useResizeObserver({
    ref: canvasRef as any as React.MutableRefObject<HTMLDivElement>, // workaround for strict typing
  })

  // Add a fallback of 1 to prevent division by zero
  const colWidth = useMemo(() => {
    const width = canvasWidth || 0
    return width > 0 ? width / COLS : 1
  }, [canvasWidth])

  // Snap modifier for DnD-kit (custom, because createSnapModifier from @dnd-kit/modifiers expects a number, not an object)
  // We'll snap manually in handleDragEnd instead.
  // (So remove modifiers from DndContext below.)

  const setApplication = useApplicationStore((state) => state?.setApplication)
  const addAppComp = useApplicationStore((state) => state?.addComponent)
  const updateAppComp = useApplicationStore((state) => state?.updateComponent)

  const { data: dragItemsData, isPending } = useQuery({
    queryKey: ["get/dragItems"],
    queryFn: async () => (await api.app.dragItems.get()).data,
  })

  const { data: application, isPending: isAppPending } = useQuery({
    queryKey: [`/application/${applicationId}`],
    queryFn: async () =>
      (
        await api.app
          .application({ appId: applicationId })
          .get({ fetch: { credentials: "include" } })
      ).data,
  })

  useEffect(() => {
    if (application?.data) setApplication?.(application.data as Application)
  }, [application, setApplication])

  const addComponent = useMutation({
    mutationFn: async (component: AddComponentReqType) =>
      (await api.app.create.component.post(component)).data,
    onSuccess: (res) => toast.success(res?.message),
  })
  const updateComponent = useMutation({
    mutationFn: async (component: AddComponentReqType) =>
      await api.app.update.component.post(component),
    onSuccess: (res) => toast.success(res?.data?.message),
  })

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  // Custom clamp helper
  const clamp = (v: number, min: number, max: number) =>
    Math.max(min, Math.min(max, v))

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, delta, activatorEvent, over } = event
    if (!active || !over || !canvasRef.current || colWidth === 0) return

    const canvas = canvasRef.current
    const canvasRect = canvas.getBoundingClientRect()
    const scrollLeft = canvas.scrollLeft
    const scrollTop = canvas.scrollTop

    const dragData = active.data.current as any
    const isNewItem = dragData?.accept !== "move"

    if (isNewItem) {
      const mouseEvent = activatorEvent as MouseEvent
      // Compute offsets relative to the canvas's scrolling and bounding rect
      const clientOffsetX = mouseEvent.clientX + delta.x
      const clientOffsetY = mouseEvent.clientY + delta.y

      // Adjust for canvas base position for accurate drop location
      const dropX = clientOffsetX - canvasRect.left + scrollLeft
      const dropY = clientOffsetY - canvasRect.top + scrollTop

      const gridX = clamp(Math.round(dropX / colWidth), 0, COLS - 2)
      const gridY = Math.max(0, Math.round(dropY / ROW_HEIGHT))

      const req = {
        id: crypto.randomUUID(),
        applicationId,
        type: dragData.label,
        position: { x: gridX, y: gridY, w: 2, h: 2 },
      }
      addAppComp?.(req)
      addComponent.mutate(req)
    } else {
      const itemRect = active?.rect?.current?.translated
      if (!itemRect) return

      const dropX = itemRect.left - canvasRect.left + scrollLeft
      const dropY = itemRect.top - canvasRect.top + scrollTop

      const currentW = dragData?.position?.w || 2
      const currentH = dragData?.position?.h || 2

      // Snap position to nearest grid cell, clamped to canvas bounds
      const gridX = clamp(Math.round(dropX / colWidth), 0, COLS - currentW)
      const gridY = Math.max(0, Math.round(dropY / ROW_HEIGHT))

      const req = {
        id: dragData.id as string,
        applicationId,
        type: dragData?.type,
        position: { x: gridX, y: gridY, w: currentW, h: currentH },
      }
      updateAppComp?.(req)
      updateComponent.mutate(req)
    }
  }

  if (isPending || isAppPending) return <EditorSkeleton />

  return (
    <section className="flex h-screen">
      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        // Remove invalid Snap modifier, do snapping in `handleDragEnd`
      >
        <ApplicationDragItems items={dragItemsData?.data || []} />

        <div ref={canvasRef} className="flex-1 relative overflow-auto">
          <AppItems applicationId={applicationId} />
        </div>
      </DndContext>
    </section>
  )
}

export default ApplicationEditor

const EditorSkeleton = () => (
  <div className="flex h-screen gap-0.5">
    <Skeleton className="w-64 opacity-15 rounded-r-none" />
    <Skeleton className="flex-1 opacity-15 rounded-none" />
  </div>
)
