"use client"

import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable"

import { api } from "@/lib/eden.client"
import { useApplicationStore } from "@/lib/store/app"
import { Skeleton } from "@/components/ui/skeleton"
import ApplicationDragItems from "../ui/application-drag-items"
import AppItems from "../ui/app-items"
import PropertiesPanel from "../ui/PropertiesPanel"
import EditorTopbar from "../ui/EditorTopbar"
import { useCanvasDimensions } from "@/hooks/useCanvasDimensions"
import { useDragHandlers } from "@/hooks/useDragHandlers"
import { restrictToCanvas } from "@/lib/editor-utils"

function ApplicationEditor({
  appId,
  pageId,
}: {
  appId: string
  pageId: string
}) {
  const { canvasRef, snapToGridModifier, colWidth } = useCanvasDimensions()
  const { handleDragEnd } = useDragHandlers({ appId, pageId, canvasRef, colWidth })

  const setApplication = useApplicationStore((state) => state.setApplication)

  const { data: dragItemsData, isPending } = useQuery({
    queryKey: ["get/dragItems"],
    queryFn: async () => (await api.app.dragItems.get()).data,
  })

  const { data: application, isPending: isAppPending } = useQuery({
    queryKey: [`/application/${appId}/page/${pageId}`],
    queryFn: async () =>
      (
        await api.app
          .page({ pageId })
          .get({ fetch: { credentials: "include" } })
      ).data,
  })

  useEffect(() => {
    if (application?.data) setApplication?.(application.data)
  }, [application, setApplication])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  if (isPending || isAppPending) return <EditorSkeleton />

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <section className="flex flex-1 overflow-hidden relative">
        <DndContext
          sensors={sensors}
          onDragEnd={handleDragEnd}
          modifiers={[snapToGridModifier, restrictToCanvas]}
        >
          <ApplicationDragItems items={dragItemsData?.data || []} />

          <div ref={canvasRef} className="w-full  relative overflow-y-auto">
            <AppItems applicationId={appId} />
          </div>

          <PropertiesPanel />

          <EditorTopbar appId={appId} pageId={pageId} />
        </DndContext>
      </section>
    </div>
  )
}

export default ApplicationEditor

const EditorSkeleton = () => (
  <div className="h-screen flex gap-0.5">
    <Skeleton className="w-10 opacity-15 rounded-none" />
    <Skeleton className="flex-1 opacity-10 rounded-none" />
  </div>
)
