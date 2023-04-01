/**
 * External dependencies.
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies.
 */
import { settingsEndpoint } from './endpoint';

const controls = {
    FETCH_FROM_API(action) {
        return apiFetch({ path: action.path });
    },

    FETCH_FROM_API_UNPARSED(action: { path: any }) {
        return apiFetch({ path: action.path, parse: false }).then(
            (response: { headers: object; json: any }) =>
                Promise.all([response.headers, response.json()]).then(
                    ([headers, data]) => ({ headers, data })
                )
        );
    },

    CREATE_SETTINGS(action) {
        return apiFetch({
            path: settingsEndpoint,
            method: 'POST',
            data: action.payload,
        });
    },

    UPDATE_SETTINGS(action) {
        const path = settingsEndpoint;
        return apiFetch({ path, method: 'PUT', data: action.payload });
    },
};

export default controls;
