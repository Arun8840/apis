"use client"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { componentRegistry } from "../editor/component-registery"
import { api } from "@/lib/eden.client"
import { useQuery } from "@tanstack/react-query"
import useResizeObserver from "use-resize-observer"
import MyLoader from "@/components/ui/my-loader"

interface ApplicationPreviewProps {
  applicationId: string
}

const ApplicationPreview: React.FC<ApplicationPreviewProps> = ({
  applicationId,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { data: appData, isPending } = useQuery({
    queryKey: [`/application/${applicationId}/preview`],
    queryFn: async () =>
      (await api.app.application({ appId: applicationId }).get()).data,
  })

  const components = appData?.data?.components || []

  // Calculate canvas width for dynamic grid calculations
  const { width: canvasWidth = 0 } = useResizeObserver({
    ref: containerRef as any,
  })

  // Simulation of the editor's design-time environment:
  // Editor has two sidebars: w-64 (256px) and w-72 (288px) = 544px total.
  // The canvas width during design is TotalWidth - 544px.
  // We use this logic to derive colWidth so it matches the editor exactly.
  const dimensions = useMemo(() => {
    const windowWidth = typeof window !== "undefined" ? window.innerWidth : 1200
    const designedCanvasWidth = Math.max(800, windowWidth - 544)
    const colWidth = designedCanvasWidth / 120
    return { colWidth, rowHeight: 10, designedCanvasWidth }
  }, [canvasWidth])

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-screen">
        <MyLoader />
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-background overflow-x-hidden overflow-y-auto"
    >
      <div
        className="grid w-full min-h-full"
        style={{
          gridTemplateColumns: `repeat(120, 1fr)`,
          gridAutoRows: `${dimensions.rowHeight}px`, // Matches your ROW_HEIGHT
          backgroundImage: `
                  linear-gradient(to right, hsl(var(--border)/0.3) 1px, transparent 1px),
                  linear-gradient(to bottom, hsl(var(--border)/0.3) 1px, transparent 1px),
                  linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px)
                `,
          backgroundSize: `
                  ${dimensions.colWidth}px ${dimensions.rowHeight}px, 
                  ${dimensions.colWidth}px ${dimensions.rowHeight}px,
                  ${dimensions.colWidth * 10}px ${dimensions.rowHeight}px
                `,
        }}
      >
        {components.map((comp) => {
          const Component =
            componentRegistry?.[comp?.type as keyof typeof componentRegistry]
          if (!Component) return null

          return (
            <Component
              key={comp.id}
              value={{ ...comp, isPreview: true }}
              dimensions={dimensions}
            />
          )
        })}
      </div>
    </div>
  )
}

export default ApplicationPreview
