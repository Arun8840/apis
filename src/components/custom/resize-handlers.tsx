import { cn } from "@/lib/utils"
import React from "react"

interface ResizeHandleProps {
  direction: "bottomRight" | "bottomLeft" | "topLeft" | "topRight"
  className?: string
}

const ResizeHandle: React.FC<ResizeHandleProps> = ({
  direction,
  className = "",
}) => {
  // Directional cursor mapping
  const cursor =
    direction === "bottomRight"
      ? "nwse-resize"
      : direction === "bottomLeft"
        ? "nesw-resize"
        : direction === "topLeft"
          ? "nwse-resize"
          : direction === "topRight"
            ? "nesw-resize"
            : "pointer"

  // Directional position mapping (for absolute placement, if needed)
  const positionMap: Record<string, string> = {
    bottomRight: "bottom-1 right-1",
    bottomLeft: "bottom-1 left-1",
    topLeft: "top-1 left-1",
    topRight: "top-1 right-1",
  }

  return (
    <div
      data-direction={direction}
      className={cn(
        "size-3 z-30 absolute group/resize flex items-center justify-center",
        positionMap[direction] || "absolute",
        className,
      )}
      style={{ cursor }}
    >
      <div className="size-1.5 rounded-full bg-blue-500 group-hover/resize:bg-primary group-hover/resize:scale-125  shadow-sm" />
    </div>
  )
}

export default ResizeHandle
