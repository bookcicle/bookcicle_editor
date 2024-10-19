// themes.js

import { createTheme } from '@mui/material/styles';

// Nord Color Definitions
const nordColors = {
    // Polar Night
    nord0: '#2E3440', // Primary Dark Background
    nord1: '#3B4252', // Secondary Background
    nord2: '#434C5E', // Borders, Dividers
    nord3: '#4C566A', // Lighter Elements

    // Snow Storm
    nord4: '#D8DEE9', // Foreground
    nord5: '#E5E9F0',
    nord6: '#ECEFF4',

    // Frost
    nord7: '#8FBCBB',
    nord8: '#88C0D0',
    nord9: '#81A1C1',
    nord10: '#5E81AC',

    // Aurora
    nord11: '#BF616A',
    nord12: '#D08770',
    nord13: '#EBCB8B',
    nord14: '#A3BE8C',
    nord15: '#B48EAD',
};

// Nord Light Theme
const nordLightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: nordColors.nord9, // Frost9
            contrastText: nordColors.nord6, // Snow Storm6
        },
        secondary: {
            main: nordColors.nord8, // Frost8
            contrastText: nordColors.nord6,
        },
        error: {
            main: nordColors.nord11, // Aurora11
        },
        warning: {
            main: nordColors.nord12, // Aurora12
        },
        info: {
            main: nordColors.nord10, // Frost10
        },
        success: {
            main: nordColors.nord14, // Aurora14
        },
        background: {
            default: nordColors.nord6, // Snow Storm6
            paper: nordColors.nord5,   // Snow Storm5
        },
        text: {
            primary: nordColors.nord0, // Polar Night0
            secondary: nordColors.nord2, // Polar Night2
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: nordColors.nord1, // Secondary Background
                    color: nordColors.nord4, // Foreground
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: nordColors.nord1,
                    color: nordColors.nord4,
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: nordColors.nord5,
                    color: nordColors.nord0,
                },
            },
        },
        MuiTypography: {
            styleOverrides: {
                root: {
                    color: nordColors.nord0,
                },
            },
        },
        // Add more component customizations as needed
    },
});

// Corrected Nord Dark Theme using Polar Night
const nordDarkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: nordColors.nord8, // Frost8
            contrastText: nordColors.nord4, // Snow Storm4
        },
        secondary: {
            main: nordColors.nord7, // Frost7
            contrastText: nordColors.nord4,
        },
        error: {
            main: nordColors.nord11, // Aurora11
        },
        warning: {
            main: nordColors.nord12, // Aurora12
        },
        info: {
            main: nordColors.nord10, // Frost10
        },
        success: {
            main: nordColors.nord14, // Aurora14
        },
        background: {
            default: nordColors.nord0, // Polar Night0 (darkest background)
            paper: nordColors.nord1,   // Polar Night1 (secondary background)
        },
        text: {
            primary: nordColors.nord4, // Snow Storm4 (light text on dark background)
            secondary: nordColors.nord6, // Snow Storm6
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    backgroundColor: nordColors.nord8, // Frost8
                    color: nordColors.nord4, // Snow Storm4
                    '&:hover': {
                        backgroundColor: nordColors.nord8,
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: nordColors.nord0, // Polar Night0
                    color: nordColors.nord4, // Snow Storm4
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: nordColors.nord0,
                    color: nordColors.nord4,
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: nordColors.nord1,
                    color: nordColors.nord4,
                },
            },
        },
        MuiTypography: {
            styleOverrides: {
                root: {
                    color: nordColors.nord4,
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiInputBase-root': {
                        color: nordColors.nord4,
                    },
                    '& .MuiInputBase-input': {
                        backgroundColor: nordColors.nord1,
                    },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: nordColors.nord2,
                        },
                        '&:hover fieldset': {
                            borderColor: nordColors.nord3,
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: nordColors.nord8,
                        },
                    },
                },
            },
        },
        MuiSwitch: {
            styleOverrides: {
                switchBase: {
                    color: nordColors.nord2,
                    '&.Mui-checked': {
                        color: nordColors.nord8,
                    },
                    '&.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: nordColors.nord8,
                    },
                },
                track: {
                    backgroundColor: nordColors.nord2,
                },
            },
        },
        // Add more component customizations here
    },
});


// Export all themes
export { nordLightTheme, nordDarkTheme };