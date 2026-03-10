"use client"

import React from "react"
import { useApplicationStore } from "@/lib/store/app"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Trash2, Loader2, X, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query"
import { api } from "@/lib/eden.client"
import { toast } from "sonner"
import { Component } from "@/types"
import { Input } from "@/components/ui/input"
import { AddComponentReqType } from "../../schema"

interface PropertiesWrapperProps {
  component: Component
  children?: React.ReactNode
}

const PropertiesWrapper: React.FC<PropertiesWrapperProps> = ({
  component,
  children,
}) => {
  const selectedId = useApplicationStore((state) => state.selectedComponentId)
  const setSelectedComponent = useApplicationStore(
    (state) => state.setSelectedComponent,
  )
  const removeComponent = useApplicationStore((state) => state.removeComponent)

  const updateComponentApi = useMutation({
    mutationFn: async (data: AddComponentReqType) => {
      const response = await api.app.update.component.post(data)
      if (response.error) throw response.error
      return response.data
    },
    onSuccess: (res) => {
      toast.success(res?.message || "Component updated successfully")
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to update component")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.app.delete.component.post({ id })
      if (res.error) throw res.error
      return res.data
    },
    onSuccess: (res) => {
      if (selectedId) {
        removeComponent?.(selectedId)
        setSelectedComponent(null)
        toast.success(res?.message || "Component removed")
      }
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to remove component")
    },
  })

  const handleDelete = () => {
    if (selectedId) {
      deleteMutation.mutate(selectedId)
    }
  }

  // * COMPONENT SAVING EVENT
  const handleSaveStyles = () => {
    updateComponentApi.mutate(component as AddComponentReqType)
  }

  return (
    <aside className="w-72 border-l bg-background flex flex-col shrink-0 overflow-y-auto">
      <div className="h-12 flex items-center justify-between px-4 border-b shrink-0">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Properties
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setSelectedComponent(null)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4 space-y-6">
        {/* Component Type (Common) */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-tight">
              Component Type
            </Label>
            <div className="px-3 py-2 bg-muted/50 rounded-md text-sm font-medium border border-border/50">
              {component.type}
            </div>
          </div>
        </div>

        <Separator />

        {/* Specific Properties (Children) */}
        {children && (
          <>
            <div className="space-y-4">{children}</div>
            <Separator />
          </>
        )}

        {/* Position & Size (Common) */}
        <div className="space-y-4">
          <h4 className="text-[10px] uppercase font-bold text-muted-foreground tracking-tight">
            Position & Size
          </h4>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] text-muted-foreground">
                X (Column)
              </Label>
              <Input
                type="number"
                value={component.position.x}
                readOnly
                className="h-8 text-xs bg-muted/30"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] text-muted-foreground">
                Y (Row)
              </Label>
              <Input
                type="number"
                value={component.position.y}
                readOnly
                className="h-8 text-xs bg-muted/30"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] text-muted-foreground">Width</Label>
              <Input
                type="number"
                value={component.position.w}
                readOnly
                className="h-8 text-xs bg-muted/30"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] text-muted-foreground">
                Height
              </Label>
              <Input
                type="number"
                value={component.position.h}
                readOnly
                className="h-8 text-xs bg-muted/30"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Actions (Common) */}
        <div className="pt-4 flex flex-col gap-2">
          <Button variant="outline" size="sm" className="w-full text-xs h-8">
            Reset Styles
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs h-8 gap-2"
            onClick={handleSaveStyles}
            disabled={updateComponentApi.isPending}
          >
            {updateComponentApi.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-3 w-3" />
            )}
            {updateComponentApi.isPending ? "Saving..." : "Save Styles"}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="w-full text-xs h-8 gap-2"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-3 w-3" />
            )}
            {deleteMutation.isPending ? "Removing..." : "Delete Element"}
          </Button>
        </div>
      </div>
    </aside>
  )
}

export default PropertiesWrapper
