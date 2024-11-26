import Dexie from 'dexie';

const db = new Dexie('LanguageToolIgnoredSuggestions');

db.version(4).stores({
    ignoredWords: '++id, value, documentId, &[value+documentId]',
    ignoredGrammarErrors: '++id, ruleId, contextText, contextOffset, documentId, &[ruleId+contextText+contextOffset+documentId]',
});

export default db;
