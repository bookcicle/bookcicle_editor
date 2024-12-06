import { useContext } from "react";
import { SearchContext } from "./SearchContext";
import { SearchBar } from "./SearchBar";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

const SearchComponent = () => {
    const {
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        closeSearch,
        goToNext,
        goToPrevious,
    } = useContext(SearchContext);

    if (!isSearchOpen) return null;

    const handleChange = (event) => {
        setSearchQuery(event.target.value);
    };

    return (
        <div style={{ position: 'relative', zIndex: 1000 }}>
            <SearchBar
                label="Search"
                value={searchQuery}
                onChange={handleChange}
                onClose={closeSearch}
                autoFocus={true}
            >
                <Stack direction="row" spacing={1} sx={{ marginLeft: 1, scale: 0.9 }} >
                    <Button variant="text" size="small" onClick={goToPrevious}>
                        Previous
                    </Button>
                    <Button variant="text" size="small" onClick={goToNext}>
                        Next
                    </Button>
                </Stack>
            </SearchBar>
        </div>
    );
};

export default SearchComponent;