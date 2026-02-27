import { cn } from "@/lib/utils"
import { DroppedComponentProps } from "@/types"
import React, { CSSProperties } from "react"

const Paragraph: React.FC<DroppedComponentProps> = ({ value, className }) => {
  const baseClass = "border p-2 bg-card w-fit"

  const styleVariables = {
    left: value?.position?.x ?? 0,
    top: value?.position?.y ?? 0,
    position: "absolute",
  } as CSSProperties
  return (
    <div style={styleVariables} className={cn(baseClass, className)}>
      <p>Paragraph component</p>
    </div>
  )
}

export default Paragraph
