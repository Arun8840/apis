import Droppable from "@/components/custom/dnd-components/droppable"
import React from "react"
import EditorHeader from "./editor-header"
import { componentRegistry } from "../editor/component-registery"
import { useApplicationStore } from "@/lib/store/app"
import SortableItem from "@/components/custom/dnd-components/sortable"

interface AppItemsProps {
  applicationId: string
}

const AppItems: React.FC<AppItemsProps> = ({ applicationId }) => {
  const application = useApplicationStore((state) => state?.app)
  const components = application?.components || []

  return (
    <main className="flex-1 h-full">
      <Droppable
        id={`design_${applicationId}`}
        data={{ type: "canvas" }}
        accept={"component"}
      >
        {components.map((comp) => {
          const Component =
            componentRegistry?.[comp?.type as keyof typeof componentRegistry]
          if (!Component) return null

          return <Component key={comp.id} value={comp} />
        })}
      </Droppable>
    </main>
  )
}
export default AppItems
