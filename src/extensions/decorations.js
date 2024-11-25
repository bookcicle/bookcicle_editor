// decorations.js
import { Decoration } from 'prosemirror-view'
import { v4 as uuidv4 } from 'uuid'

// Creates a decoration for a spelling error
export const createSpellingDecoration = (from, to, match) =>
    Decoration.inline(from, to, {
        class: `lt lt-${match.rule.issueType}`,
        nodeName: 'span',
        'data-spelling': 'true',
        match: JSON.stringify(match),
        uuid: uuidv4(),
    })

// Finds all decorations with `data-spelling` attribute
export const findSpellingDecorations = (decorationSet) => {
    return decorationSet.find().filter(decoration =>
        decoration.spec['data-spelling'] === 'true'
    )
}
