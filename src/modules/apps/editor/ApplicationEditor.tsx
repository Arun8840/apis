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
import { createSnapModifier, restrictToParentElement } from "@dnd-kit/modifiers"
import PropertiesPanel from "../ui/PropertiesPanel"
import { resolveCollisions } from "@/lib/layout-utils"
import EditorTopbar from "../ui/EditorTopbar"

const COLS = 120
const ROW_HEIGHT = 10

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

  const setApplication = useApplicationStore((state) => state?.setApplication)
  const setSelectedComponent = useApplicationStore(
    (state) => state?.setSelectedComponent,
  )
  const addAppComp = useApplicationStore((state) => state?.addComponent)
  const updateAppComps = useApplicationStore((state) => state?.updateComponents)
  const applicationData = useApplicationStore((state) => state?.app)

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

  const snapToGridModifier = useMemo(
    () => (args: any) => {
      const { transform } = args
      return {
        ...transform,
        x: Math.round(transform.x / colWidth) * colWidth,
        y: Math.round(transform.y / ROW_HEIGHT) * ROW_HEIGHT,
      }
    },
    [colWidth],
  )
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  // Custom clamp helper
  const clamp = (v: number, min: number, max: number) =>
    Math.max(min, Math.min(max, v))

  const restrictToCanvas = (args: any) => {
    if (args.active?.data?.current?.accept === "move") {
      return restrictToParentElement(args)
    }
    return args.transform
  }

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

      const gridX = clamp(Math.round(dropX / colWidth), 0, COLS - 8)
      const gridY = Math.max(0, Math.round(dropY / ROW_HEIGHT))

      const req = {
        id: crypto.randomUUID(),
        applicationId,
        type: dragData.label,
        position: { x: gridX, y: gridY, w: 8, h: 40 },
        options: {
          content: "",
        },
      }

      // Resolve collisions with existing components
      const existingComponents = applicationData?.components || []
      const newComponents = resolveCollisions(existingComponents, req)

      // Update store for all components
      addAppComp?.(req)

      // API call for the new component
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

      const updatedComp = {
        id: dragData.id as string,
        applicationId,
        type: dragData?.type,
        position: { x: gridX, y: gridY, w: currentW, h: currentH },
        options: {
          content: dragData?.options?.content,
        },
        style: dragData?.style,
      }

      // Resolve collisions
      const existingComponents = applicationData?.components || []
      const newComponents = resolveCollisions(existingComponents, updatedComp)

      // Update store (bulk)
      updateAppComps?.(newComponents)

      // API update for the moved component
      updateComponent.mutate(updatedComp)
    }
  }

  if (isPending || isAppPending) return <EditorSkeleton />
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <EditorTopbar />

      <section className="flex flex-1 overflow-hidden">
        <DndContext
          sensors={sensors}
          onDragEnd={handleDragEnd}
          modifiers={[snapToGridModifier, restrictToCanvas]}
        >
          <ApplicationDragItems items={dragItemsData?.data || []} />

          <div ref={canvasRef} className="w-full  relative overflow-y-auto">
            <AppItems applicationId={applicationId} />
          </div>

          <PropertiesPanel />
        </DndContext>
      </section>
    </div>
  )
}

export default ApplicationEditor

const EditorSkeleton = () => (
  <div className="flex flex-col h-screen gap-0.5">
    <Skeleton className="h-14 w-full rounded-none opacity-15" />
    <div className="flex flex-1 gap-0.5">
      <Skeleton className="w-64 opacity-15 rounded-none" />
      <Skeleton className="flex-1 opacity-10 rounded-none" />
    </div>
  </div>
)
