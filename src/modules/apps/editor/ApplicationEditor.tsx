"use client"
import { useMutation, useQuery } from "@tanstack/react-query"
import { DragDropProvider, DragEndEvent } from "@dnd-kit/react"
import { api } from "@/lib/eden.client"
import { Skeleton } from "@/components/ui/skeleton"
import ApplicationDragItems from "../ui/application-drag-items"
import AppItems from "../ui/app-items"
import { DragItems } from "@/types/application-types"
import { AddComponentReqType } from "../schema"
import { toast } from "sonner"
import { useParams } from "next/navigation"
import { Application } from "@/types/application-store-types"
import { useEffect } from "react"
import { useApplicationStore } from "@/lib/store/app"

function ApplicationEditor() {
  const params = useParams()
  const applicationId = params?.id as string
  const setApplication = useApplicationStore((state) => state?.setApplication)
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

  const handleDrop: DragEndEvent = async ({ operation }, _manager) => {
    const { source, target, position } = operation

    if (!source || !target) return

    const sourceData = source.data as DragItems
    const co_ordinates = position?.current

    const request: AddComponentReqType = {
      id: crypto.randomUUID(),
      application_id: applicationId,
      type: sourceData?.label,
      position: {
        h: 0,
        w: 0,
        x: co_ordinates?.x,
        y: co_ordinates?.y,
      },
    }

    await addComponent.mutate(request)
  }

  if (isPending || isAppPending) return <EditorSkeleton />

  return (
    <section className="flex h-screen">
      <DragDropProvider onDragEnd={handleDrop}>
        <ApplicationDragItems items={items} />

        <div className="flex-1 overflow-auto">
          <AppItems applicationId={applicationId} />
        </div>

        <aside className="w-72 bg-card p-2  shrink-0">
          <div className="p-4 text-sm font-medium">Properties</div>
        </aside>
      </DragDropProvider>
    </section>
  )
}

export default ApplicationEditor

const EditorSkeleton = () => (
  <div className="flex h-screen gap-0.5">
    <Skeleton className="w-64 opacity-15 rounded-r-none" />
    <Skeleton className="flex-1 opacity-15 rounded-none" />
    <Skeleton className="w-64 opacity-15 rounded-l-none" />
  </div>
)
