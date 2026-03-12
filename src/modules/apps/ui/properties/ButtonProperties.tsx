import React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Component } from "@/types"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Box,
  Layers,
  Palette,
  Radius,
  Layout,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Blend,
  Square,
} from "lucide-react"
import { useApplicationStore } from "@/lib/store/app"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

interface ButtonPropertiesProps {
  component: Component
}

const numberTypeStyle =
  "h-7 text-[10px] pl-5 pr-1 border-none bg-transparent focus-visible:bg-background focus-visible:ring-1"

type FillType = "solid" | "gradient"

/** Detect if a backgroundImage value is a linear-gradient */
const isGradientValue = (val?: string) =>
  typeof val === "string" && val.startsWith("linear-gradient")

/** Parse a stored linear-gradient string into its parts */
const parseGradient = (
  val?: string,
): { angle: number; start: string; end: string } => {
  const defaults = { angle: 90, start: "#6366f1", end: "#8b5cf6" }
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

/** Build a CSS linear-gradient string */
const buildGradient = (angle: number, start: string, end: string) =>
  `linear-gradient(${angle}deg, ${start}, ${end})`

const ButtonProperties: React.FC<ButtonPropertiesProps> = ({ component }) => {
  const updateComponent = useApplicationStore((state) => state.updateComponent)
  const [localStyle, setLocalStyle] = React.useState<any>(component.style || {})

  // Determine initial fill type from stored style
  const initialFillType: FillType = isGradientValue(
    (component.style as any)?.backgroundImage,
  )
    ? "gradient"
    : "solid"

  const [fillType, setFillType] = React.useState<FillType>(initialFillType)

  // Gradient state
  const initialGradient = parseGradient(
    (component.style as any)?.backgroundImage,
  )
  const [gradientStart, setGradientStart] = React.useState(
    initialGradient.start,
  )
  const [gradientEnd, setGradientEnd] = React.useState(initialGradient.end)
  const [gradientAngle, setGradientAngle] = React.useState(
    initialGradient.angle,
  )

  // ─── Helpers ────────────────────────────────────────────────────────────────

  const applyDomStyle = (key: string, value: string) => {
    const element = document.getElementById(component.id)
    if (element) {
      const btn = element.querySelector("button")
      if (btn instanceof HTMLElement) {
        ;(btn.style as any)[key] = value
      }
    }
  }

  const handleStyleChange = (key: string, value: string | number) => {
    const cssValue = typeof value === "number" ? `${value}px` : value
    applyDomStyle(key, cssValue)
    const updatedStyle = { ...localStyle, [key]: cssValue }
    setLocalStyle(updatedStyle)
    return updatedStyle
  }

  const handleBlur = (overriddenStyle?: any) => {
    const finalStyle =
      overriddenStyle &&
      typeof overriddenStyle === "object" &&
      !("nativeEvent" in overriddenStyle)
        ? overriddenStyle
        : localStyle
    updateComponent?.({ ...component, style: finalStyle })
  }

  const getStyleValue = (key: string) => {
    const val = localStyle?.[key]
    if (typeof val === "string" && val.endsWith("px")) {
      return parseInt(val.replace("px", ""), 10)
    }
    return val || ""
  }

  // ─── Solid background helpers ────────────────────────────────────────────────

  const backgroundColor = localStyle?.backgroundColor || "transparent"
  const colorPickerValue =
    backgroundColor.startsWith("#") && backgroundColor.length === 7
      ? backgroundColor
      : "#6366f1"

  // ─── Fill Type change ────────────────────────────────────────────────────────

  const handleFillTypeChange = (value: FillType) => {
    setFillType(value)
    if (value === "gradient") {
      const gradient = buildGradient(gradientAngle, gradientStart, gradientEnd)
      const updatedStyle = {
        ...localStyle,
        backgroundImage: gradient,
        backgroundColor: "transparent",
      }
      applyDomStyle("backgroundImage", gradient)
      applyDomStyle("backgroundColor", "transparent")
      setLocalStyle(updatedStyle)
      updateComponent?.({ ...component, style: updatedStyle })
    } else {
      const updatedStyle = {
        ...localStyle,
        backgroundImage: "none",
        backgroundColor: colorPickerValue,
      }
      applyDomStyle("backgroundImage", "none")
      applyDomStyle("backgroundColor", colorPickerValue)
      setLocalStyle(updatedStyle)
      updateComponent?.({ ...component, style: updatedStyle })
    }
  }

  // ─── Gradient helpers ────────────────────────────────────────────────────────

  const applyGradient = (
    angle: number,
    start: string,
    end: string,
    commit = false,
  ) => {
    const gradient = buildGradient(angle, start, end)
    applyDomStyle("backgroundImage", gradient)
    const updatedStyle = {
      ...localStyle,
      backgroundImage: gradient,
      backgroundColor: "transparent",
    }
    setLocalStyle(updatedStyle)
    if (commit) {
      updateComponent?.({ ...component, style: updatedStyle })
    }
    return updatedStyle
  }

  // ─── JSX ─────────────────────────────────────────────────────────────────────

  return (
    <div key={component.id} className="space-y-6 pb-4">
      {/* Appearance Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-1">
          <Blend className="h-3 w-3 text-primary" />
          <h4 className="text-[11px] uppercase font-bold text-foreground tracking-wider">
            Appearance
          </h4>
        </div>

        <div className="grid grid-cols-1 gap-3 px-1">
          {/* Fill Type Select */}
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

          {/* Solid Color Picker */}
          {fillType === "solid" && (
            <div className="space-y-1.5">
              <Label className="text-[10px] text-muted-foreground flex items-center justify-between">
                Background Color
                <span className="text-[9px] font-mono opacity-50">Hex</span>
              </Label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  className="size-4 rounded-md shrink-0 transition-transform cursor-pointer"
                  value={colorPickerValue}
                  onInput={(e: React.FormEvent<HTMLInputElement>) =>
                    handleStyleChange(
                      "backgroundColor",
                      (e.target as HTMLInputElement).value,
                    )
                  }
                  onBlur={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const updatedStyle = handleStyleChange(
                      "backgroundColor",
                      e.target.value,
                    )
                    handleBlur(updatedStyle)
                  }}
                />
                <Input
                  className="h-8 text-xs font-mono bg-muted/30 focus-visible:bg-background transition-colors"
                  placeholder="#6366f1"
                  value={localStyle?.backgroundColor || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleStyleChange("backgroundColor", e.target.value)
                  }
                  onBlur={() => handleBlur()}
                />
              </div>
            </div>
          )}

          {/* Gradient Controls */}
          {fillType === "gradient" && (
            <div className="space-y-2">
              {/* Gradient preview strip */}
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

              {/* Start Color */}
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
                    placeholder="#6366f1"
                    value={gradientStart}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setGradientStart(e.target.value)
                      applyGradient(gradientAngle, e.target.value, gradientEnd)
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

              {/* End Color */}
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
                    placeholder="#8b5cf6"
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

              {/* Angle */}
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
                  {/* Angle quick presets */}
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

          {/* Border Radius & Shadow */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Radius className="h-2.5 w-2.5" />
                Radius
              </Label>
              <Input
                type="number"
                className="h-8 text-xs bg-muted/30"
                placeholder="0px"
                value={getStyleValue("borderRadius")}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleStyleChange(
                    "borderRadius",
                    parseInt(e.target.value, 10),
                  )
                }
                onBlur={() => handleBlur()}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Layers className="h-2.5 w-2.5" />
                Shadow
              </Label>
              <Select
                value={(component.style as any)?.boxShadow || "none"}
                onValueChange={(val) =>
                  handleStyleChange(
                    "boxShadow",
                    val === "none"
                      ? "none"
                      : val === "sm"
                        ? "0 1px 2px 0 rgb(0 0 0 / 0.05)"
                        : val === "md"
                          ? "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                          : "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  )
                }
              >
                <SelectTrigger
                  className="h-8 w-full text-xs bg-muted/30 border-none shadow-none focus:ring-1"
                  onBlur={() => handleBlur()}
                >
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="sm">Soft</SelectItem>
                  <SelectItem value="md">Medium</SelectItem>
                  <SelectItem value="lg">Elevated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Spacing Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-1">
          <Layout className="h-3 w-3 text-primary" />
          <h4 className="text-[11px] uppercase font-bold text-foreground tracking-wider">
            Spacing
          </h4>
        </div>

        {/* Padding Sub-section */}
        <div className="space-y-2 px-1">
          <div className="flex items-center justify-between">
            <Label className="text-[10px] text-muted-foreground font-medium">
              Padding (px)
            </Label>
            <Box className="h-3 w-3 text-muted-foreground/30" />
          </div>
          <div className="grid grid-cols-4 gap-1.5 bg-muted/20 p-1 rounded-md border border-border/50">
            <div className="relative group">
              <ArrowUp className="absolute left-1.5 top-1/2 -translate-y-1/2 h-2.5 w-2.5 text-muted-foreground/40 pointer-events-none group-focus-within:text-primary transition-colors" />
              <Input
                type="number"
                className={numberTypeStyle}
                placeholder="0"
                value={getStyleValue("paddingTop")}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleStyleChange("paddingTop", parseInt(e.target.value, 10))
                }
                onBlur={() => handleBlur()}
              />
            </div>
            <div className="relative group">
              <ArrowDown className="absolute left-1.5 top-1/2 -translate-y-1/2 h-2.5 w-2.5 text-muted-foreground/40 pointer-events-none group-focus-within:text-primary transition-colors" />
              <Input
                type="number"
                className={numberTypeStyle}
                placeholder="0"
                value={getStyleValue("paddingBottom")}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleStyleChange(
                    "paddingBottom",
                    parseInt(e.target.value, 10),
                  )
                }
                onBlur={() => handleBlur()}
              />
            </div>
            <div className="relative group">
              <ArrowLeft className="absolute left-1.5 top-1/2 -translate-y-1/2 h-2.5 w-2.5 text-muted-foreground/40 pointer-events-none group-focus-within:text-primary transition-colors" />
              <Input
                type="number"
                className={numberTypeStyle}
                placeholder="0"
                value={getStyleValue("paddingLeft")}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleStyleChange("paddingLeft", parseInt(e.target.value, 10))
                }
                onBlur={() => handleBlur()}
              />
            </div>
            <div className="relative group">
              <ArrowRight className="absolute left-1.5 top-1/2 -translate-y-1/2 h-2.5 w-2.5 text-muted-foreground/40 pointer-events-none group-focus-within:text-primary transition-colors" />
              <Input
                type="number"
                className={numberTypeStyle}
                placeholder="0"
                value={getStyleValue("paddingRight")}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleStyleChange(
                    "paddingRight",
                    parseInt(e.target.value, 10),
                  )
                }
                onBlur={() => handleBlur()}
              />
            </div>
          </div>
        </div>

        {/* Margin Sub-section */}
        <div className="space-y-2 px-1">
          <div className="flex items-center justify-between">
            <Label className="text-[10px] text-muted-foreground font-medium">
              Margin (px)
            </Label>
            <Layout className="h-3 w-3 text-muted-foreground/30" />
          </div>
          <div className="grid grid-cols-4 gap-1.5 bg-muted/20 p-1 rounded-md border border-border/50">
            <div className="relative group">
              <ArrowUp className="absolute left-1.5 top-1/2 -translate-y-1/2 h-2.5 w-2.5 text-muted-foreground/40 pointer-events-none group-focus-within:text-primary transition-colors" />
              <Input
                type="number"
                className={numberTypeStyle}
                placeholder="0"
                value={getStyleValue("marginTop")}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleStyleChange("marginTop", parseInt(e.target.value, 10))
                }
                onBlur={() => handleBlur()}
              />
            </div>
            <div className="relative group">
              <ArrowDown className="absolute left-1.5 top-1/2 -translate-y-1/2 h-2.5 w-2.5 text-muted-foreground/40 pointer-events-none group-focus-within:text-primary transition-colors" />
              <Input
                type="number"
                className={numberTypeStyle}
                placeholder="0"
                value={getStyleValue("marginBottom")}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleStyleChange(
                    "marginBottom",
                    parseInt(e.target.value, 10),
                  )
                }
                onBlur={() => handleBlur()}
              />
            </div>
            <div className="relative group">
              <ArrowLeft className="absolute left-1.5 top-1/2 -translate-y-1/2 h-2.5 w-2.5 text-muted-foreground/40 pointer-events-none group-focus-within:text-primary transition-colors" />
              <Input
                type="number"
                className={numberTypeStyle}
                placeholder="0"
                value={getStyleValue("marginLeft")}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleStyleChange("marginLeft", parseInt(e.target.value, 10))
                }
                onBlur={() => handleBlur()}
              />
            </div>
            <div className="relative group">
              <ArrowRight className="absolute left-1.5 top-1/2 -translate-y-1/2 h-2.5 w-2.5 text-muted-foreground/40 pointer-events-none group-focus-within:text-primary transition-colors" />
              <Input
                type="number"
                className={numberTypeStyle}
                placeholder="0"
                value={getStyleValue("marginRight")}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleStyleChange("marginRight", parseInt(e.target.value, 10))
                }
                onBlur={() => handleBlur()}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ButtonProperties
