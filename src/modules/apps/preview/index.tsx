"use client"

import MyLoader from "@/components/ui/my-loader"
import { api } from "@/lib/eden.client"
import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import PageComponent from "../ui/page-component"

interface ApplicationPreviewContainerProps {
  appId: string
}
function ApplicationPreviewContainer({
  appId,
}: ApplicationPreviewContainerProps) {
  const {
    data: application,
    isPending,
    error,
  } = useQuery({
    queryKey: ["application", appId],
    queryFn: async () => {
      const res = await api.app.application({ appId }).get()
      return res.data
    },
  })

  const appItems = application?.data

  const renderPages = useMemo(() => {
    return appItems?.pages?.map((page) => {
      return <PageComponent key={page?.id} value={page} />
    })
  }, [appItems, appId])

  if (isPending) {
    return (
      <div className="min-h-screen grid place-items-center">
        <MyLoader />
      </div>
    )
  }

  if (error) {
    return <div>Something went wrong</div>
  }

  console.log(application?.data)
  return <div className="overflow-y-auto">{renderPages}</div>
}

export default ApplicationPreviewContainer
