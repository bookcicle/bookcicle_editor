import {ThemeProvider} from "@mui/material/styles";
import {useThemeDetector} from "./src/hooks/useThemeDetector.jsx";
import darkTheme from "./src/themes/darkTheme.js";
import lightTheme from "./src/themes/lightTheme.js";
import {nordLightTheme, nordDarkTheme} from "./src/themes/nordTheme.js";
import PropTypes from "prop-types";
import {useContext} from "react";
import {AppContext} from "./src/AppContext.jsx";
import abyssTheme from "./src/themes/abyssTheme.js";
import oceanTheme from "./src/themes/oceanTheme.js";
import spaceTheme from "./src/themes/spaceTheme.js";

const BookcicleThemeProvider = ({children}) => {
    const isDarkTheme = useThemeDetector();
    const {state} = useContext(AppContext);

    let theme;

    switch (state.appSettings.theme) {
        case 'abyss':
            theme = abyssTheme
            break;
        case 'defaultDark':
            theme = darkTheme;
            break;

        case 'defaultLight':
            theme = lightTheme;
            break;

        case 'nordDark':
            theme = nordDarkTheme;
            break;

        case 'nordLight':
            theme = nordLightTheme;
            break;

        case 'ocean':
            theme = oceanTheme;
            break;

        case 'space':
            theme = spaceTheme;
            break

        case 'system':
            theme = isDarkTheme ? darkTheme : lightTheme;
            break;

        default:
            theme = lightTheme;
            break;
    }

    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};


BookcicleThemeProvider.propTypes = {
    children: PropTypes.node
};

export default BookcicleThemeProvider;
