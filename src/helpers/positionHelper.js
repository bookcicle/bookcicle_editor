/**
 * Calculates the paragraph number and column offset based on the cursor position.
 *
 * @param {ResolvedPos} $from - The resolved position from the TextSelection.
 * @param {ProseMirrorNode} doc - The ProseMirror document node.
 * @returns {Object} - An object containing `paragraphNumber` and `columnOffset`.
 */
export const getCursorPositionInfo = ($from, doc) => {
    let paragraphNumber = 0;
    let found = false;

    // Define the node types that should be counted as lines
    const lineNumberNodeTypes = ["paragraph", "heading", "blockquote"];

    // Traverse the document's nodes to count paragraphs
    doc.descendants((node, pos, parent) => {
        // Only consider direct children of the document
        if (parent === doc && lineNumberNodeTypes.includes(node.type.name)) {
            // If the node is entirely before the cursor position
            if (pos + node.nodeSize <= $from.pos) {
                paragraphNumber += 1;
            } else if (pos <= $from.pos && $from.pos <= pos + node.nodeSize) {
                // Cursor is within this node
                paragraphNumber += 1;
                found = true;
                return false; // Stop traversal
            }
        }
    });

    // If no matching node found (cursor not within a counted node), set to 0
    if (!found) {
        paragraphNumber = 0;
    }

    // Column offset is the position within the parent node
    const columnOffset = $from.parentOffset + 1; // +1 for 1-based indexing

    return {
        paragraphNumber,
        columnOffset,
    };
};