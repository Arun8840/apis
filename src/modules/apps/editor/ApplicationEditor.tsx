"use client"
import { useMutation, useQuery } from "@tanstack/react-query"
import { api } from "@/lib/eden.client"
import { Skeleton } from "@/components/ui/skeleton"
import ApplicationDragItems from "../ui/application-drag-items"
import AppItems from "../ui/app-items"
import { DragItems } from "@/types/application-types"
import { AddComponentReqType } from "../schema"
import { toast } from "sonner"
import { useParams } from "next/navigation"
import { Application } from "@/types/application-store-types"
import { useEffect, useState } from "react"
import { useApplicationStore } from "@/lib/store/app"
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  Active,
} from "@dnd-kit/core"
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { componentRegistry } from "./component-registery"
import { keyof } from "zod"

const GRID_SIZE = 20

function ApplicationEditor() {
  const params = useParams()
  const applicationId = params?.id as string
  const setApplication = useApplicationStore((state) => state?.setApplication)
  const addAppComp = useApplicationStore((state) => state?.addComponent)
  const { data, isPending, isSuccess } = useQuery({
    queryKey: ["get/dragItems"],
    queryFn: async () => {
      const res = await api.app.dragItems.get()
      if (res.error) throw res.error
      return res.data
    },
  })
  const {
    data: application,
    isPending: isAppPending,
    isError: isAppError,
  } = useQuery({
    queryKey: [`/application/${applicationId}`],
    queryFn: async () => {
      const res = await api.app.application({ appId: applicationId }).get({
        fetch: {
          credentials: "include",
        },
      })

      if (res.error) throw res.error
      return res.data
    },
  })

  // Synchronize Zustand Store with API Data correctly
  useEffect(() => {
    if (application?.data) {
      setApplication?.(application?.data as Application)
    }
  }, [application, setApplication])

  const addComponent = useMutation({
    mutationFn: async (component: AddComponentReqType) => {
      const { data, error } = await api.app.create.component.post(component)
      if (error instanceof Error) {
        throw new Error(error?.message)
      }
      return data
    },
    onSuccess: async (context) => {
      toast.success(context?.message)
    },
    onError: (err) => {
      toast.error(err?.message)
    },
  })

  const items = data?.data || []
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // user must move 8px before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  // --- DragOverlay state fix ---
  const [activeDragItem, setActiveDragItem] = useState<Active | null>(null)

  const handleDragStart = (event: { active: Active }) => {
    setActiveDragItem(event.active)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over, delta } = event

    setActiveDragItem(null)

    if (!active || !over) return

    const activeRect = active.rect.current.translated
    const overRect = over.rect
    const dragData = active?.data?.current as DragItems

    if (!activeRect || !overRect) return

    /**
     * 1. Calculate the Raw Canvas Coordinates
     * This gives us the exact pixel position of the top-left corner
     * of the element relative to the canvas.
     */
    const rawX =
      activeRect.left - overRect.left + (over.data.current?.scrollLeft || 0)
    const rawY =
      activeRect.top - overRect.top + (over.data.current?.scrollTop || 0)

    /**
     * 2. Apply Snapping (in pixels)
     */
    const snappedX = Math.round(rawX / GRID_SIZE) * GRID_SIZE
    const snappedY = Math.round(rawY / GRID_SIZE) * GRID_SIZE

    /**
     * 3. Calculate as percentage of container (droppable rect)
     */
    const percentX = overRect.width > 0 ? (snappedX / overRect.width) * 100 : 0
    const percentY =
      overRect.height > 0 ? (snappedY / overRect.height) * 100 : 0
    const percentW =
      overRect.width > 0 ? (activeRect.width / overRect.width) * 100 : 0
    const percentH =
      overRect.height > 0 ? (activeRect.height / overRect.height) * 100 : 0

    const request = {
      id: crypto.randomUUID(),
      applicationId: applicationId,
      type: dragData?.label,
      position: {
        x: percentX,
        y: percentY,
        w: percentW,
        h: percentH,
      },
    }

    addAppComp?.({ ...request, id: crypto.randomUUID() })

    await addComponent.mutate(request)
  }

  const draggedType = activeDragItem?.data?.current?.label

  const DraggedOverlayComponent =
    componentRegistry?.[draggedType as keyof typeof componentRegistry]
  if (isPending || isAppPending) return <EditorSkeleton />

  return (
    <section className="flex h-screen">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
      >
        <ApplicationDragItems items={items} />

        <div className="flex-1 overflow-auto relative">
          <AppItems applicationId={applicationId} />
        </div>

        <DragOverlay className="w-fit">
          <DraggedOverlayComponent value={null} />
        </DragOverlay>
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
