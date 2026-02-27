import { DroppedComponentProps } from "@/types"
import React, { CSSProperties } from "react"

const Heading: React.FC<DroppedComponentProps> = ({ value }) => {
  const baseClass = "border p-2 bg-card size-fit"
  const style = {
    position: "absolute",
    left: value?.position.x != null ? `${value.position.x}%` : undefined,
    top: value?.position.y != null ? `${value.position.y}%` : undefined,
  } as CSSProperties
  return (
    <div className={baseClass} style={style}>
      <h1>This is a default header</h1>
    </div>
  )
}
export default Heading
