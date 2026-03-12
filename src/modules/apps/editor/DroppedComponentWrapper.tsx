"use client"

import React, { CSSProperties, createContext, useContext } from "react"
import { Resizable } from "re-resizable"
import Draggable from "@/components/custom/dnd-components/draggable"
import ResizeHandle from "@/components/custom/resize-handlers"
import { useApplicationStore } from "@/lib/store/app"
import { cn } from "@/lib/utils"
import { Component, DroppedComponentProps } from "@/types"
import { resolveCollisions } from "@/lib/layout-utils"
import { useMutation } from "@tanstack/react-query"
import { api } from "@/lib/eden.client"
import { AddComponentReqType } from "../schema"

interface ComponentContextType {
  dimensions: { colWidth: number; rowHeight: number }
  handleResize: (delta: { width: number; height: number }) => void
  onDataUpdate: (data: any) => void
}

const ComponentContext = createContext<ComponentContextType | null>(null)

export const useComponentContext = () => {
  const context = useContext(ComponentContext)
  if (!context) {
    throw new Error(
      "useComponentContext must be used within a DroppedComponentWrapper",
    )
  }
  return context
}

interface DroppedComponentWrapperProps extends DroppedComponentProps {
  children: React.ReactNode
  toolbar?: React.ReactNode
}

const DroppedComponentWrapper: React.FC<DroppedComponentWrapperProps> = ({
  value,
  dimensions,
  children,
  toolbar,
}) => {
  const selectedId = useApplicationStore((state) => state.selectedComponentId)
  const setSelectedComponent = useApplicationStore(
    (state) => state.setSelectedComponent,
  )
  const updateAppComponent = useApplicationStore(
    (state) => state?.updateComponent,
  )
  const updateAppComponents = useApplicationStore(
    (state) => state?.updateComponents,
  )
  const allComponents =
    useApplicationStore((state) => state?.app?.components) || []

  const updateComponentApi = useMutation({
    mutationFn: async (data: AddComponentReqType) => {
      const response = await api.app.update.component.post(data)
      return response.data
    },
  })

  const isSelected = selectedId === value.id

  const handleResize = (delta: { width: number; height: number }) => {
    const COLS = 120
    // Calculate new width and height in grid units, minimum of 1
    // Clamp width to remaining columns in the row
    const newW = Math.round(
      Math.max(
        1,
        Math.min(
          COLS - value.position.x,
          (delta.width + (value?.position?.w || 1) * dimensions.colWidth) /
            dimensions.colWidth,
        ),
      ),
    )
    const newH = Math.round(
      Math.max(
        1,
        (delta.height + (value?.position?.h || 1) * dimensions.rowHeight) /
          dimensions.rowHeight,
      ),
    )

    const updatedComp = {
      ...value,
      position: {
        ...value?.position,
        w: newW,
        h: newH,
      },
    } as AddComponentReqType

    // Resolve collisions
    const newComponents = resolveCollisions(allComponents, updatedComp)

    // Update store (bulk)
    updateAppComponents?.(newComponents)
    updateComponentApi.mutate(updatedComp)
  }

  const onDataUpdate = (data: any) => {
    const updatedComp = {
      ...value,
      ...data, // This allows updating any field, or specifically 'data' if that's what's intended
    }
    updateAppComponent?.(updatedComp)
  }

  const gridStyle: CSSProperties = {
    gridColumn: `${value.position.x + 1} / span ${value.position.w}`,
    gridRow: `${value.position.y + 1} / span ${value.position.h}`,
    zIndex: isSelected ? 40 : 10,
  }

  // Render for Preview Mode
  if (value.isPreview) {
    // Mobile responsive mode: no grid positioning, flows in parent flex column
    if (value.isResponsive) {
      return <div className="w-full p-2">{children}</div>
    }
    // Desktop: keep exact grid placement
    return (
      <div style={gridStyle} className="p-2">
        {children}
      </div>
    )
  }

  return (
    <ComponentContext.Provider
      value={{ dimensions, handleResize, onDataUpdate }}
    >
      <Draggable
        dragHandle={true}
        id={value?.id}
        type="move"
        dragData={value}
        style={gridStyle}
        onClick={() => setSelectedComponent(value.id)}
      >
        <div className="relative group/dropped-comp h-full w-full">
          {isSelected && toolbar}

          <Resizable
            size={{
              width: (value?.position?.w || 8) * dimensions.colWidth,
              height: (value?.position?.h || 40) * dimensions.rowHeight,
            }}
            grid={[dimensions.colWidth, dimensions.rowHeight]}
            onResizeStop={(e, dir, ref, d) => handleResize(d)}
            handleComponent={{
              bottomRight: isSelected ? (
                <ResizeHandle
                  direction="bottomRight"
                  className="bg-blue-500 border-blue-500"
                />
              ) : undefined,
              bottomLeft: isSelected ? (
                <ResizeHandle
                  direction="bottomLeft"
                  className="bg-blue-500 border-blue-500"
                />
              ) : undefined,
              topLeft: isSelected ? (
                <ResizeHandle
                  direction="topLeft"
                  className="bg-blue-500 border-blue-500"
                />
              ) : undefined,
              topRight: isSelected ? (
                <ResizeHandle
                  direction="topRight"
                  className="bg-blue-500 border-blue-500"
                />
              ) : undefined,
            }}
          >
            <div
              className={cn(
                "h-full w-full p-0.5 bg-transparent border border-muted/40",
                isSelected
                  ? "border-dashed border-blue-500"
                  : "border hover:border-blue-500",
              )}
              onMouseDown={(e) => isSelected && e.stopPropagation()}
            >
              {isSelected && (
                <div className="absolute -top-6 left-0 bg-primary text-[10px] text-white px-2 py-0.5 rounded-t-sm font-bold uppercase tracking-wider pointer-events-none">
                  {value.type}
                </div>
              )}
              {children}
            </div>
          </Resizable>
        </div>
      </Draggable>
    </ComponentContext.Provider>
  )
}

export default DroppedComponentWrapper
