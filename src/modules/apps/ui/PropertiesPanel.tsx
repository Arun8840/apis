"use client"

import React from "react"
import { useApplicationStore } from "@/lib/store/app"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { X, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query"
import { api } from "@/lib/eden.client"
import { toast } from "sonner"

const PropertiesPanel = () => {
  const selectedId = useApplicationStore((state) => state.selectedComponentId)
  const setSelectedComponent = useApplicationStore(
    (state) => state.setSelectedComponent,
  )
  const removeComponent = useApplicationStore((state) => state.removeComponent)
  const application = useApplicationStore((state) => state.app)

  const selectedComponent = application?.components?.find(
    (c) => c.id === selectedId,
  )

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

  if (!selectedId || !selectedComponent) {
    return null
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
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-tight">
              Component Type
            </Label>
            <div className="px-3 py-2 bg-muted/50 rounded-md text-sm font-medium border border-border/50">
              {selectedComponent.type}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-tight">
              Component ID
            </Label>
            <div className="px-3 py-2 bg-muted/50 rounded-md text-xs font-mono text-muted-foreground truncate border border-border/50">
              {selectedComponent.id}
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="text-[10px] uppercase font-bold text-muted-foreground tracking-tight">
            Position & Size
          </h4>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="pos-x"
                className="text-[10px] text-muted-foreground"
              >
                X (Column)
              </Label>
              <Input
                id="pos-x"
                type="number"
                value={selectedComponent.position.x}
                readOnly
                className="h-8 text-xs bg-muted/30"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="pos-y"
                className="text-[10px] text-muted-foreground"
              >
                Y (Row)
              </Label>
              <Input
                id="pos-y"
                type="number"
                value={selectedComponent.position.y}
                readOnly
                className="h-8 text-xs bg-muted/30"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="size-w"
                className="text-[10px] text-muted-foreground"
              >
                Width
              </Label>
              <Input
                id="size-w"
                type="number"
                value={selectedComponent.position.w}
                readOnly
                className="h-8 text-xs bg-muted/30"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="size-h"
                className="text-[10px] text-muted-foreground"
              >
                Height
              </Label>
              <Input
                id="size-h"
                type="number"
                value={selectedComponent.position.h}
                readOnly
                className="h-8 text-xs bg-muted/30"
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className="pt-4 flex flex-col gap-2">
          <Button variant="outline" size="sm" className="w-full text-xs h-8">
            Reset Styles
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

export default PropertiesPanel
