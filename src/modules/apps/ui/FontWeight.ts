import { Extension } from "@tiptap/core"
import "@tiptap/extension-text-style"

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    fontWeight: {
      /**
       * Set the font weight
       */
      setFontWeight: (weight: string) => ReturnType
      /**
       * Unset the font weight
       */
      unsetFontWeight: () => ReturnType
    }
  }
}

export const FontWeight = Extension.create({
  name: "fontWeight",

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
          fontWeight: {
            default: null,
            parseHTML: (element) =>
              element.getAttribute("data-font-weight") || null,
            renderHTML: (attributes) => {
              if (!attributes.fontWeight) {
                return {}
              }

              return {
                style: `font-weight: ${attributes.fontWeight}`,
                "data-font-weight": attributes.fontWeight,
              }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setFontWeight:
        (fontWeight) =>
        ({ chain }) => {
          return chain().setMark("textStyle", { fontWeight }).run()
        },
      unsetFontWeight:
        () =>
        ({ chain }) => {
          return chain()
            .setMark("textStyle", { fontWeight: null })
            .removeEmptyTextStyle()
            .run()
        },
    }
  },
})
