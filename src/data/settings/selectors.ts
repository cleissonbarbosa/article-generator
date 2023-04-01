/**
 * Internal dependencies.
 */

import { ISettings } from '../../interfaces';

const selectors = {
    getSettings(state: ISettings) {
        const { settings } = state;

        return settings;
    },

    getSettingDetail(state: ISettings) {
        const { setting } = state;

        return setting;
    },

    getSettingsSaving(state: ISettings) {
        const { settingsSaving } = state;

        return settingsSaving;
    },

    getLoadingSettings(state: ISettings) {
        const { loadingSettings } = state;

        return loadingSettings;
    },


    getForm(state: ISettings) {
        const { form } = state;

        return form;
    },
};

export default selectors;
