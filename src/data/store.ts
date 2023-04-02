/**
 * External dependencies.
 */
import { register } from '@wordpress/data';

/**
 * Internal dependencies.
 */
import ContextStore from './contexts';
import SettingStore from './settings';

/**
 * Register stores.
 */
register(ContextStore);
register(SettingStore);
