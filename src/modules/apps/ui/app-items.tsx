"use client"
import React, { useRef, useState, useEffect } from "react"
import Droppable from "@/components/custom/dnd-components/droppable"
import { useApplicationStore } from "@/lib/store/app"
import { componentRegistry } from "../editor/component-registery"

interface AppItemsProps {
  applicationId: string
}

const AppItems: React.FC<AppItemsProps> = ({ applicationId }) => {
  // Grid Measurement Logic
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ colWidth: 0, rowHeight: 50 })
  const application = useApplicationStore((state) => state?.app)
  const components = application?.components || []
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

  return (
    <main ref={containerRef} className="size-full relative">
      <Droppable
        id={`design_${applicationId}`}
        accept={["component"]}
        className="p-0 h-full"
      >
        <div
          style={{
            gridTemplateColumns: `repeat(12, 1fr)`, // 12 equal columns
            gridAutoRows: `50px`, // Matches your ROW_HEIGHT
          }}
          className="size-full grid"
        >
          {components.map((comp) => {
            const Component =
              componentRegistry?.[comp?.type as keyof typeof componentRegistry]
            if (!Component) return null

            return (
              <Component key={comp.id} value={comp} dimensions={dimensions} />
            )
          })}
        </div>
      </Droppable>
    </main>
  )
}

export default AppItems
