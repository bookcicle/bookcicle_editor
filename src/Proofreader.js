/**
 * @typedef {Object.<string, number>} WordList
 */

/**
 * @implements {IProofreaderInterface}
 */
export class Proofreader {
    /**
     * @param {WordList} wordListJson
     */
    constructor(wordListJson) {
        this.wordList = wordListJson;
    }

    /**
     * @param {string} sentence
     * @returns {Promise<ITextWithPosition[]>}
     */
    async proofreadText(sentence) {
        const wordsWithPosition = [];
        let currentOffset = 0;

        const words = sentence.split(/\W+/);
        for (const word of words) {
            const lowerWord = word.toLowerCase().trim();
            const length = word.length;
            if (!this.wordList[lowerWord] && lowerWord !== '') {
                wordsWithPosition.push({
                    offset: currentOffset, length, word,
                });
            }
            currentOffset += length + 1; // +1 for the space after each word
        }

        return wordsWithPosition;
    }

    /**
     * @param {string} word
     * @returns {Promise<string[]>}
     */
    async getSuggestions(word) {
        const suggestions = [];
        const alphabet = 'abcdefghijklmnopqrstuvwxyz';

        for (let i = 0; i < word.length; i++) {
            for (const char of alphabet) {
                const newWord = word.slice(0, i) + char + word.slice(i + 1);
                if (this.wordList[newWord]) {
                    suggestions.push(newWord);
                }
            }
        }

        return suggestions;
    }

    /**
     * @param {string} text
     * @returns {string}
     */
    normalizeTextForLanguage(text) {
        return text.toLowerCase();
    }
}