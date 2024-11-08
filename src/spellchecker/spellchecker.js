import {Decoration, DecorationSet} from 'prosemirror-view';
import {LOADING_TRANSACTION, SPELLCHECKER_TRANSACTION} from './spellchecker-extension';
import {debounce} from './util';

export default class Spellchecker {
    constructor(proofreader, uiStrings, showSuggestionsEvent) {
        this.proofreader = proofreader;
        this.uiStrings = uiStrings;
        this.showSuggestionsEvent = showSuggestionsEvent;
        this.decorationSet = DecorationSet.empty;

        this.suggestionBox = document.createElement('div');
        this.suggestionBox.id = 'suggestions-box';
        this.suggestionBox.tabIndex = 0;
        this.hideSuggestionBox();

        this.isInitialProofreadingDone = false;
        this.lastOriginalFrom = 0;

        this.debouncedProofreadDoc = debounce(this.proofreadDoc.bind(this), 500);
        this.debouncedGetMatchAndSetDecorations = debounce(this.getMatchAndSetDecorations.bind(this), 300);
        this.debouncedClickEventsListener = debounce(this.clickEventsListener.bind(this), 0);
        this.debouncedAcceptSuggestionEventsListener = debounce(this.acceptSuggestionListener.bind(this), 0);
    }

    get completeProofreadingDone() {
        return this.isInitialProofreadingDone;
    }

    setDecorationSet(decorationSet) {
        this.decorationSet = decorationSet;
    }

    getDecorationSet() {
        return this.decorationSet;
    }

    setEditorView(editorView) {
        this.editorView = editorView;
    }

    getEditorView() {
        return this.editorView;
    }

    getSuggestionBox() {
        return this.suggestionBox;
    }

    hideSuggestionBox() {
        this.suggestionBox.textContent = '';
        this.suggestionBox.style.display = 'none';
    }

    proofreadDoc(doc) {
        let textNodesWithPosition = [];
        let index = 0;

        doc?.descendants((node, pos) => {
            if (!node.isText) {
                index += 1;
                return true;
            }

            const localTextNode = {
                text: '',
                from: -1,
                to: -1,
            };

            if (textNodesWithPosition[index]) {
                localTextNode.text = textNodesWithPosition[index].text + node.text;
                localTextNode.from = textNodesWithPosition[index].from;
                localTextNode.to = localTextNode.from + localTextNode.text.length;
            } else {
                localTextNode.text = node.text || '';
                localTextNode.from = pos;
                localTextNode.to = pos + localTextNode.text.length;
            }
            textNodesWithPosition[index] = localTextNode;
        });

        textNodesWithPosition = textNodesWithPosition.filter(Boolean);

        let finalText = '';
        let lastPos = 1;
        for (const { text, from, to } of textNodesWithPosition) {
            const diff = from - lastPos;
            if (diff > 0) {
                finalText += ' '.repeat(diff);
            }
            lastPos = to;
            finalText += text;
        }

        const request = this.getMatchAndSetDecorations(doc, finalText, 1);

        if (this.editorView) {
            this.dispatch(this.editorView.state.tr.setMeta(LOADING_TRANSACTION, true));
        }
        request.then(() => {
            if (this.editorView) {
                this.dispatch(this.editorView.state.tr.setMeta(LOADING_TRANSACTION, false));
            }
        });

        this.isInitialProofreadingDone = true;
    }

    async getMatchAndSetDecorations(node, text, originalFrom) {
        const matches = await this.proofreader.proofreadText(this.proofreader.normalizeTextForLanguage(text));

        const decorations = matches.map((match) => {
            const docFrom = match.offset + originalFrom;
            const docTo = docFrom + match.length;
            return Decoration.inline(docFrom, docTo, {
                class: 'spell-error',
                nodeName: 'span',
                word: JSON.stringify({ match, docFrom, docTo }),
            });
        });

        const decorationsToRemove = this.decorationSet.find(originalFrom, originalFrom + text.length);
        this.decorationSet = this.decorationSet.remove(decorationsToRemove).add(node, decorations);

        if (this.editorView) {
            this.dispatch(this.editorView.state.tr.setMeta(SPELLCHECKER_TRANSACTION, true));
        }

        setTimeout(this.addEventListenersToDecorations.bind(this), 100);
    }

