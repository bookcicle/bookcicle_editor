import { Node, mergeAttributes } from '@tiptap/core'

export const AiPlaceholder = Node.create({
    name: 'aiPlaceholder',

    // Make this a block-level node so it displays well on its own line
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

    // Render a block-level <div> with the current placeholder text
    renderHTML({ node, HTMLAttributes }) {
        return [
            'div',
            mergeAttributes(HTMLAttributes, { 'data-ai-placeholder': '' }),
            node.attrs.placeholderText,
        ]
    },
})
