import { createTheme } from '@mui/material/styles';

// Define your custom Space colors
const spaceColors = {
    background: '#1B2240',
    foreground: '#EFEDF1',
    primary: '#AD9BF6',
    secondary: '#C792EA',
    error: '#F07178',
    success: '#C3E88D',
    warning: '#FFCB6B',
    info: '#82AAFF',
    editorBackground: '#292F4D',
    editorForeground: '#EFEDF1',
    cursorColor: '#82AAFF',
    disabled: '#5A6270',
};

const spaceTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: spaceColors.primary,
            contrastText: spaceColors.foreground,
        },
        secondary: {
            main: spaceColors.secondary,
            contrastText: spaceColors.foreground,
        },
        background: {
            default: spaceColors.background,
            paper: spaceColors.editorBackground,
        },
        text: {
            primary: spaceColors.foreground,
            secondary: spaceColors.editorForeground,
        },
        error: {
            main: spaceColors.error,
        },
        warning: {
            main: spaceColors.warning,
        },
        info: {
            main: spaceColors.info,
        },
        success: {
            main: spaceColors.success,
        },
        divider: spaceColors.disabled,
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
        body1: {
            color: spaceColors.foreground,
        },
        body2: {
            color: spaceColors.editorForeground,
        },
        h1: {
            color: spaceColors.foreground,
        },
        h2: {
            color: spaceColors.foreground,
        },
        h3: {
            color: spaceColors.foreground,
        },
        h4: {
            color: spaceColors.foreground,
        },
        h5: {
            color: spaceColors.foreground,
        },
        h6: {
            color: spaceColors.foreground,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    color: spaceColors.foreground,
                    '&:hover': {
                        backgroundColor: spaceColors.primary,
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: spaceColors.background,
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    color: spaceColors.foreground,
                    '&:hover': {
                        backgroundColor: spaceColors.primary,
                    },
                },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    backgroundColor: spaceColors.primary,
                    color: spaceColors.foreground,
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    backgroundColor: spaceColors.editorBackground,
                    '& .MuiInputBase-root': {
                        color: spaceColors.foreground,
                    },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: spaceColors.foreground,
                        },
                        '&:hover fieldset': {
                            borderColor: spaceColors.primary,
                        },
                    },
                },
            },
        },
    },
});

export default spaceTheme;