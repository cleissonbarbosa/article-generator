/**
 * External dependencies.
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies.
 */
import { contextsEndpoint } from './endpoint';
import { AnyAction } from 'redux';

interface IAction extends AnyAction {
	path?: string;
	payload: {
		id: number;
	};
}

const controls = {
	FETCH_FROM_API( action: IAction ) {
		return apiFetch( { path: action.path } );
	},

	FETCH_FROM_API_UNPARSED( action: IAction ) {
		return apiFetch( { path: action.path, parse: false } ).then(
			( response: { headers: object; json: any } ) =>
				Promise.all( [ response.headers, response.json() ] ).then(
					( [ headers, data ] ) => ( { headers, data } )
				)
		);
	},

	CREATE_CONTEXTS( action: IAction ) {
		console.log( action );
		return apiFetch( {
			path: contextsEndpoint,
			method: 'POST',
			data: action.payload,
		} );
	},

	UPDATE_CONTEXTS( action: IAction ) {
		const path = contextsEndpoint + '/' + action.payload.id;
		return apiFetch( { path, method: 'PUT', data: action.payload } );
	},

	DELETE_CONTEXTS( action: IAction ) {
		const path = contextsEndpoint;
		return apiFetch( { path, method: 'DELETE', data: action.payload } );
	},
};

export default controls;
