import { createTheme } from '@mui/material/styles';

// Define your custom Ocean colors
const oceanColors = {
    background: '#0F111A',
    foreground: '#E5E9F0',
    primary: '#81A1C1',
    secondary: '#88C0D0',
    error: '#BF616A',
    success: '#A3BE8C',
    warning: '#EBCB8B',
    info: '#B48EAD',
    editorBackground: '#0F111A',
    editorForeground: '#E5E9F0',
    cursorColor: '#D8DEE9',
    disabled: '#4C566A',
};

const oceanTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: oceanColors.primary,
            contrastText: oceanColors.foreground,
        },
        secondary: {
            main: oceanColors.secondary,
            contrastText: oceanColors.foreground,
        },
        background: {
            default: oceanColors.background,
            paper: oceanColors.editorBackground,
        },
        text: {
            primary: oceanColors.foreground,
            secondary: oceanColors.editorForeground,
        },
        error: {
            main: oceanColors.error,
        },
        warning: {
            main: oceanColors.warning,
        },
        info: {
            main: oceanColors.info,
        },
        success: {
            main: oceanColors.success,
        },
        divider: oceanColors.disabled,
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
        body1: {
            color: oceanColors.foreground,
        },
        body2: {
            color: oceanColors.editorForeground,
        },
        h1: {
            color: oceanColors.foreground,
        },
        h2: {
            color: oceanColors.foreground,
        },
        h3: {
            color: oceanColors.foreground,
        },
        h4: {
            color: oceanColors.foreground,
        },
        h5: {
            color: oceanColors.foreground,
        },
        h6: {
            color: oceanColors.foreground,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    color: oceanColors.foreground,
                    '&:hover': {
                        backgroundColor: oceanColors.primary,
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: oceanColors.background,
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    color: oceanColors.foreground,
                    '&:hover': {
                        backgroundColor: oceanColors.primary,
                    },
                },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    backgroundColor: oceanColors.primary,
                    color: oceanColors.foreground,
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    backgroundColor: oceanColors.editorBackground,
                    '& .MuiInputBase-root': {
                        color: oceanColors.foreground,
                    },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: oceanColors.foreground,
                        },
                        '&:hover fieldset': {
                            borderColor: oceanColors.primary,
                        },
                    },
                },
            },
        },
    },
});

export default oceanTheme;