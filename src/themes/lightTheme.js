import { createTheme } from '@mui/material/styles';

// Light Theme Colors
const lightColors = {
  primary: '#16677C',
  onPrimary: '#FFFFFF',
  primaryContainer: '#65AAC1',
  onPrimaryContainer: '#00171E',
  secondary: '#4A626B',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#D1EBF6',
  onSecondaryContainer: '#364E57',
  background: '#F8FAFB',
  onBackground: '#191C1E',
  surface: '#F8FAFB',
  onSurface: '#191C1E',
  surfaceVariant: '#DBE4E8',
  onSurfaceVariant: '#3F484C',
  error: '#BA1A1A',
  onError: '#FFFFFF',
  outline: '#70787C',
  outlineVariant: '#BFC8CC',
  inverseSurface: '#2E3132',
  inverseOnSurface: '#EFF1F3',
  inversePrimary: '#8CD0E9',
};

// Create the light theme
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: lightColors.primary,
      contrastText: lightColors.onPrimary,
    },
    secondary: {
      main: lightColors.secondary,
      contrastText: lightColors.onSecondary,
    },
    background: {
      default: lightColors.background,
      paper: lightColors.surface,
    },
    text: {
      primary: lightColors.onBackground,
      secondary: lightColors.onSurface,
    },
    error: {
      main: lightColors.error,
      contrastText: lightColors.onError,
    },
    divider: lightColors.outline,
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    body1: {
      color: lightColors.onBackground,
    },
    h1: {
      color: lightColors.primary,
    },
    h2: {
      color: lightColors.primary,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: lightColors.onPrimary,
          backgroundColor: lightColors.primary,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: lightColors.primary,
        },
      },
    },
  },
});

export default lightTheme;