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
} from "lucide-react"
import { useApplicationStore } from "@/lib/store/app"

interface ButtonPropertiesProps {
  component: Component
}

const numberTypeStyle =
  "h-7 text-[10px] pl-5 pr-1 border-none bg-transparent focus-visible:bg-background focus-visible:ring-1"

const ButtonProperties: React.FC<ButtonPropertiesProps> = ({ component }) => {
  const updateComponent = useApplicationStore((state) => state.updateComponent)
  const colorInputRef = React.useRef<HTMLInputElement>(null)
  const [localStyle, setLocalStyle] = React.useState(component.style || {})

  const handleStyleChange = (key: string, value: string | number) => {
    const cssValue = typeof value === "number" ? `${value}px` : value

    // 1. Direct DOM manipulation for lag-free visual update
    const element = document.getElementById(component.id)
    if (element) {
      const proseDiv = element.querySelector(".prose")
      if (proseDiv instanceof HTMLElement) {
        ;(proseDiv.style as any)[key] = cssValue
      }
    }

    // 2. Update local state for panel UI consistency
    const updatedStyle = {
      ...localStyle,
      [key]: cssValue,
    }
    setLocalStyle(updatedStyle)
    return updatedStyle
  }

  const handleBlur = (overriddenStyle?: any) => {
    // 3. Sync with store ONLY on blur (or commit) to prevent excessive re-renders
    // We check if overriddenStyle is a valid style object and not a React event
    const finalStyle =
      overriddenStyle &&
      typeof overriddenStyle === "object" &&
      !("nativeEvent" in overriddenStyle)
        ? overriddenStyle
        : localStyle

    updateComponent?.({ ...component, style: finalStyle })
  }

  const getStyleValue = (key: string) => {
    const val = (localStyle as any)?.[key]
    if (typeof val === "string" && val.endsWith("px")) {
      return parseInt(val.replace("px", ""), 10)
    }
    return val || ""
  }

  const backgroundColor = (localStyle as any)?.backgroundColor || "transparent"
  // Ensure we have a valid hex for the color input, otherwise default to white
  const colorPickerValue =
    backgroundColor.startsWith("#") && backgroundColor.length === 7
      ? backgroundColor
      : "#ffffff"

  return (
    <div key={component.id} className="space-y-6 pb-4">
      {/* Appearance Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-1">
          <Palette className="h-3 w-3 text-primary" />
          <h4 className="text-[11px] uppercase font-bold text-foreground tracking-wider">
            Appearance
          </h4>
        </div>

        <div className="grid grid-cols-1 gap-3 px-1">
          <div className="space-y-1.5">
            <Label className="text-[10px] text-muted-foreground flex items-center justify-between">
              Background Color
              <span className="text-[9px] font-mono opacity-50">Hex</span>
            </Label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                ref={colorInputRef}
                className="size-7 rounded-md shrink-0 transition-transform cursor-pointer"
                value={colorPickerValue}
                onInput={(e: React.FormEvent<HTMLInputElement>) =>
                  handleStyleChange(
                    "backgroundColor",
                    (e.target as HTMLInputElement).value,
                  )
                }
                onBlur={(e: React.ChangeEvent<HTMLInputElement>) => {
                  // Only sync with store when the user has finished picking (standard for onChange on color inputs)
                  const updatedStyle = handleStyleChange(
                    "backgroundColor",
                    e.target.value,
                  )
                  handleBlur(updatedStyle)
                }}
              />

              <Input
                className="h-8 text-xs font-mono bg-muted/30 focus-visible:bg-background transition-colors"
                placeholder="#FFFFFF"
                value={localStyle?.backgroundColor || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleStyleChange("backgroundColor", e.target.value)
                }
                onBlur={() => handleBlur()}
              />
            </div>
          </div>

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
