import { Configuration } from 'openai';
import controls from '../../data/settings/controls';
import { settingsEndpoint } from '../../data/settings/endpoint';
import { ISetting } from '../../interfaces';

export default async function openAiSettings(): Promise< Configuration > {
	const settings = ( await controls.FETCH_FROM_API( {
		path: `${ settingsEndpoint }`,
	} ) ) as ISetting[];
	const apiKey =
		settings.filter( ( e ) => e.key === 'openai-api-key' )[ 0 ] || {};
	const organizationID =
		settings.filter( ( e ) => e.key === 'openai-organization-id' )[ 0 ] ||
		{};

	if ( ! apiKey?.value && ! organizationID?.value ) {
		throw new Error( 'OpenAI API key not configured' );
	}

	return new Configuration( {
		apiKey: apiKey.value,
		organization: organizationID.value,
	} );
}
