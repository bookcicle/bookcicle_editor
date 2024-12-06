import { useEffect, useContext } from "react";
import { SearchContext } from "../extensions/localSearch/SearchContext.jsx";

const useLocalKeybindings = () => {
    const {
        setSearchQuery,
        setReplaceQuery,
        openSearch,
        openReplace,
    } = useContext(SearchContext);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.ctrlKey && (event.key === "f" || event.key === "F")) {
                event.preventDefault();
                const selectedText = window.getSelection().toString().trim();
                if (selectedText) {
                    setSearchQuery(selectedText);
                }
                openSearch();
            }
            else if (event.ctrlKey && (event.key === "r" || event.key === "R")) {
                event.preventDefault();
                const selectedText = window.getSelection().toString().trim();
                if (selectedText) {
                    setSearchQuery(selectedText);
                }
                openSearch();
                openReplace();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [setSearchQuery, setReplaceQuery, openSearch, openReplace]);
};

export default useLocalKeybindings;
