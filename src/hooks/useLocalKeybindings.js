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
            const isCtrlOrCommandKey = event.ctrlKey || event.metaKey;
            const isShiftKey = event.shiftKey;
            const isFKey = event.key === "f" || event.key === "F";
            const isRKey = event.key === "r" || event.key === "R";

            // Ignore CtrlOrCommand + Shift + F/R
            if (isCtrlOrCommandKey && isShiftKey && (isFKey || isRKey)) {
                return;
            }

            if (isCtrlOrCommandKey && isFKey) {
                event.preventDefault();
                const selectedText = window.getSelection().toString().trim();
                if (selectedText) {
                    setSearchQuery(selectedText);
                }
                openSearch();
            } else if (isCtrlOrCommandKey && isRKey) {
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
