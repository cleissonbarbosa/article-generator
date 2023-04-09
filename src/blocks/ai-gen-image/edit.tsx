/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import Swal from 'sweetalert2';
import { CreateImageRequestSizeEnum } from 'openai';
import { useState, useEffect } from '@wordpress/element';
import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { faImage } from '@fortawesome/free-solid-svg-icons';
/**
 * Internal dependencies.
 */
import './editor.scss';
import Button from '../../components/button/Button';
import { createImage } from '../../integrations/openai/createImage';
import Select2Input from '../../components/inputs/Select2Input';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 * @return {WPElement} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
	const { prompt, sizesAvailable, sizeValue } = attributes;
	const [ loading, setLoading ] = useState< boolean >( false );
	useEffect( () => {
		if ( loading ) {
			Swal.fire( {
				title: __( 'Wait...', 'article-gen' ),
				text: __( `Creating your image`, 'article-gen' ),
				icon: 'info',
				toast: true,
				position: 'center',
				showConfirmButton: false,
				timer: 3000,
			} );
		}
	} );

	async function GenerateIMG(
		prompt: string,
		size: CreateImageRequestSizeEnum
	): Promise< string > {
		Swal.fire( {
			title: __( 'Under development', 'article-gen' ),
			text: __(
				'Feature under development, will be available soon',
				'article-gen'
			),
			icon: 'warning',
			toast: true,
			position: 'center',
			showConfirmButton: false,
			timer: 3000,
		} );
		return '';

		// Todo: implement this later.
		if ( ! prompt ) {
			throw new Error( 'Bad request - prompt empty' );
		}

		if ( size && ! /^\d{3,4}x\d{3,4}$/.test( size ) ) {
			throw new Error( 'Bad request - size incorrect format' );
		}

		try {
			return await createImage( prompt, size );
		} catch ( e ) {
			throw new Error( 'Bad request' );
		}
	}
	return (
		<div
			{ ...useBlockProps() }
			style={ {
				background: '#f5f5f5',
				padding: `20px 20px 20px 20px`,
				borderRadius: 10,
			} }
		>
			<RichText
				className="wp-block-article-generator-prompt"
				tagName="h4"
				placeholder={ __(
					'Describe the image you want to generate',
					'article-gen'
				) }
				value={ prompt }
				onChange={ ( prompt: string ) => setAttributes( { prompt } ) }
				required
			/>

			<Select2Input
				options={ [ ...sizesAvailable ] }
				placeholder={ __( 'Select image size', 'article-gen' ) }
				defaultValue={ sizeValue }
				onChange={ ( input ) =>
					setAttributes( { sizeValue: input.value } )
				}
			/>

			<Button
				text={
					loading
						? __( 'Generating image...', 'article-gen' )
						: __( 'Generate image', 'article-gen' )
				}
				buttonCustomClass="img-gen-btn"
				disabled={ loading }
				iconCustomClass="btn-icon"
				type="primary"
				icon={ faImage }
				onClick={ () => GenerateIMG( prompt, sizeValue ) }
			/>

			<InspectorControls>
				<PanelBody
					title={ __( 'Settings', 'article-gen' ) }
					initialOpen={ false }
				></PanelBody>
			</InspectorControls>
		</div>
	);
}
