import {styled} from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import FindReplaceIcon from '@mui/icons-material/FindReplace';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';

const Search = styled('div')(({theme}) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[25],
    margin: theme.spacing(1),
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.up('sm')]: {
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({theme}) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const CloseIconWrapper = styled('div')(({theme}) => ({
    padding: theme.spacing(0, 1),
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({theme}) => ({
    color: 'inherit',
    flex: 1,
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        paddingRight: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

/**
 * SearchBar Component
 *
 * Renders a search or replace input field with corresponding icons and a close button.
 *
 * @param {Object} props - Component props
 * @param {string} [props.label="Search"] - Determines whether to show Search or Replace icon
 * @param {string} props.value - The current value of the input
 * @param {Function} props.onChange - Function to handle input changes
 * @param {Function} [props.onClose] - Function to call when the close button is clicked
 * @param {React.ReactNode} [props.children] - Optional children elements (e.g., buttons)
 */
export const SearchBar = ({label = "Search", value, onChange, onClose, autoFocus = false, children}) => {
    return (
        <Search>
            {/* Search or Replace Icon */}
            <SearchIconWrapper>
                {label === "Search" && <SearchIcon/>}
                {label === "Replace" && <FindReplaceIcon/>}
            </SearchIconWrapper>

            {/* Input Field */}
            <StyledInputBase
                placeholder={label}
                inputProps={{'aria-label': label.toLowerCase()}}
                value={value}
                onChange={onChange}
                autoFocus={autoFocus}
            />

            {/* Optional Children (Buttons) */}
            {children}

            {/* Close Icon Button */}
            {onClose && (
                <CloseIconWrapper>
                    <IconButton
                        aria-label={`close ${label.toLowerCase()}`}
                        onClick={onClose}
                        size="small"
                        sx={{
                            color: 'inherit',
                        }}
                    >
                        <CloseIcon fontSize="small"/>
                    </IconButton>
                </CloseIconWrapper>
            )}
        </Search>
    );
};

SearchBar.propTypes = {
    /**
     * Determines whether the Search or Replace icon is displayed.
     * - "Search" displays the SearchIcon.
     * - "Replace" displays the FindReplaceIcon.
     */
    label: PropTypes.string,

    /**
     * The current value of the input field.
     */
    value: PropTypes.string.isRequired,

    /**
     * Function to handle input changes.
     */
    onChange: PropTypes.func.isRequired,

    /**
     * Function to handle the closing of the search bar.
     * When provided, a close button will be displayed.
     */
    onClose: PropTypes.func,

    /**
     * Should focus on Search bar.
     */
    autoFocus: PropTypes.bool,

    /**
     * Optional children elements to include in the search bar.
     */
    children: PropTypes.node,
};
