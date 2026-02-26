import Droppable from "@/components/custom/dnd-components/droppable"
import React from "react"
import EditorHeader from "./editor-header"
import { componentRegistry } from "../editor/component-registery"
import { useApplicationStore } from "@/lib/store/app"

interface AppItemsProps {
  applicationId: string
}
const AppItems: React.FC<AppItemsProps> = ({ applicationId }) => {
  const application = useApplicationStore((state) => state?.app)

  const hasComponents = Array.isArray(application?.components)
  return (
    <main className="flex-1 overflow-auto h-full">
      <EditorHeader title={application?.title!} />
      <Droppable
        id="Design-application"
        accept={["page"]}
        data={{ test: "hello world" }}
        className="relative"
      >
        {hasComponents &&
          application?.components?.map((comp) => {
            const Component =
              componentRegistry?.[comp?.type as keyof typeof componentRegistry]
            return (
              <Component
                key={`${comp?.applicationId}-${comp?.id}`}
                value={comp}
                className=""
              />
            )
          })}
      </Droppable>
    </main>
  )
}

export default AppItems
