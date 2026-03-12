"use client"
import { Component, PageType } from "@/types"
import { useMemo, useRef } from "react"
import useResizeObserver from "use-resize-observer"
import { componentRegistry } from "../editor/component-registery"

interface ExtendedPageType extends PageType {
  components: Component[]
}

interface PageComponentProps {
  value: ExtendedPageType
}
const PageComponent = ({ value }: PageComponentProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const components = value?.components

  const { width: canvasWidth = 0 } = useResizeObserver({
    ref: containerRef as any,
  })

  const dimensions = useMemo(() => {
    const windowWidth = typeof window !== "undefined" ? window.innerWidth : 1200
    const designedCanvasWidth = Math.max(800, windowWidth - 544)
    const colWidth = designedCanvasWidth / 120
    return { colWidth, rowHeight: 10, designedCanvasWidth }
  }, [canvasWidth])

  const renderComponent = useMemo(() => {
    return components?.map((comp) => {
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
    })
  }, [components])

  return (
    <section
      className="w-full min-h-screen grid"
      style={{
        gridTemplateColumns: `repeat(120, 1fr)`,
        gridAutoRows: `${dimensions.rowHeight}px`,
      }}
    >
      {renderComponent}
    </section>
  )
}

export default PageComponent
