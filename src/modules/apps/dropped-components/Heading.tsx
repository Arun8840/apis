import { cn } from "@/lib/utils"
import { DroppedComponentProps } from "@/types"
import React from "react"

const Heading: React.FC<DroppedComponentProps> = ({ value, className }) => {
  const baseClass = "border p-2 bg-card w-fit"
  return (
    <div className={cn(baseClass, className)}>
      <h1>This is a default header</h1>
    </div>
  )
}

export default Heading
