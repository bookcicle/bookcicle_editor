// AiEnterExtension.js
import {Extension} from '@tiptap/core'
import {Plugin, PluginKey, TextSelection} from 'prosemirror-state'
import {AiPlaceholder} from './AiPlaceholder'

export const AiEnterExtension = Extension.create({
    name: 'aiEnterExtension',

    addOptions() {
        return {
            // eslint-disable-next-line no-unused-vars
            handleAi: async (prompt, abortSignal, content) => {
                console.warn('[AiEnterExtension] No handleAi function provided.')
                return [`No AI function provided for prompt: ${prompt}`]
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

                // Check if line starts with "/// ai ..."
                const blockText = $from.node($from.depth).textContent
                const regex = /^\/\/\/\s*ai\s+(.*)$/
                const match = blockText.match(regex)
                if (!match) {
                    return false // let normal Enter happen
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
                    // Create a new AbortController for this streaming session
                    const abortController = new AbortController()
                    this.editor.storage.aiEnterExtension.abortController = abortController

                    try {
                        // We find the start of the "/// ai" line:
                        const blockStart = $from.start($from.depth)

                        // Gather content from the start of the doc up to that line
                        const contentBeforeCursor = state.doc.textBetween(
                            0,
                            blockStart,
                            '\n\n'
                        )

                        // Call handleAi with (prompt, signal, contentBeforeCursor)
                        const stream = await this.options.handleAi(
                            prompt,
                            abortController.signal,
                            contentBeforeCursor,
                        )

                        // 5a) Remove the placeholder + insert an empty paragraph
                        let textParagraphPos = 0
                        this.editor
                            .chain()
                            .focus()
                            .command(({tr, state, dispatch}) => {
                                const paragraphStart = placeholderPos - 1
                                const paragraphEnd = placeholderPos + 1

                                tr.deleteRange(paragraphStart, paragraphEnd)
                                tr.insert(paragraphStart, state.schema.nodes.paragraph.create({}))
                                textParagraphPos = paragraphStart + 1
                                dispatch(tr)
                                return true
                            })
                            .run()

                        // We'll accumulate text in that new paragraph
                        let runningOffset = textParagraphPos

                        for await (const chunk of stream) {
                            if (this.editor.storage.aiEnterExtension.canceled) {
                                throw new Error('User canceled AI streaming')
                            }

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
                        const canceled = error.message.includes('canceled')
                        if (!canceled) {
                            console.error('[AiEnterExtension] Streaming AI failed:', error);
                            let errorMessage = canceled
                                ? '  [AI canceled by user input]  '
                                : `  [AI Error: ${error.message || 'Unknown'}, please retry.]  `

                            this.editor
                                .chain()
                                .focus()
                                .deleteRange({from: placeholderPos - 1, to: placeholderPos + 1})
                                .insertContentAt(placeholderPos, errorMessage)
                                .run()
                        }
                    } finally {
                        this.editor.storage.aiEnterExtension.streaming = false
                        this.editor.storage.aiEnterExtension.canceled = false
                        this.editor.storage.aiEnterExtension.abortController = null
                    }
                }, 0)

                // Prevent normal Enter
                return true
            },
        }
    },
})
