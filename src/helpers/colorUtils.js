import { darken, lighten } from '@mui/system';

/**
 * Adjust color based on theme type (lighten for light theme, darken for dark theme)
 * @param {string} color - The base color
 * @param {object} theme - The MUI theme
 * @param {number} amount - The intensity of the lightening/darkening
 * @returns {string} - Adjusted color
 */
export const adjustColorForTheme = (color, theme, amount = 0.2) => {
    if (theme.palette.mode === 'dark') {
        return lighten(color, amount);
    } else {
        return darken(color, amount);
    }
};

/**
 * Generate active color by further darkening/lightening the base highlight color
 * @param {string} color - The base highlight color
 * @param {object} theme - The MUI theme
 * @param {number} amount - The intensity of the adjustment
 * @returns {string} - Adjusted active color
 */
export const generateActiveColor = (color, theme, amount = 12) => {
    return darken(color, amount);
};
