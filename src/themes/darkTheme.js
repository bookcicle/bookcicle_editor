import { createTheme } from '@mui/material/styles';

// Dark Theme Colors
const darkColors = {
  primary: '#8CD0E9',
  onPrimary: '#003543',
  primaryContainer: '#357D93',
  onPrimaryContainer: '#FFFFFF',
  secondary: '#B1CBD5',
  onSecondary: '#1B343C',
  secondaryContainer: '#294149',
  onSecondaryContainer: '#BBD5E0',
  background: '#101415',
  onBackground: '#E1E3E4',
  surface: '#101415',
  onSurface: '#E1E3E4',
  surfaceVariant: '#3F484C',
  onSurfaceVariant: '#BFC8CC',
  error: '#FFB4AB',
  onError: '#690005',
  outline: '#899296',
  inverseSurface: '#E1E3E4',
  inverseOnSurface: '#2E3132',
  inversePrimary: '#16677C',
};

// Create the dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: darkColors.primary,
      contrastText: darkColors.onPrimary,
    },
    secondary: {
      main: darkColors.secondary,
      contrastText: darkColors.onSecondary,
    },
    background: {
      default: darkColors.background,
      paper: darkColors.surface,
    },
    text: {
      primary: darkColors.onBackground,
      secondary: darkColors.onSurface,
    },
    error: {
      main: darkColors.error,
      contrastText: darkColors.onError,
    },
    divider: darkColors.outline,
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    body1: {
      color: darkColors.onBackground,
    },
    h1: {
      color: darkColors.primary,
    },
    h2: {
      color: darkColors.primary,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: darkColors.onPrimary,
          backgroundColor: darkColors.primary,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: darkColors.primary,
        },
      },
    },
  },
});

export default darkTheme;