import {Extension, mergeAttributes, Node} from '@tiptap/core'
import {Plugin, PluginKey, TextSelection} from 'prosemirror-state'

const AiPlaceholder = Node.create({
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
        return [{tag: 'div[data-ai-placeholder]'}]
    },
    renderHTML({node, HTMLAttributes}) {
        return [
            'div',
            mergeAttributes(HTMLAttributes, {'data-ai-placeholder': ''}),
            node.attrs.placeholderText,
        ]
    },
})

export const AiEnterExtension = Extension.create({
    name: 'aiEnterExtension',
    addOptions() {
        return {
            /**
             * handleAi: a function returning an async generator of text chunks.
             * Called with (prompt, abortSignal, contentBeforeCursor).
             */
            // eslint-disable-next-line no-unused-vars
            handleAi: async (prompt, abortSignal, contentBeforeCursor) => {
                console.warn('[AiEnterExtension] No handleAi function provided.')
                return (async function* () {
                    yield `No AI function provided. Prompt was: ${prompt}`
                })()
            },
        }
    },

    addExtensions() {
        return [AiPlaceholder]
    },

    addProseMirrorPlugins() {
        return [
            new Plugin({
                key: new PluginKey('aiCancelOnKey'),
                props: {
                    handleKeyDown: () => {
                        if (this.editor.storage.aiEnterExtension?.streaming) {
                            this.editor.storage.aiEnterExtension.canceled = true
                            this.editor.storage.aiEnterExtension.abortController?.abort()
                        }
                        return false
                    },
                },
            }),
        ]
    },

    onCreate() {
        this.editor.storage.aiEnterExtension = {
            streaming: false,
            canceled: false,
            abortController: null,
        }
    },

    addKeyboardShortcuts() {
        return {
            Enter: () => {
                const {state} = this.editor
                const {selection} = state
                const {$from} = selection

                const blockText = $from.node($from.depth).textContent
                const regex = /^\/\/\/\s*ai\s+(.*)$/
                const match = blockText.match(regex)
                if (!match) {
                    return false
                }
                const prompt = match[1].trim()

                let placeholderPos = null
                let placeholderNodeSize = null
                this.editor
                    .chain()
                    .focus()
                    .command(({tr, state, dispatch}) => {
                        const posAfterBlock = $from.after($from.depth)

                        const placeholderNode = state.schema.nodes.aiPlaceholder.create({
                            placeholderText: 'Generating... Hit any button to cancel.',
                        })
                        tr.insert(posAfterBlock, placeholderNode)

                        placeholderPos = posAfterBlock
                        placeholderNodeSize = placeholderNode.nodeSize

                        const afterPlaceholder = posAfterBlock + placeholderNodeSize
                        const emptyParagraph = state.schema.nodes.paragraph.create({})
                        tr.insert(afterPlaceholder, emptyParagraph)

                        tr.setSelection(TextSelection.create(tr.doc, afterPlaceholder + 1))
                        dispatch(tr)
                        return true
                    })
                    .run()

                this.editor.storage.aiEnterExtension.streaming = true
                this.editor.storage.aiEnterExtension.canceled = false

                setTimeout(async () => {
                    const abortController = new AbortController()
                    this.editor.storage.aiEnterExtension.abortController = abortController
                    try {
                        const blockStart = $from.start($from.depth)
                        const contentBeforeCursor = state.doc.textBetween(0, blockStart, '\n\n')

                        const stream = await this.options.handleAi(
                            prompt,
                            abortController.signal,
                            contentBeforeCursor
                        )
                        let leftoverLine = ''

                        for await (const chunk of stream) {
                            if (this.editor.storage.aiEnterExtension.canceled) {
                                throw new Error('User canceled streaming')
                            }
                            leftoverLine += chunk
                            const lines = leftoverLine.split('\n')

                            for (let i = 0; i < lines.length - 1; i++) {
                                const textPart = lines[i]
                                if (textPart) {
                                    this.editor.chain().focus().insertContent(textPart).run()
                                }
                                this.editor.chain().focus().insertContent({type: 'paragraph'}).run()
                            }
                            leftoverLine = lines[lines.length - 1]
                        }

                        if (leftoverLine) {
                            this.editor.chain().focus().insertContent(leftoverLine).run()
                        }

                        this.editor.chain().focus().command(({tr, dispatch}) => {
                            tr.deleteRange(placeholderPos, placeholderPos + placeholderNodeSize)
                            dispatch(tr)
                            return true
                        }).run()

                        this.editor.chain().focus().run()
                    } catch (error) {
                        if (!`${error}`.includes('canceled')) {
                            console.error('[AiEnterExtension] AI streaming error:', error)
                        }

                        // eslint-disable-next-line no-unused-vars
                        this.editor.chain().focus().command(({tr, state, dispatch}) => {
                            tr.deleteRange(placeholderPos, placeholderPos + placeholderNodeSize)
                            dispatch(tr)
                            return true
                        }).run()

                        const canceled = error.message.includes('canceled')
                        if (!canceled) {
                            const errorMessage = `[AI Error: ${error.message || 'Unknown'}]`
                            this.editor.chain().focus().insertContent(errorMessage).run()
                        }
                    } finally {
                        this.editor.storage.aiEnterExtension.streaming = false
                        this.editor.storage.aiEnterExtension.canceled = false
                        this.editor.storage.aiEnterExtension.abortController = null
                    }
                }, 0)

                return true
            },
        }
    },
})
