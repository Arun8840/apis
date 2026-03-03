"use client"
import React, { useMemo, useRef } from "react"
import { componentRegistry } from "../editor/component-registery"
import { api } from "@/lib/eden.client"
import { useQuery } from "@tanstack/react-query"
import useResizeObserver from "use-resize-observer"
import { Component } from "@/types"
import MyLoader from "@/components/ui/my-loader"

interface ApplicationPreviewProps {
  applicationId: string
}

const ApplicationPreview: React.FC<ApplicationPreviewProps> = ({ applicationId }) => {
  
  const { data: appData, isPending } = useQuery({
    queryKey: [`/application/${applicationId}/preview`],
    queryFn: async () => (await api.app.application({ appId: applicationId }).get()).data,
  })


  const components = appData?.data?.components || []
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { width: containerWidth = 0 } = useResizeObserver({
    ref: containerRef as any,
  })

  const colWidth = useMemo(() => {
    return containerWidth > 0 ? containerWidth / 12 : 1
  }, [containerWidth])

  const rowHeight = 50

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-screen">
       <MyLoader/>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-background p-4">
      <div
        className="mx-auto grid"
        style={{
          gridTemplateColumns: `repeat(12, 1fr)`,
          gridAutoRows: `${rowHeight}px`,
          width: '100%',
          maxWidth: '1200px',
        }}
      >
        {components.map((comp) => {
          const Component = componentRegistry?.[comp?.type as keyof typeof componentRegistry]
          if (!Component) return null

          return (
            <Component
              key={comp.id}
              value={{ ...comp, isPreview: true }}
              colWidth={colWidth}
              rowHeight={rowHeight}
              onResize={() => {}} // No-op in preview
            />
          )
        })}
      </div>
    </div>
  )
}

export default ApplicationPreview
