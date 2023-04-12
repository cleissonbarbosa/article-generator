import apiFetch from '@wordpress/api-fetch';
import { v4 as uuidv4 } from 'uuid';
import stringToSlug from './strToSlug';

/**
 * save image to wp library based on base64
 *
 * @export
 * @async
 * @param {string} imageBase64
 * @returns {Promise<any>}
 */
export default async function saveImageToWordPressLibrary(
	imageBase64: string,
	prompt?: string
): Promise< unknown > {
	return new Promise( async ( resolve, reject ) => {
		try {
			const contentType = 'image/png'; // definir o tipo de conteúdo como PNG

			// Gerar um UUID para o nome do arquivo
			const uuid = uuidv4();

			const filename = prompt ? stringToSlug( prompt ) || uuid : uuid;

			// Enviar a imagem para a API REST do WordPress
			const data = await apiFetch( {
				path: '/wp/v2/media',
				method: 'POST',
				body: b64toBlob( imageBase64, contentType ),
				headers: {
					'Content-Disposition': `attachment; filename="${ filename }.png"`,
					'Content-Type': contentType,
				},
			} );
			resolve( data );
		} catch ( error ) {
			reject( error );
		}
	} );
}

/**
 * base64 to blob
 *
 * @param {string} b64Data
 * @param {string} [contentType='']
 * @param {number} [sliceSize=512]
 * @returns {*}
 */
const b64toBlob = ( b64Data: string, contentType = '', sliceSize = 512 ) => {
	const byteCharacters = atob( b64Data );
	const byteArrays = [];

	for (
		let offset = 0;
		offset < byteCharacters.length;
		offset += sliceSize
	) {
		const slice = byteCharacters.slice( offset, offset + sliceSize );

		const byteNumbers = new Array( slice.length );
		for ( let i = 0; i < slice.length; i++ ) {
			byteNumbers[ i ] = slice.charCodeAt( i );
		}

		const byteArray = new Uint8Array( byteNumbers );
		byteArrays.push( byteArray );
	}

	const blob = new Blob( byteArrays, { type: contentType } );
	return blob;
};