    addEventListenersToDecorations() {
        document.querySelectorAll('span.spell-error').forEach((el) => {
            el.addEventListener('click', this.debouncedClickEventsListener);
        });
    }

    addEventListenersToSuggestionBox() {
        this.suggestionBox.querySelectorAll('li').forEach((sugg) => {
            sugg.addEventListener('click', this.debouncedAcceptSuggestionEventsListener);
        });
    }

    dispatch(tr) {
        this.editorView?.dispatch(tr);
    }

    findChangedTextNodes(node, pos, from, to) {
        if (!node.isBlock) return;

        if (!node.isTextblock) {
            node.descendants((nde, ps) => {
                this.findChangedTextNodes(nde, ps, from, to);
            });
            return;
        }

        const [nodeFrom, nodeTo] = [pos, pos + node.nodeSize];
        if (!(nodeFrom <= from && to <= nodeTo)) return;

        this.onNodeChanged(node, node.textContent, pos + 1);
    }

    onNodeChanged(node, text, originalFrom) {
        if (originalFrom !== this.lastOriginalFrom) {
            this.getMatchAndSetDecorations(node, text, originalFrom);
        } else {
            this.debouncedGetMatchAndSetDecorations(node, text, originalFrom);
        }
        this.lastOriginalFrom = originalFrom;
    }

    async clickEventsListener(e) {
        const matchString = e.target?.getAttribute('word')?.trim();
        if (!matchString) {
            console.error('No match string provided');
            return;
        }

        const { match, docFrom, docTo } = JSON.parse(matchString);
        const suggestions = await this.proofreader.getSuggestions(this.proofreader.normalizeTextForLanguage(match.word));

        if (this.editorView) {
            this.addSuggestionsList(suggestions, docFrom, docTo);
            this.suggestionBox.style.display = '';

            const start = this.editorView.coordsAtPos(docFrom);
            const end = this.editorView.coordsAtPos(docTo);

            const box = this.suggestionBox?.offsetParent?.getBoundingClientRect() || new DOMRect(0, 0);

            const left = Math.max((start.left + end.left) / 2, start.left + 3);
            this.suggestionBox.style.left = `${left - box.left}px`;
            this.suggestionBox.style.top = `${start.bottom + 5 + window.scrollY}px`;

            if (this.showSuggestionsEvent) {
                this.showSuggestionsEvent(this.proofreader.normalizeTextForLanguage(match.word));
            }
        }

        this.addEventListenersToSuggestionBox();
        return false;
    }

    acceptSuggestionListener(e) {
        const from = Number(e.target.dataset.from);
        const to = Number(e.target.dataset.to);

        if (this.editorView) {
            this.editorView.dispatch(this.editorView.state.tr.insertText(e.target.textContent || '', from, to));
        }
        this.hideSuggestionBox();
    }

    addSuggestionsList(suggestions, docFrom, docTo) {
        this.suggestionBox.textContent = '';

        const ul = document.createElement('ul');
        ul.className = 'suggestion-list';

        suggestions.forEach((sugg) => {
            const li = document.createElement('li');
            li.innerText = sugg;
            li.dataset.from = docFrom;
            li.dataset.to = docTo;
            ul.appendChild(li);
        });

        this.suggestionBox.appendChild(ul);

        if (suggestions.length === 0) {
            const b = document.createElement('b');
            b.textContent = this.uiStrings?.noSuggestions || 'No suggestions found';
            this.suggestionBox.appendChild(b);
        }
    }
}