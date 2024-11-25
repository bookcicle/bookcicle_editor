// spellingMark.js
import { Mark } from '@tiptap/core'

const SpellingMark = Mark.create({
    name: 'spelling',

    parseHTML() {
        return [
            {
                tag: 'span[data-spelling="true"]',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return ['span', { ...HTMLAttributes, 'data-spelling': 'true' }, 0]
    },
})

export default SpellingMark
