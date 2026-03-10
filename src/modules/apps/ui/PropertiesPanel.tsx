"use client"

import { useApplicationStore } from "@/lib/store/app"
import PropertiesWrapper from "./properties/PropertiesWrapper"
import TextProperties from "./properties/TextProperties"
import ButtonProperties from "./properties/ButtonProperties"

const PropertiesPanel = () => {
  const selectedId = useApplicationStore((state) => state.selectedComponentId)
  const application = useApplicationStore((state) => state.app)

  const selectedComponent = application?.components?.find(
    (c) => c.id === selectedId,
  )

  if (!selectedId || !selectedComponent) {
    return null
  }

  const renderSpecificProperties = () => {
    switch (selectedComponent.type) {
      case "Heading":
      case "Paragraph":
        return <TextProperties component={selectedComponent} />

      case "Button":
        return <ButtonProperties component={selectedComponent} />
      default:
        return null
    }
  }

  return (
    <PropertiesWrapper component={selectedComponent}>
      {renderSpecificProperties()}
    </PropertiesWrapper>
  )
}

export default PropertiesPanel
