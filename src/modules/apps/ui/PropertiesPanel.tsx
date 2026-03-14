"use client"

import { useApplicationStore } from "@/lib/store/app"
import PropertiesWrapper from "./properties/PropertiesWrapper"
import TextProperties from "./properties/TextProperties"
import ButtonProperties from "./properties/ButtonProperties"
import PageProperties from "./properties/PageProperties"

const PropertiesPanel = () => {
  const selectedId = useApplicationStore((state) => state.selectedComponentId)
  const selectedPageId = useApplicationStore((state) => state.selectedPageId)
  const application = useApplicationStore((state) => state.app)

  if (selectedPageId) {
    return <PageProperties />
  }

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
