import { createTheme } from '@mui/material/styles';

// Define your custom Abyss colors
const abyssColors = {
  background: '#1B1E2B',
  foreground: '#6688CC',
  primary: '#81A2BE',
  secondary: '#5E8D87',
  error: '#AF4242',
  success: '#A3BE8C',
  warning: '#DFAF8F',
  info: '#B294BB',
  editorBackground: '#000C18',
  editorForeground: '#6688CC',
  cursorColor: '#DDBB88',
};

const abyssTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: abyssColors.primary,
      contrastText: abyssColors.foreground,
    },
    secondary: {
      main: abyssColors.secondary,
      contrastText: abyssColors.foreground,
    },
    background: {
      default: abyssColors.background,
      paper: abyssColors.editorBackground,
    },
    text: {
      primary: abyssColors.foreground,
      secondary: abyssColors.editorForeground,
    },
    error: {
      main: abyssColors.error,
    },
    warning: {
      main: abyssColors.warning,
    },
    info: {
      main: abyssColors.info,
    },
    success: {
      main: abyssColors.success,
    },
    divider: abyssColors.foreground,
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    body1: {
      color: abyssColors.foreground,
    },
    body2: {
      color: abyssColors.editorForeground,
    },
    h1: {
      color: abyssColors.foreground,
    },
    h2: {
      color: abyssColors.foreground,
    },
    h3: {
      color: abyssColors.foreground,
    },
    h4: {
      color: abyssColors.foreground,
    },
    h5: {
      color: abyssColors.foreground,
    },
    h6: {
      color: abyssColors.foreground,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: abyssColors.foreground,
          '&:hover': {
            backgroundColor: abyssColors.primary,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: abyssColors.background,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: abyssColors.foreground,
          '&:hover': {
            backgroundColor: abyssColors.primary,
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: abyssColors.primary,
          color: abyssColors.foreground,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: abyssColors.editorBackground,
          '& .MuiInputBase-root': {
            color: abyssColors.foreground,
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: abyssColors.foreground,
            },
            '&:hover fieldset': {
              borderColor: abyssColors.primary,
            },
          },
        },
      },
    },
  },
});

export default abyssTheme;