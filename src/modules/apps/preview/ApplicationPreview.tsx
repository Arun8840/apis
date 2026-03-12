"use client"
import React, { useMemo, useRef } from "react"
import { componentRegistry } from "../editor/component-registery"
import { api } from "@/lib/eden.client"
import { useQuery } from "@tanstack/react-query"
import useResizeObserver from "use-resize-observer"
import MyLoader from "@/components/ui/my-loader"

interface ApplicationPreviewProps {
  applicationId: string
}

const MOBILE_BREAKPOINT = 768

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

  const { width: canvasWidth = 0 } = useResizeObserver({
    ref: containerRef as any,
  })

  const isMobile = canvasWidth > 0 && canvasWidth < MOBILE_BREAKPOINT

  const dimensions = useMemo(() => {
    const windowWidth = typeof window !== "undefined" ? window.innerWidth : 1200
    const designedCanvasWidth = Math.max(800, windowWidth - 544)
    const colWidth = designedCanvasWidth / 120
    return { colWidth, rowHeight: 10, designedCanvasWidth }
  }, [canvasWidth])

  /**
   * For mobile: sort by designed position (top→bottom, left→right)
   * so the visual reading order of the design is preserved.
   */
  const sortedComponents = useMemo(() => {
    if (!isMobile) return components
    return [...components].sort((a, b) => {
      if (a.position.y !== b.position.y) return a.position.y - b.position.y
      return a.position.x - b.position.x
    })
  }, [components, isMobile])

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
      {isMobile ? (
        /* ── Mobile: vertical stack sorted by (y, x) ── */
        <div className="flex flex-col w-full">
          {sortedComponents.map((comp) => {
            const Component =
              componentRegistry?.[comp?.type as keyof typeof componentRegistry]
            if (!Component) return null
            return (
              <Component
                key={comp.id}
                value={{ ...comp, isPreview: true, isResponsive: true }}
                dimensions={dimensions}
              />
            )
          })}
        </div>
      ) : (
        /* ── Desktop: exact grid placement ── */
        <div
          className="grid w-full min-h-full"
          style={{
            gridTemplateColumns: `repeat(120, 1fr)`,
            gridAutoRows: `${dimensions.rowHeight}px`,
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
      )}
    </div>
  )
}

export default ApplicationPreview
