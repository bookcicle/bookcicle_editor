// application.js

export const INITIAL_STATE = {
    appSettings: localStorage.getItem('appSettingsStorage')
        ? JSON.parse(localStorage.getItem('appSettingsStorage'))
        : {
            theme: "space",
            quillTheme: "snow"
        },

};

export const ACTIONS = {
    UPDATE_APP_SETTINGS: 'UPDATE_APP_SETTINGS',
    RESET_APP_SETTINGS: 'RESET_APP_SETTINGS',
    // Add more actions as needed
};

export const reducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.UPDATE_APP_SETTINGS:
            { const updatedSettings = {
                ...state.appSettings,
                ...action.payload,
            };
            // Persist updated settings to localStorage
            localStorage.setItem('appSettingsStorage', JSON.stringify(updatedSettings));
            return {
                ...state,
                appSettings: updatedSettings,
            }; }

        case ACTIONS.RESET_APP_SETTINGS:
            localStorage.removeItem('appSettingsStorage');
            return {
                ...state,
                appSettings: {},
            };

        default:
            return state;
    }
};