/**
 * Internal dependencies.
 */
import { ISelect2Input } from '../components/inputs/Select2Input';

export interface ISetting {

    /**
     * Job title.
     */
    key: string;

    /**
     * setting value.
     */
    value: string;
}

export interface ISettingFormData extends Array<ISetting> {
    
}

export interface ISettings {
    /**
     * All jobs as array of IJob.
     */
    settings: Array<ISettings>;

    /**
     * Job detail.
     */
    setting: ISetting;

    /**
     * Job saving or not.
     */
    settingsSaving: boolean;

    /**
     * Job deleting or not.
     */
    settingsDeleting: boolean;

    /**
     * All job types as array of {label, value}.
     */
    settingTypes: Array<ISelect2Input>;

    /**
     * Is jobs loading.
     */
    loadingSettings: boolean;

    /**
     * Job Form data.
     */
    form: ISettingFormData;
}