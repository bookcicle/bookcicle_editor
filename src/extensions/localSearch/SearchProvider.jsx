import {useState} from "react";
import PropTypes from "prop-types";
import {SearchContext} from "./SearchContext.jsx";

export const SearchProvider = ({ children, editor }) => {
    const [searchQuery, setSearchQueryState] = useState("");
    const [replaceQuery, setReplaceQueryState] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isReplaceOpen, setIsReplaceOpen] = useState(false);

    // Function to open search bar
    const openSearch = () => setIsSearchOpen(true);

    const closeSearch = () => {
        setIsSearchOpen(false);
        setSearchQueryState("");
        editor?.commands.setSearchTerm("");

        // Always close replace bar
        closeReplace();
    };
    // Function to set search query and dispatch to editor
    const setSearchQuery = (query) => {
        setSearchQueryState(query);
        editor?.commands.setSearchTerm(query);
        editor?.commands.resetIndex();
    };

    // Function to open replace bar
    const openReplace = () => setIsReplaceOpen(true);

    // Function to close replace bar
    const closeReplace = () => {
        setIsReplaceOpen(false);
        setReplaceQueryState("");
        editor?.commands.setReplaceTerm("");
    };

    // Function to set replace query and dispatch to editor
    const setReplaceQuery = (query) => {
        setReplaceQueryState(query);
        editor?.commands.setReplaceTerm(query);
    };

    const goToNext = () => editor?.commands.nextSearchResult();
    const goToPrevious = () => editor?.commands.previousSearchResult();
    const handleReplace = () => editor?.commands.replace();
    const handleReplaceAll = () => editor?.commands.replaceAll();

    return (
        <SearchContext.Provider
            value={{
                searchQuery,
                setSearchQuery,
                replaceQuery,
                setReplaceQuery,
                isSearchOpen,
                openSearch,
                closeSearch,
                isReplaceOpen,
                openReplace,
                closeReplace,
                goToNext,
                goToPrevious,
                handleReplace,
                handleReplaceAll,
            }}
        >
            {children}
        </SearchContext.Provider>
    );
};

SearchProvider.propTypes = {
    children: PropTypes.node.isRequired,
    editor: PropTypes.shape({
        commands: PropTypes.shape({
            setSearchTerm: PropTypes.func,
            resetIndex: PropTypes.func,
            setReplaceTerm: PropTypes.func,
            nextSearchResult: PropTypes.func,
            previousSearchResult: PropTypes.func,
            replace: PropTypes.func,
            replaceAll: PropTypes.func,
        }),
    }),
};