import { Node, mergeAttributes } from '@tiptap/core'

export const AiPlaceholder = Node.create({
    name: 'aiPlaceholder',

    group: 'block',
    atom: true,
    selectable: false,
    draggable: false,

    addAttributes() {
        return {
            placeholderText: {
                default: 'Generating…',
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-ai-placeholder]',
            },
        ]
    },

    renderHTML({ node, HTMLAttributes }) {
        return [
            'div',
            mergeAttributes(HTMLAttributes, { 'data-ai-placeholder': '' }),
            node.attrs.placeholderText,
        ]
    },
})
