// extends from https://github.com/ueberdosis/tiptap/blob/main/packages/extension-color/src/color.ts
import '@tiptap/extension-text-style'

import { Extension } from '@tiptap/core'

export type BgColorOptions = {
  types: string[],
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    bgcolor: {
      /**
       * Set the background color
       */
      setBgColor: (backgroundColor: string) => ReturnType,
      /**
       * Unset the background color
       */
      unsetBgColor: () => ReturnType,
    }
  }
}

export const BgColor = Extension.create<BgColorOptions>({
  name: 'bgcolor',

  addOptions() {
    return {
      types: ['textStyle'],
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          backgroundColor: {
            default: null,
            parseHTML: element => element.style.backgroundColor?.replace(/['"]+/g, ''),
            renderHTML: attributes => {
              if (!attributes.backgroundColor) {
                return {}
              }

              return {
                style: `background-color: ${attributes.backgroundColor}`,
              }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setBgColor: backgroundColor => ({ chain }) => {
        return chain()
          .setMark('textStyle', { backgroundColor })
          .run()
      },
      unsetBgColor: () => ({ chain }) => {
        return chain()
          .setMark('textStyle', { backgroundColor: null })
          .removeEmptyTextStyle()
          .run()
      },
    }
  },
})
