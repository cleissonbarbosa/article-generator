import { CreateImageRequestSizeEnum } from 'openai';
import { getOpenAi } from './OpenAi';
import { __ } from '@wordpress/i18n';

export async function createImage(
	prompt: string,
	size: CreateImageRequestSizeEnum | null = null
): Promise< string > {
	if ( prompt.trim().length === 0 ) {
		throw new Error( __( 'Please enter a valid prompt', 'article-gen' ) );
	}

	try {
		const result = await (
			await getOpenAi()
		 ).createImage( {
			prompt: generateImagePrompt( prompt ),
			n: 1,
			size: size ?? '1024x1024',
		} );
		return new Promise( ( resolve ) =>
			resolve( result.data.data[ 0 ].url as string )
		);
	} catch ( error: any ) {
		// Consider adjusting the error handling logic for your use case
		if ( error.response ) {
			console.error( error.response.status, error.response.data );
			throw new Error( error.response.data );
		} else {
			console.error(
				`Error with OpenAI API request: ${ error.message }`
			);
			throw new Error(
				__( 'An error occurred during your request.', 'article-gen' )
			);
		}
	}
}

export function generateImagePrompt( input: string ): string {
	const capitalizedPrompt =
		input[ 0 ].toUpperCase() + input.slice( 1 ).toLowerCase();
	return `${ capitalizedPrompt }`;
}
