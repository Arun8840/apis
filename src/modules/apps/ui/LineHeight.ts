import { Extension } from "@tiptap/core"
import "@tiptap/extension-text-style"

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    lineHeight: {
      /**
       * Set the line height
       */
      setLineHeight: (height: string) => ReturnType
      /**
       * Unset the line height
       */
      unsetLineHeight: () => ReturnType
    }
  }
}

export const LineHeight = Extension.create({
  name: "lineHeight",

  addOptions() {
    return {
      types: ["textStyle"],
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: null,
            parseHTML: (element) =>
              element.getAttribute("data-line-height") || null,
            renderHTML: (attributes) => {
              if (!attributes.lineHeight) {
                return {}
              }

              return {
                style: `line-height: ${attributes.lineHeight}`,
                "data-line-height": attributes.lineHeight,
              }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setLineHeight:
        (lineHeight) =>
        ({ chain }) => {
          return chain().setMark("textStyle", { lineHeight }).run()
        },
      unsetLineHeight:
        () =>
        ({ chain }) => {
          return chain()
            .setMark("textStyle", { lineHeight: null })
            .removeEmptyTextStyle()
            .run()
        },
    }
  },
})
