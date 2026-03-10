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
import { Button } from "@/components/ui/button"

interface ButtonProps extends DroppedComponentProps {}

const ButtonComponent: React.FC<ButtonProps> = ({ value, dimensions }) => {
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
    ],
    content: value.options?.content || `Click me`,
    editable: !value.isPreview,
    immediatelyRender: false,
    onBlur: async ({ editor }) => {
      const req = {
        ...value,
        options: {
          content: editor.getHTML(),
        },
      }
      updateComponentStore?.(req)
      updateComponentApi.mutate(req)
    },
  })

  return (
    <DroppedComponentWrapper
      value={value}
      dimensions={dimensions}
      toolbar={<TiptapToolbar editor={editor} />}
    >
      <Button type="button" className="size-full">
        <EditorContent
          editor={editor}
          className="size-full  flex justify-center items-center outline-none"
        />
      </Button>
    </DroppedComponentWrapper>
  )
}

export default ButtonComponent
