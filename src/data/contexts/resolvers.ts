/**
 * Internal dependencies.
 */
import actions from './actions';
import { contextsEndpoint } from './endpoint';
import { IContextFilter, IResponseGenerator } from '../../interfaces';
import { prepareContextDataForDatabase } from './utils';

const resolvers = {
	*getContexts( filters: IContextFilter ) {
		if ( filters === undefined ) {
			filters = {};
		}

		const queryParam = new URLSearchParams(
			filters as URLSearchParams
		).toString();

		const response: IResponseGenerator = yield actions.fetchFromAPIUnparsed(
			`${ contextsEndpoint }?${ queryParam }`
		);
		let totalPage = 0;
		let totalCount = 0;

		if ( response.headers !== undefined ) {
			totalPage = response.headers.get( 'X-WP-TotalPages' );
			totalCount = response.headers.get( 'X-WP-Total' );
		}

		yield actions.setContexts( response.data );
		yield actions.setTotalPage( totalPage );
		yield actions.setTotal( totalCount );
		return actions.setLoadingContexts( false );
	},

	*getContextDetail( id: number ) {
		yield actions.setLoadingContexts( true );
		const path = `${ contextsEndpoint }/${ id }`;
		const response = yield actions.fetchFromAPI( path );

		if ( response.id ) {
			const data = prepareContextDataForDatabase( response );

			yield actions.setFormData( data );
		}

		return actions.setLoadingContexts( false );
	},
};

export default resolvers;
