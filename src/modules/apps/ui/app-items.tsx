"use client"
import React, { useRef, useState, useEffect } from "react"
import Droppable from "@/components/custom/dnd-components/droppable"
import { useApplicationStore } from "@/lib/store/app"
import { componentRegistry } from "../editor/component-registery"
import { PageType } from "@/types/application-types"

interface AppItemsProps {
  applicationId: string
  pageId?: string
  pageData?: PageType
}

const AppItems: React.FC<AppItemsProps> = ({ applicationId, pageData }) => {
  // Grid Measurement Logic
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ colWidth: 0, rowHeight: 10 })
  const application = useApplicationStore((state) => state?.app)
  const components = application?.components || []

  useEffect(() => {
    if (!containerRef.current) return
    const updateSize = () => {
      const width = containerRef.current?.getBoundingClientRect().width || 0
      // Ensure we use the exact same calculation as the editor
      setDimensions((prev) => ({
        ...prev,
        colWidth: width / 120,
        rowHeight: 10,
      }))
    }

    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  const pageStyles = pageData?.styles

  return (
    <main
      id="editor-canvas"
      ref={containerRef}
      className="size-full relative transition-colors duration-200"
    >
      <Droppable
        id={`design_${applicationId}`}
        accept={["component"]}
        className="p-0 h-full"
      >
        <div
          style={{
            gridTemplateColumns: `repeat(120, 1fr)`, // 120 equal columns for high accuracy
            gridAutoRows: `${dimensions.rowHeight}px`, // Matches your ROW_HEIGHT
            ...(pageStyles?.background && {
              background: pageStyles.background,
            }),
          }}
          className="size-full grid relative"
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
