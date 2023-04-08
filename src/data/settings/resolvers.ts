/**
 * Internal dependencies.
 */
import actions from './actions';
import { settingsEndpoint } from './endpoint';
import { IResponseGenerator, ISetting } from '../../interfaces';
import { prepareSettingDataForDatabase } from './utils';

const resolvers = {
	*getSettings() {
		const response: IResponseGenerator = yield actions.fetchFromAPIUnparsed(
			`${ settingsEndpoint }`
		);

		let totalPage = 0;
		let totalCount = 0;

		if ( response.headers !== undefined ) {
			totalPage = response.headers.get( 'X-WP-TotalPages' );
			totalCount = response.headers.get( 'X-WP-Total' );
		}

		yield actions.setSettings( response.data );
		yield actions.setFormData( response.data );
		return actions.setLoadingSettings( false );
	},

	*getSettingDetail( key: string ) {
		yield actions.setLoadingSettings( true );
		const path = `${ settingsEndpoint }/${ key }`;
		const response = yield actions.fetchFromAPI( path );

		if ( response.key ) {
			const data = prepareSettingDataForDatabase( response );

			yield actions.setFormData( data );
		}

		return actions.setLoadingSettings( false );
	},
};

export default resolvers;
