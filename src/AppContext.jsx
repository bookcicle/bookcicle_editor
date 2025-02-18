// AppContext.js

import {createContext, useReducer} from 'react';
import {INITIAL_STATE, reducer} from './application';
import PropTypes from "prop-types"; // Adjust path if necessary

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext({
    state: INITIAL_STATE
})

export const AppProvider = ({children}) => {
    const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

    return (<AppContext.Provider value={{state, dispatch}}>
        {children}
    </AppContext.Provider>);
};

AppProvider.propTypes = {
    children: PropTypes.node
};

export default AppProvider


