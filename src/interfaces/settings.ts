/**
 * Internal dependencies.
 */
import { ISelect2Input } from '../components/inputs/Select2Input';

export interface ISetting {
	/**
	 * Context title.
	 */
	key: string;

	/**
	 * setting value.
	 */
	value: string;
}

export interface ISettingFormData extends Array< ISetting > {}

export interface ISettings {
	/**
	 * All contexts as array of IContext.
	 */
	settings: Array< ISettings >;

	/**
	 * Context detail.
	 */
	setting: ISetting;

	/**
	 * Context saving or not.
	 */
	settingsSaving: boolean;

	/**
	 * Context deleting or not.
	 */
	settingsDeleting: boolean;

	/**
	 * All context types as array of {label, value}.
	 */
	settingTypes: Array< ISelect2Input >;

	/**
	 * Is contexts loading.
	 */
	loadingSettings: boolean;

	/**
	 * Context Form data.
	 */
	form: ISettingFormData;
}
