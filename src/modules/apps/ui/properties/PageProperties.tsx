"use client"

import React, { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { X, Save, Loader2 } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { api } from "@/lib/eden.client"
import { toast } from "sonner"
import { useApplicationStore } from "@/lib/store/app"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Layers, Square, Layout } from "lucide-react"
import { UpdatePageReqType } from "@/modules/apps/schema"

type FillType = "solid" | "gradient"

const isGradientValue = (val?: string) =>
  typeof val === "string" && val.startsWith("linear-gradient")

const parseGradient = (
  val?: string,
): { angle: number; start: string; end: string } => {
  const defaults = { angle: 90, start: "#ffffff", end: "#eeeeee" }
  if (!val) return defaults
  try {
    const match = val.match(
      /linear-gradient\((\d+)deg,\s*(#[0-9a-fA-F]{6}),\s*(#[0-9a-fA-F]{6})\)/,
    )
    if (match) {
      return {
        angle: parseInt(match[1], 10),
        start: match[2],
        end: match[3],
      }
    }
  } catch {
    // ignore
  }
  return defaults
}

const buildGradient = (angle: number, start: string, end: string) =>
  `linear-gradient(${angle}deg, ${start}, ${end})`

const PageProperties: React.FC = () => {
  const selectedPageId = useApplicationStore((state) => state.selectedPageId)
  const pageStyles = useApplicationStore((state) => state.pageStyles)
  const setSelectedPage = useApplicationStore((state) => state.setSelectedPage)
  const setPageStyles = useApplicationStore((state) => state.setPageStyles)

  const [localStyles, setLocalStyles] = useState({
    background: pageStyles?.background || "",
    padding: pageStyles?.padding || "20px",
  })

  useEffect(() => {
    if (pageStyles) {
      setLocalStyles({
        background: pageStyles.background || "",
        padding: pageStyles.padding || "20px",
      })
    }
  }, [pageStyles])

  const initialFillType: FillType = isGradientValue(localStyles.background)
    ? "gradient"
    : "solid"

  const [fillType, setFillType] = useState<FillType>(initialFillType)

  const initialGradient = parseGradient(localStyles.background)
  const [gradientStart, setGradientStart] = useState(initialGradient.start)
  const [gradientEnd, setGradientEnd] = useState(initialGradient.end)
  const [gradientAngle, setGradientAngle] = useState(initialGradient.angle)

  const updatePageApi = useMutation({
    mutationFn: async (data: UpdatePageReqType) => {
      const response = await api.app.update.page.post(data)
      if (response.error) throw response.error
      return response.data
    },
    onSuccess: (res) => {
      toast.success(res?.message || "Page styles updated successfully")
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to update page styles")
    },
  })

  const applyDomStyle = (key: string, value: string) => {
    const canvas = document.getElementById("editor-canvas")
    if (canvas) {
      const gridContainer = canvas.querySelector(".grid") as HTMLElement
      if (gridContainer) {
        ;(gridContainer.style as any)[key] = value
      }
    }
  }

  const handleBackgroundChange = (value: string) => {
    setLocalStyles((prev) => ({ ...prev, background: value }))
    applyDomStyle("background", value)
  }

  const handlePaddingChange = (value: string) => {
    setLocalStyles((prev) => ({ ...prev, padding: value }))
    applyDomStyle("padding", value)
  }

  const applyGradient = (
    angle: number,
    start: string,
    end: string,
    commit = false,
  ) => {
    const gradient = buildGradient(angle, start, end)
    applyDomStyle("background", gradient)
    setLocalStyles((prev) => ({ ...prev, background: gradient }))
    if (commit) {
      setPageStyles?.({ background: gradient, padding: localStyles.padding })
    }
  }

  const handleFillTypeChange = (value: FillType) => {
    setFillType(value)
    if (value === "gradient") {
      const gradient = buildGradient(gradientAngle, gradientStart, gradientEnd)
      applyDomStyle("background", gradient)
      setLocalStyles((prev) => ({ ...prev, background: gradient }))
    } else {
      const solidColor = "#ffffff"
      applyDomStyle("background", solidColor)
      setLocalStyles((prev) => ({ ...prev, background: solidColor }))
    }
  }

  const handleSave = () => {
    setPageStyles?.(localStyles)
    if (selectedPageId) {
      updatePageApi.mutate({
        id: selectedPageId,
        styles: {
          background: localStyles.background,
          padding: localStyles.padding,
        },
      })
    }
  }

  const handleClose = () => {
    setSelectedPage?.(null)
  }

  if (!selectedPageId) {
    return null
  }

  return (
    <aside className="w-72 border-l bg-background flex flex-col shrink-0 overflow-y-auto">
      <div className="h-12 flex items-center justify-between px-4 border-b shrink-0">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Page Properties
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <Layers className="h-3 w-3 text-primary" />
            <h4 className="text-[11px] uppercase font-bold text-foreground tracking-wider">
              Background
            </h4>
          </div>

          <div className="grid grid-cols-1 gap-3 px-1">
            <div className="space-y-1.5">
              <ToggleGroup
                type="single"
                value={fillType}
                onValueChange={handleFillTypeChange}
                className="justify-start"
                size={"sm"}
              >
                <ToggleGroupItem
                  value="solid"
                  aria-label="Solid"
                  className="h-8 w-8 p-0 data-[state=on]:bg-muted/50 rounded-none"
                  title="Solid"
                >
                  <Square className="h-4 w-4 fill-current" />
                </ToggleGroupItem>

                <ToggleGroupItem
                  value="gradient"
                  aria-label="Gradient"
                  className="h-8 w-8 p-0 data-[state=on]:bg-muted/50 rounded-none"
                  title="Gradient"
                >
                  <Layers className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {fillType === "solid" && (
              <div className="space-y-1.5">
                <Label className="text-[10px] text-muted-foreground flex items-center justify-between">
                  Color
                  <span className="text-[9px] font-mono opacity-50">Hex</span>
                </Label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    className="size-4 rounded-md shrink-0 transition-transform cursor-pointer"
                    value={
                      localStyles.background.startsWith("#")
                        ? localStyles.background
                        : "#ffffff"
                    }
                    onInput={(e: React.FormEvent<HTMLInputElement>) =>
                      handleBackgroundChange(
                        (e.target as HTMLInputElement).value,
                      )
                    }
                    onBlur={() => {
                      setPageStyles?.(localStyles)
                    }}
                  />
                  <Input
                    className="h-8 text-xs font-mono bg-muted/30 focus-visible:bg-background transition-colors"
                    placeholder="#ffffff"
                    value={localStyles.background}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleBackgroundChange(e.target.value)
                    }
                    onBlur={() => setPageStyles?.(localStyles)}
                  />
                </div>
              </div>
            )}

            {fillType === "gradient" && (
              <div className="space-y-2">
                <div
                  className="h-6 w-full rounded-md border border-border/40"
                  style={{
                    background: buildGradient(
                      gradientAngle,
                      gradientStart,
                      gradientEnd,
                    ),
                  }}
                />

                <div className="space-y-1.5">
                  <Label className="text-[10px] text-muted-foreground flex items-center justify-between">
                    Start Color
                    <span className="text-[9px] font-mono opacity-50">Hex</span>
                  </Label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      className="size-7 rounded-md shrink-0 cursor-pointer"
                      value={gradientStart}
                      onInput={(e: React.FormEvent<HTMLInputElement>) => {
                        const val = (e.target as HTMLInputElement).value
                        setGradientStart(val)
                        applyGradient(gradientAngle, val, gradientEnd)
                      }}
                      onBlur={() =>
                        applyGradient(
                          gradientAngle,
                          gradientStart,
                          gradientEnd,
                          true,
                        )
                      }
                    />
                    <Input
                      className="h-8 text-xs font-mono bg-muted/30 focus-visible:bg-background transition-colors"
                      placeholder="#ffffff"
                      value={gradientStart}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setGradientStart(e.target.value)
                        applyGradient(
                          gradientAngle,
                          e.target.value,
                          gradientEnd,
                        )
                      }}
                      onBlur={() =>
                        applyGradient(
                          gradientAngle,
                          gradientStart,
                          gradientEnd,
                          true,
                        )
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] text-muted-foreground flex items-center justify-between">
                    End Color
                    <span className="text-[9px] font-mono opacity-50">Hex</span>
                  </Label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      className="size-7 rounded-md shrink-0 cursor-pointer"
                      value={gradientEnd}
                      onInput={(e: React.FormEvent<HTMLInputElement>) => {
                        const val = (e.target as HTMLInputElement).value
                        setGradientEnd(val)
                        applyGradient(gradientAngle, gradientStart, val)
                      }}
                      onBlur={() =>
                        applyGradient(
                          gradientAngle,
                          gradientStart,
                          gradientEnd,
                          true,
                        )
                      }
                    />
                    <Input
                      className="h-8 text-xs font-mono bg-muted/30 focus-visible:bg-background transition-colors"
                      placeholder="#eeeeee"
                      value={gradientEnd}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setGradientEnd(e.target.value)
                        applyGradient(
                          gradientAngle,
                          gradientStart,
                          e.target.value,
                        )
                      }}
                      onBlur={() =>
                        applyGradient(
                          gradientAngle,
                          gradientStart,
                          gradientEnd,
                          true,
                        )
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] text-muted-foreground flex items-center justify-between">
                    Angle
                    <span className="text-[9px] font-mono opacity-50">deg</span>
                  </Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="number"
                      min={0}
                      max={360}
                      className="h-8 text-xs bg-muted/30"
                      placeholder="90"
                      value={gradientAngle}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const val = parseInt(e.target.value, 10) || 0
                        setGradientAngle(val)
                        applyGradient(val, gradientStart, gradientEnd)
                      }}
                      onBlur={() =>
                        applyGradient(
                          gradientAngle,
                          gradientStart,
                          gradientEnd,
                          true,
                        )
                      }
                    />
                    <div className="flex gap-1">
                      {[0, 45, 90, 135].map((deg) => (
                        <button
                          key={deg}
                          type="button"
                          title={`${deg}°`}
                          className={`h-8 w-8 rounded text-[9px] font-mono border transition-colors ${
                            gradientAngle === deg
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-muted/30 border-border/40 hover:bg-muted/60 text-muted-foreground"
                          }`}
                          onClick={() => {
                            setGradientAngle(deg)
                            applyGradient(deg, gradientStart, gradientEnd, true)
                          }}
                        >
                          {deg}°
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <Layout className="h-3 w-3 text-primary" />
            <h4 className="text-[11px] uppercase font-bold text-foreground tracking-wider">
              Spacing
            </h4>
          </div>

          <div className="space-y-2 px-1">
            <div className="space-y-1.5">
              <Label className="text-[10px] text-muted-foreground flex items-center justify-between">
                Padding
                <span className="text-[9px] font-mono opacity-50">CSS</span>
              </Label>
              <Input
                className="h-8 text-xs font-mono bg-muted/30 focus-visible:bg-background transition-colors"
                placeholder="20px"
                value={localStyles.padding}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handlePaddingChange(e.target.value)
                }
                onBlur={() => setPageStyles?.(localStyles)}
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className="pt-2 flex flex-col gap-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs h-8 gap-2"
            onClick={handleSave}
            disabled={updatePageApi.isPending}
          >
            {updatePageApi.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-3 w-3" />
            )}
            {updatePageApi.isPending ? "Saving..." : "Save Styles"}
          </Button>
        </div>
      </div>
    </aside>
  )
}

export default PageProperties
