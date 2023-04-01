/**
 * Internal dependencies.
 */
import * as Types from './types';
import { settingDefaultState } from './default-state';

const reducer = (state = settingDefaultState, action: any) => {
    switch (action.type) {
        case Types.GET_SETTINGS:
            return {
                ...state,
                settings: action.settings,
            };

        case Types.GET_SETTING_DETAIL:
            return {
                ...state,
                setting: action.setting,
            };

        case Types.SET_LOADING_SETTINGS:
            return {
                ...state,
                loadingSettings: action.loadingSettings,
            };

        case Types.SET_TOTAL_SETTINGS:
            return {
                ...state,
                total: action.total,
            };

        case Types.SET_TOTAL_SETTINGS_PAGE:
            return {
                ...state,
                totalPage: action.totalPage,
            };

        case Types.SET_SETTING_FORM_DATA:
            return {
                ...state,
                form: action.form,
            };

        case Types.SET_SETTINGS_SAVING:
            return {
                ...state,
                settingsSaving: action.settingsSaving,
            };
    }

    return state;
};

export default reducer;
