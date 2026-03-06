"use client"

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

interface TextPropertiesProps {
  component: Component
}

const numberTypeStyle =
  "h-7 text-[10px] pl-5 pr-1 border-none bg-transparent focus-visible:bg-background focus-visible:ring-1"

const TextProperties: React.FC<TextPropertiesProps> = ({ component }) => {
  return (
    <div className="space-y-6 pb-4">
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
              <div className="h-8 w-8 rounded-md border-2 border-background shadow-sm bg-muted shrink-0 hover:scale-110 transition-transform cursor-pointer" />
              <Input
                className="h-8 text-xs font-mono bg-muted/30 focus-visible:bg-background transition-colors"
                placeholder="#FFFFFF"
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
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Layers className="h-2.5 w-2.5" />
                Shadow
              </Label>
              <Select>
                <SelectTrigger className="h-8 w-full text-xs bg-muted/30 border-none shadow-none focus:ring-1">
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
              />
            </div>
            <div className="relative group">
              <ArrowDown className="absolute left-1.5 top-1/2 -translate-y-1/2 h-2.5 w-2.5 text-muted-foreground/40 pointer-events-none group-focus-within:text-primary transition-colors" />
              <Input
                type="number"
                className={numberTypeStyle}
                placeholder="0"
              />
            </div>
            <div className="relative group">
              <ArrowLeft className="absolute left-1.5 top-1/2 -translate-y-1/2 h-2.5 w-2.5 text-muted-foreground/40 pointer-events-none group-focus-within:text-primary transition-colors" />
              <Input
                type="number"
                className={numberTypeStyle}
                placeholder="0"
              />
            </div>
            <div className="relative group">
              <ArrowRight className="absolute left-1.5 top-1/2 -translate-y-1/2 h-2.5 w-2.5 text-muted-foreground/40 pointer-events-none group-focus-within:text-primary transition-colors" />
              <Input
                type="number"
                className={numberTypeStyle}
                placeholder="0"
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
              />
            </div>
            <div className="relative group">
              <ArrowDown className="absolute left-1.5 top-1/2 -translate-y-1/2 h-2.5 w-2.5 text-muted-foreground/40 pointer-events-none group-focus-within:text-primary transition-colors" />
              <Input
                type="number"
                className={numberTypeStyle}
                placeholder="0"
              />
            </div>
            <div className="relative group">
              <ArrowLeft className="absolute left-1.5 top-1/2 -translate-y-1/2 h-2.5 w-2.5 text-muted-foreground/40 pointer-events-none group-focus-within:text-primary transition-colors" />
              <Input
                type="number"
                className={numberTypeStyle}
                placeholder="0"
              />
            </div>
            <div className="relative group">
              <ArrowRight className="absolute left-1.5 top-1/2 -translate-y-1/2 h-2.5 w-2.5 text-muted-foreground/40 pointer-events-none group-focus-within:text-primary transition-colors" />
              <Input
                type="number"
                className={numberTypeStyle}
                placeholder="0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TextProperties
