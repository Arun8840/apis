"use client"
import React, { useMemo, useRef, useState, useEffect } from "react"
import Droppable from "@/components/custom/dnd-components/droppable"
import { componentRegistry } from "../editor/component-registery"
import { useApplicationStore } from "@/lib/store/app"

interface AppItemsProps {
  applicationId: string
}

const AppItems: React.FC<AppItemsProps> = ({ applicationId }) => {
  const application = useApplicationStore((state) => state?.app)
  const components = application?.components || []

  // Grid Measurement Logic
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ colWidth: 0, rowHeight: 50 })

  useEffect(() => {
    if (!containerRef.current) return
    const updateSize = () => {
      const width = containerRef.current?.getBoundingClientRect().width || 0
      setDimensions((prev) => ({ ...prev, colWidth: width / 12 }))
    }

    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  const handleResize = (
    id: string,
    delta: { width: number; height: number },
  ) => {
    // Implement your store update here:
    // const newW = Math.round(delta.width / dimensions.colWidth)
    // updateComponent(id, { w: currentW + newW })
    console.log("Resizing item:", id, delta)
  }

  return (
    <main
      ref={containerRef}
      className="flex-1 h-full relative border-2 border-dashed border-muted-foreground/10"
    >
      <Droppable id={`design_${applicationId}`} accept={["component"]}>
        {components.map((comp) => {
          const Component =
            componentRegistry?.[comp?.type as keyof typeof componentRegistry]
          if (!Component) return null

          // Pass the grid context to the registered component
          return (
            <Component
              key={comp.id}
              value={comp}
              colWidth={dimensions.colWidth}
              rowHeight={dimensions.rowHeight}
              onResize={handleResize}
            />
          )
        })}
      </Droppable>
    </main>
  )
}

export default AppItems
