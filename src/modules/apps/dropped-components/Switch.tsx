import React from "react"
import DroppedComponentWrapper from "../editor/DroppedComponentWrapper"
import { DroppedComponentProps } from "@/types"
import { Switch } from "@/components/ui/switch"

const SwitchComponent: React.FC<DroppedComponentProps> = ({
  value,
  dimensions,
}) => {
  return (
    <DroppedComponentWrapper value={value} dimensions={dimensions}>
      <div className="flex items-center gap-2">
        <Switch />
      </div>
    </DroppedComponentWrapper>
  )
}

export default SwitchComponent
