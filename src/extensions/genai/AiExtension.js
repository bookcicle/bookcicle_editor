// AiEnterExtension.js
import {Extension} from '@tiptap/core'
import {Plugin, PluginKey, TextSelection} from 'prosemirror-state'
import {AiPlaceholder} from './AiPlaceholder'

export const AiEnterExtension = Extension.create({
    name: 'aiEnterExtension',

    addOptions() {
        return {
            handleAi: async (prompt) => {
                console.warn('[AiEnterExtension] No handleAi function provided.')
                return `No AI function provided for prompt: ${prompt}`
            },
        }
    },

    addExtensions() {
        return [AiPlaceholder]
    },

    /**
     * 1) Add a plugin to listen for key events, so we can set "canceled = true" if the user presses any key.
     */
    addProseMirrorPlugins() {
        return [
            new Plugin({
                key: new PluginKey('aiCancelOnKey'),
                props: {
                    handleKeyDown: () => {
                        // If we are in the middle of streaming, set canceled = true
                        if (this.editor.storage.aiEnterExtension?.streaming) {
                            console.log('[AiEnterExtension] User typed => CANCELING AI')
                            this.editor.storage.aiEnterExtension.canceled = true
                        }
                        return false // let other handlers proceed
                    },
                },
            }),
        ]
    },

    /**
     * 2) We initialize extension storage to track "streaming" and "canceled" flags.
     */
    onCreate() {
        this.editor.storage.aiEnterExtension = {
            streaming: false, // are we in a streaming session?
            canceled: false,  // user typed => cancel
        }
    },

    addKeyboardShortcuts() {
        return {
            Enter: () => {
                const {state} = this.editor
                const {selection} = state
                const {$from} = selection

                // Check if line starts with "/// ai ..."
                const blockText = $from.node($from.depth).textContent
                const regex = /^\/\/\/\s*ai\s+(.*)$/
                const match = blockText.match(regex)
                if (!match) {
                    // Let normal Enter happen
                    return false
                }

                // 1) Extract the AI prompt
                const prompt = match[1].trim()

                // 2) Insert paragraph with AiPlaceholder
                this.editor
                    .chain()
                    .focus()
                    .command(({tr, state, dispatch}) => {
                        const posAfterBlock = $from.after($from.depth)

                        const paragraphNode = state.schema.nodes.paragraph.create(
                            {},
                            state.schema.nodes.aiPlaceholder.create({
                                placeholderText: 'Generating...',
                            }),
                        )

                        tr.insert(posAfterBlock, paragraphNode)
                        tr.setSelection(TextSelection.create(tr.doc, posAfterBlock + 1))
                        dispatch(tr)
                        return true
                    })
                    .run()

                // 3) Save the placeholder’s position
                const placeholderPos = this.editor.state.selection.from

                // 4) Mark that streaming has started and no cancel yet
                this.editor.storage.aiEnterExtension.streaming = true
                this.editor.storage.aiEnterExtension.canceled = false

                // 5) Async AI call
                setTimeout(async () => {
                    try {
                        // A generator or array of chunks
                        const stream = await this.options.handleAi(prompt)

                        // 5a) Remove the placeholder + insert an empty paragraph
                        let textParagraphPos = 0
                        this.editor
                            .chain()
                            .focus()
                            .command(({tr, state, dispatch}) => {
                                const paragraphStart = placeholderPos - 1
                                const paragraphEnd = placeholderPos + 1

                                // Delete the paragraph with placeholder
                                tr.deleteRange(paragraphStart, paragraphEnd)

                                // Insert a fresh empty paragraph
                                tr.insert(paragraphStart, state.schema.nodes.paragraph.create({}))
                                textParagraphPos = paragraphStart + 1

                                dispatch(tr)
                                return true
                            })
                            .run()

                        // We'll accumulate text in that new paragraph
                        let runningOffset = textParagraphPos

                        for await (const chunk of stream) {
                            // 5b) If user typed => canceled
                            if (this.editor.storage.aiEnterExtension.canceled) {
                                throw new Error('User canceled AI streaming')
                            }

                            // Insert chunk at runningOffset
                            this.editor
                                .chain()
                                // eslint-disable-next-line no-unused-vars
                                .command(({tr, _, dispatch}) => {
                                    tr.insertText(chunk, runningOffset)
                                    runningOffset += chunk.length
                                    dispatch(tr)
                                    return true
                                })
                                .run()
                        }

                        // 6) Done streaming => focus at the end
                        this.editor.chain().focus().run()
                    } catch (error) {
                        console.error('[AiEnterExtension] Streaming AI failed:', error)
                        const canceled = error.message.includes('canceled')
                        let errorMessage = canceled
                            ? '  [AI canceled by user input]  '
                            : `  [AI Error: ${error.message || 'Unknown'}, please retry.]  `

                        // Replace the placeholder paragraph with the error
                        this.editor
                            .chain()
                            .focus()
                            .deleteRange({from: placeholderPos - 1, to: placeholderPos + 1})
                            .insertContentAt(placeholderPos, errorMessage)
                            .run()
                    } finally {
                        // Clear streaming flag
                        this.editor.storage.aiEnterExtension.streaming = false
                        this.editor.storage.aiEnterExtension.canceled = false
                    }
                }, 0)

                // Prevent normal Enter
                return true
            },
        }
    },
})
