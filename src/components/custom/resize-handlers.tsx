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
    bottomRight: "bottom-0.5 right-0.5",
    bottomLeft: "bottom-0.5 left-0.5",
    topLeft: "top-0.5 left-0.5",
    topRight: "top-0.5 right-0.5",
  }

  return (
    <div
      data-direction={direction}
      className={cn(
        "size-2 z-30 absolute group/resize flex items-center justify-center",
        positionMap[direction] || "absolute",
        className,
      )}
      style={{ cursor }}
    >
      <div className="size-1 rounded-full bg-blue-500 group-hover/resize:bg-primary group-hover/resize:scale-125  shadow-sm" />
    </div>
  )
}

export default ResizeHandle
