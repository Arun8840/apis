"use client" // Required for interactive components in Next.js App Router

import React, { CSSProperties } from "react"
import { Resizable } from "re-resizable"
import { DroppedComponentProps } from "@/types"
import Draggable from "@/components/custom/dnd-components/draggable"

interface GridHeadingProps extends DroppedComponentProps {
  colWidth: number
  rowHeight: number
  onResize: (id: string, delta: { width: number; height: number }) => void
}

const Heading: React.FC<GridHeadingProps> = ({
  value,
  colWidth,
  rowHeight,
  onResize,
}) => {
  // 1. Calculate the Static Position (Grid -> Pixels)
  const gridStyle: CSSProperties = {
    position: "absolute",
    // Ensure we default to 0 if the value is missing
    left: (value?.position?.x || 0) * colWidth,
    top: (value?.position?.y || 0) * rowHeight,
    width: (value?.position?.w || 2) * colWidth,
    height: (value?.position?.h || 2) * rowHeight,
  }

  return (
    <Draggable
      dragHandle={true}
      id={value?.id}
      type="move"
      dragData={value}
      style={gridStyle}
    >
      <Resizable
        size={{
          width: (value?.position?.w || 2) * colWidth,
          height: (value?.position?.h || 2) * rowHeight,
        }}
        grid={[colWidth, rowHeight]}
        onResizeStop={(e, dir, ref, d) => onResize(value.id, d)}
        handleStyles={{
          bottomRight: {
            cursor: "nwse-resize",
            bottom: 0,
            right: 0,
            width: "10px",
            height: "10px",
            background: "#ccc",
          },
        }}
      >
        <div className="h-full w-full border p-2 bg-card">
          <h1 className="select-none">This is a default header</h1>
          <small>
            pos: x={value?.position?.x ?? 0}, y={value?.position?.y ?? 0}, w=
            {value?.position?.w ?? 2}, h={value?.position?.h ?? 2}
          </small>
        </div>
      </Resizable>
    </Draggable>
  )
}

export default Heading
