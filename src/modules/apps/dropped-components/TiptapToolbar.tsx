"use client"

import React, { useState, useEffect } from "react"
import { type Editor } from "@tiptap/react"
import {
  Type,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Palette,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface TiptapToolbarProps {
  editor: Editor | null
}

const TiptapToolbar: React.FC<TiptapToolbarProps> = ({ editor }) => {
  const [fontSize, setFontSizeState] = useState("")

  useEffect(() => {
    if (!editor) return

    const updateFontSize = () => {
      const size =
        editor.getAttributes("textStyle").fontSize?.replace("px", "") || ""
      setFontSizeState(size)
    }

    editor.on("selectionUpdate", updateFontSize)
    editor.on("transaction", updateFontSize)

    // Initial value
    updateFontSize()

    return () => {
      editor.off("selectionUpdate", updateFontSize)
      editor.off("transaction", updateFontSize)
    }
  }, [editor])

  if (!editor) return null

  const colors = [
    { name: "Default", value: "inherit" },
    { name: "Primary", value: "var(--primary)" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Red", value: "#ef4444" },
    { name: "Green", value: "#22c55e" },
    { name: "Orange", value: "#f97316" },
    { name: "Purple", value: "#a855f7" },
  ]

  const headings = [
    { level: 1, icon: Heading1 },
    { level: 2, icon: Heading2 },
    { level: 3, icon: Heading3 },
    { level: 4, icon: Heading4 },
    { level: 5, icon: Heading5 },
    { level: 6, icon: Heading6 },
  ]

  return (
    <div className="flex items-center gap-0.5 p-1 bg-background border rounded-md shadow-md mb-1 absolute -top-12 left-0 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-xs" className="h-8 w-8">
            <Type className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-16">
          {headings.map(({ level, icon: Icon }) => (
            <DropdownMenuItem
              key={level}
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .toggleHeading({ level: level as any })
                  .run()
              }
              className={cn(
                "flex items-center gap-2",
                editor.isActive("heading", { level }) && "bg-muted",
              )}
            >
              <Icon className="h-4 w-4" />
              <span>H{level}</span>
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={cn(
              "flex items-center gap-2",
              editor.isActive("paragraph") && "bg-muted",
            )}
          >
            <Type className="h-4 w-4" />
            <span>P</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex items-center gap-1 px-1">
        <Input
          type="text"
          className="h-7 w-12 px-1 text-[10px] text-center bg-muted/50 border-none focus-visible:ring-1"
          placeholder="Size"
          value={fontSize}
          onChange={(e) => setFontSizeState(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const val = e.currentTarget.value
              if (val) {
                editor.chain().focus().setFontSize(`${val}px`).run()
              } else {
                editor.chain().focus().unsetFontSize().run()
              }
              e.currentTarget.blur()
            }
          }}
          onBlur={(e) => {
            const val = e.target.value
            if (val) {
              editor.chain().focus().setFontSize(`${val}px`).run()
            } else {
              editor.chain().focus().unsetFontSize().run()
            }
          }}
        />
        <span className="text-[10px] font-medium text-muted-foreground mr-1">
          px
        </span>
      </div>

      <Button
        variant="ghost"
        size="icon-xs"
        className={cn(
          "h-8 w-8",
          editor.isActive({ textAlign: "left" }) && "bg-muted",
        )}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon-xs"
        className={cn(
          "h-8 w-8",
          editor.isActive({ textAlign: "center" }) && "bg-muted",
        )}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon-xs"
        className={cn(
          "h-8 w-8",
          editor.isActive({ textAlign: "right" }) && "bg-muted",
        )}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <AlignRight className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="h-6 mx-1" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-xs" className="h-8 w-8">
            <Palette className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <div className="grid grid-cols-4 gap-1 p-2">
            {colors.map((color) => (
              <button
                key={color.name}
                className="w-6 h-6 rounded-full border border-muted hover:scale-110 transition-transform"
                style={{
                  backgroundColor:
                    color.value === "inherit" ? "white" : color.value,
                }}
                title={color.name}
                onClick={() => {
                  if (color.value === "inherit") {
                    editor.chain().focus().unsetColor().run()
                  } else {
                    editor.chain().focus().setColor(color.value).run()
                  }
                }}
              />
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default TiptapToolbar
