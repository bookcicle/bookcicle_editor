import {useCallback, useEffect, useMemo, useState} from 'react';
import PropTypes from 'prop-types';
import Popper from '@mui/material/Popper';
import {Button, Card, Typography} from '@mui/material';
import {SpellingActionsPlugin, spellingActionsPluginKey} from './SpellingActionsPlugin';
import db from '../../db/db.js';
import {getMarkRange} from "@tiptap/core";
import { Grid2 } from '@mui/material';

export const SpellingActionsMenu = ({editor, updateDelay, shouldShow = null, documentId}) => {
    const [popperState, setPopperState] = useState({
        open: false,
        anchorEl: null,
        matchData: null,
        showAllSuggestions: false, // Added state
    });

    const handleShowAllSuggestions = () => {
        setPopperState((prev) => ({
            ...prev,
            showAllSuggestions: true,
        }));
    };

    useEffect(() => {
        if (!editor || editor.isDestroyed) {
            return;
        }

        const plugin = SpellingActionsPlugin({updateDelay, shouldShow});
        editor.registerPlugin(plugin);

        const updatePopperState = () => {
            const pluginState = spellingActionsPluginKey.getState(editor.state);
            if (pluginState) {
                setPopperState((prevState) => {
                    const isSameMatchData = JSON.stringify(prevState.matchData) === JSON.stringify(pluginState.matchData);

                    const isSameState =
                        prevState.open === pluginState.open &&
                        prevState.anchorEl === pluginState.anchorEl &&
                        isSameMatchData;

                    if (!isSameState) {
                        return {
                            ...pluginState,
                            showAllSuggestions: isSameMatchData ? prevState.showAllSuggestions : false,
                        };
                    }
                    return prevState;
                });
            }
        };

        // Listen to editor updates
        editor.on('transaction', updatePopperState);

        // Initial state update
        updatePopperState();

        // Cleanup
        return () => {
            editor.unregisterPlugin(spellingActionsPluginKey);
            editor.off('transaction', updatePopperState);
            setPopperState({open: false, anchorEl: null, matchData: null});
        };
    }, [editor, updateDelay, shouldShow]);

    const handleAcceptSuggestion = useCallback(
        (suggestion) => {
            const {state} = editor;
            const {selection} = state;
            const type = state.schema.marks.languagetool;
            const markRange = getMarkRange(selection.$from, type);

            if (markRange) {
                editor
                    .chain()
                    .focus()
                    .setTextSelection({from: markRange.from, to: markRange.to})
                    .insertContent(suggestion)
                    .unsetMark('languagetool')
                    .run();
            } else {
                editor.chain().focus().insertContent(suggestion).run();
            }

            setPopperState((prev) => ({...prev, open: false}));
        },
        [editor]
    );

    const {open, anchorEl, matchData} = popperState;

    // Determine if the rule is a spelling error
    const isSpellingError = matchData?.rule?.id === 'MORFOLOGIK_RULE_EN_US'; // Adjust the rule ID as per your data

    // Extract the misspelled word
    let misspelledWord = '';
    if (isSpellingError && matchData) {
        misspelledWord = matchData.context.text.substring(
            matchData.context.offset,
            matchData.context.offset + matchData.context.length
        );
    }

    const handleIgnoreSuggestion = useCallback(async () => {
        editor
            .chain()
            .focus()
            .extendMarkRange('languagetool')
            .unsetMark('languagetool')
            .run();

        if (documentId) {
            try {
                if (isSpellingError && misspelledWord) {
                    // For misspelled words, store in ignoredWords
                    await db.ignoredWords.put({
                        value: misspelledWord,
                        documentId: String(documentId),
                    });
                } else if (matchData) {
                    // For grammar errors, store in ignoredGrammarErrors
                    const ignoredError = {
                        ruleId: matchData.rule.id,
                        contextText: matchData.context.text,
                        contextOffset: matchData.context.offset,
                        documentId: String(documentId),
                    };
                    await db.ignoredGrammarErrors.put(ignoredError);
                }
            } catch (error) {
                console.error('Error adding to ignored words/errors:', error);
            }
        }

        setPopperState((prev) => ({...prev, open: false}));
    }, [editor, isSpellingError, misspelledWord, matchData, documentId]);

    // Memoize style objects to prevent re-creations
    const cardStyles = useMemo(
        () => ({
            p: 1,
            m: 1,
            backgroundColor: 'background.default',
        }),
        []
    );

    const buttonStyles = useMemo(
        () => ({
            marginTop: '4px',
            textTransform: 'none',
        }),
        []
    );

    return (
        <>
            {open && matchData && (
                <Popper
                    open={open}
                    anchorEl={anchorEl}
                    placement="top"
                    sx={{zIndex: 1500, backgroundColor: 'transparent', maxWidth: 300}}
                >
                    <Card sx={cardStyles} variant="outlined">
                        <div style={{marginBottom: '8px'}}>{matchData.message}</div>
                        {matchData.replacements.length > 0 && (
                            <div style={{ marginBottom: '8px' }}>
                                <Typography variant="subtitle2">Suggestions:</Typography>
                                <Grid2 container columns={{ xs: 4, sm: 8, md: 12 }}>
                                    {(
                                        popperState.showAllSuggestions
                                            ? matchData.replacements
                                            : matchData.replacements.slice(0, 3)
                                    ).map((replacement, index) => (
                                        <Grid2 key={index} size={{ xs: 2, sm: 4, md: 4 }}>
                                            <Button
                                                onClick={() => handleAcceptSuggestion(replacement.value)}
                                                variant="text"
                                                color="primary"
                                                fullWidth
                                                sx={buttonStyles}
                                            >
                                                {replacement.value}
                                            </Button>
                                        </Grid2>
                                    ))}
                                </Grid2>

                                {matchData.replacements.length > 3 && !popperState.showAllSuggestions && (
                                    <div>
                                        <Button
                                            onClick={handleShowAllSuggestions}
                                            variant="text"
                                            color="primary"
                                            sx={buttonStyles}
                                        >
                                            ... more suggestions ...
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                        <div>
                            {isSpellingError ? (
                                <Button
                                    variant="text"
                                    color="primary"
                                    sx={buttonStyles}
                                    onClick={handleIgnoreSuggestion}
                                >
                                    <Typography variant={'caption'} fontStyle={'italic'}>
                                        Add &quot;{misspelledWord}&quot; to dictionary
                                    </Typography>
                                </Button>
                            ) : (
                                <Button
                                    variant="text"
                                    color="primary"
                                    sx={buttonStyles}
                                    onClick={handleIgnoreSuggestion}
                                >
                                    Ignore
                                </Button>
                            )}
                        </div>
                    </Card>
                </Popper>
            )}
        </>
    );
};

SpellingActionsMenu.propTypes = {
    /** An instance of the TipTap Editor. */
    editor: PropTypes.object.isRequired,
    /** Delay in milliseconds before the tooltip updates. */
    updateDelay: PropTypes.number,
    /** Function to determine whether the tooltip should be shown. */
    shouldShow: PropTypes.func,
    /** The document ID for storing ignored words */
    documentId: PropTypes.string.isRequired,
};