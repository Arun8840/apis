"use client"

import React from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import TextAlign from "@tiptap/extension-text-align"
import { TextStyle } from "@tiptap/extension-text-style"
import { Color } from "@tiptap/extension-color"
import { DroppedComponentProps } from "@/types"
import { useApplicationStore } from "@/lib/store/app"
import TiptapToolbar from "../ui/TiptapToolbar"
import DroppedComponentWrapper from "../editor/DroppedComponentWrapper"
import { useMutation } from "@tanstack/react-query"
import { AddComponentReqType } from "../schema"
import { api } from "@/lib/eden.client"
import { FontSize } from "../ui/FontSize"
import { LineHeight } from "../ui/LineHeight"
import { FontWeight } from "../ui/FontWeight"

interface GridHeadingProps extends DroppedComponentProps {}

const Heading: React.FC<GridHeadingProps> = ({ value, dimensions }) => {
  const updateComponentStore = useApplicationStore(
    (state) => state.updateComponent,
  )
  const updateComponentApi = useMutation({
    mutationFn: async (data: AddComponentReqType) => {
      const response = await api.app.update.component.post(data)
      return response.data
    },
  })

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      Color,
      FontSize,
      LineHeight,
      FontWeight,
    ],
    content: value.options?.content || `<h1>This is a default header</h1>`,
    editable: !value.isPreview,
    immediatelyRender: false,
    onUpdate: async ({ editor }) => {
      const req = {
        ...value,
        options: {
          content: editor.getHTML(),
        },
      }
      updateComponentStore?.(req)
      updateComponentApi.mutate(req as AddComponentReqType)
    },
  })

  const dynamicStyles = value.style || {}

  return (
    <DroppedComponentWrapper
      value={value}
      dimensions={dimensions}
      toolbar={<TiptapToolbar editor={editor} />}
    >
      <div
        className="prose prose-sm max-w-none size-full transition-all duration-200"
        style={{
          ...dynamicStyles,
          opacity: dynamicStyles.opacity ?? 1,
          cursor: dynamicStyles.cursor ?? "text",
        }}
      >
        <EditorContent editor={editor} className="h-full outline-none" />
      </div>
    </DroppedComponentWrapper>
  )
}

export default React.memo(Heading)
