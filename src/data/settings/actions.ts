/**
 * Internal dependencies.
 */
import * as Types from './types';
import { settingDefaultFormData } from './default-state';
import { ISetting, ISettingFormData, ISettings } from '../../interfaces/settings';
import { IResponseGenerator } from '../../interfaces';

const actions = {
    setSettings(settings: Array<ISetting>) {
        return {
            type: Types.GET_SETTINGS,
            settings,
        };
    },

    setFormData(form: ISettingFormData) {
        return {
            type: Types.SET_SETTING_FORM_DATA,
            form,
        };
    },

    setLoadingSettings(loadingSettings: boolean) {
        return {
            type: Types.SET_LOADING_SETTINGS,
            loadingSettings,
        };
    },

    setSavingSettings(settingsSaving: boolean) {
        return {
            type: Types.SET_SETTINGS_SAVING,
            settingsSaving,
        };
    },

    *saveSetting(payload: ISettingFormData) {
        yield actions.setSavingSettings(true);

        try {
            let response: IResponseGenerator = {};
            console.log(payload)
            response = yield {
                type: Types.UPDATE_SETTINGS,
                payload,
            };
            console.log('response', response)

            if (response) {
                yield actions.setFormData({ ...settingDefaultFormData });
                yield actions.setSavingSettings(false);
            }
        } catch (error) {
            console.log('error', error)
            yield actions.setSavingSettings(false);
        }
    },

    fetchFromAPI(path: string) {
        return {
            type: Types.FETCH_FROM_API,
            path,
        };
    },

    fetchFromAPIUnparsed(path: string) {
        return {
            type: Types.FETCH_FROM_API_UNPARSED,
            path,
        };
    },
};

export default actions;
