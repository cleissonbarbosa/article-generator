/**
 * Internal dependencies.
 */
import { ISettings } from '../../interfaces';

export const settingDefaultFormData = {
    key: '',
    value: '',
};

export const settingDefaultState: ISettings = {
    settings: [],
    setting: {
        ...settingDefaultFormData,
    },
    settingTypes: [],
    loadingSettings: false,
    settingsSaving: false,
    settingsDeleting: false,
    form: [],
};
