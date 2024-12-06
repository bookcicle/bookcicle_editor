import { useContext } from "react";
import { SearchContext } from "./SearchContext";
import { SearchBar } from "./SearchBar";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

const ReplaceComponent = () => {
    const {
        replaceQuery,
        setReplaceQuery,
        isReplaceOpen,
        closeReplace,
        handleReplace,
        handleReplaceAll,
    } = useContext(SearchContext);

    if (!isReplaceOpen) return null;

    const handleChange = (event) => {
        setReplaceQuery(event.target.value);
    };

    return (
        <div style={{ position: 'relative', zIndex: 1000 }}>
            <SearchBar
                label="Replace"
                value={replaceQuery}
                onChange={handleChange}
                onClose={closeReplace}
            >
                <Stack direction="row" spacing={1} sx={{ marginLeft: 1, scale: 0.9 }}>
                    <Button variant="text" size="small" onClick={handleReplace}>
                        Replace
                    </Button>
                    <Button variant="text" size="small" onClick={handleReplaceAll}>
                        Replace All
                    </Button>
                </Stack>
            </SearchBar>
        </div>
    );
};

export default ReplaceComponent;