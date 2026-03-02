import { useDraggable } from "@dnd-kit/core"
import { Resizable } from "re-resizable"
import React, { ReactNode } from "react"

interface GridItemProps {
  id: string
  x: number
  y: number
  w: number
  h: number
  colWidth: number
  rowHeight: number
  children: ReactNode
  onResize?: (id: string, delta: { width: number; height: number }) => void
}

const GridItem: React.FC<GridItemProps> = ({
  id,
  x,
  y,
  w,
  h,
  colWidth,
  rowHeight,
  children,
  onResize,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id })

  // Calculate pixel positions from grid units
  const style: React.CSSProperties = {
    position: "absolute" as const,
    left: x * colWidth,
    top: y * rowHeight,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    zIndex: isDragging ? 100 : 1,
    transition: isDragging
      ? "none"
      : "transform 200ms ease, width 200ms ease, height 200ms ease",
  }

  return (
    <div ref={setNodeRef} style={style}>
      <Resizable
        size={{ width: w * colWidth, height: h * rowHeight }}
        grid={[colWidth, rowHeight]} // Snaps resizing to the grid
        onResizeStop={(e, dir, ref, d) => onResize?.(id, d)}
        handleStyles={{ bottomRight: { cursor: "nwse-resize" } }}
      >
        <div className="item-container">
          {/* Dedicated Drag Handle */}
          <div className="drag-handle" {...listeners} {...attributes}>
            ⠿
          </div>
          {children}
        </div>
      </Resizable>
    </div>
  )
}

export default GridItem
