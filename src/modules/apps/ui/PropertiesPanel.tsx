"use client"

import React from "react"
import { useApplicationStore } from "@/lib/store/app"
import PropertiesWrapper from "./properties/PropertiesWrapper"
import TextProperties from "./properties/TextProperties"

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
