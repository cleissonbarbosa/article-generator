/**
 * External dependencies.
 */
import { register } from '@wordpress/data';

/**
 * Internal dependencies.
 */
import JobStore from './jobs';
import SettingStore from './settings';

/**
 * Register stores.
 */
register(JobStore);
register(SettingStore);
