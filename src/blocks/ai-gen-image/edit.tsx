/**
 * External dependencies.
 */
import { parse } from '@wordpress/blocks';
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
import saveImageToWordPressLibrary from '../../utils/SaveImgToLibrary';
import SwitchCheckbox from '../../components/inputs/SwitchCheckbox';
import { dispatch, select } from '@wordpress/data';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 * @return {WPElement} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
	const { prompt, sizesAvailable, sizeValue, toggleSaveImg } = attributes;
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
			} );
		}
	} );

	async function GenerateIMG(
		prompt: string,
		size: CreateImageRequestSizeEnum
	) {
		setLoading( true );

		if ( ! prompt ) {
			setLoading( false );
			throw new Error( 'Bad request - prompt empty' );
		}

		if ( size && ! /^\d{3,4}x\d{3,4}$/.test( size ) ) {
			setLoading( false );
			throw new Error( 'Bad request - size incorrect format' );
		}

		try {
			const imgURL = await createImage(
				prompt,
				size,
				toggleSaveImg ? 'base64' : 'url'
			);
			
			if ( ! toggleSaveImg ) {
				const blocks = parse( `
					<!-- wp:image {"sizeSlug":"large"} -->
						<figure class="wp-block-image size-large"><img src="${ imgURL }" alt="${ prompt }"/></figure>
					<!-- /wp:image -->
				` );
				dispatch( 'core/block-editor' ).replaceBlock(
					select( 'core/block-editor' ).getSelectedBlockClientId() ?? '',
					blocks
				);
				return;
			}

			Swal.fire( {
				title: __( 'Saving image on library', 'article-gen' ),
				text: __( 'Wait...', 'article-gen' ),
				icon: 'info',
				position: 'center',
				showConfirmButton: false,
				showLoaderOnConfirm: true,
			} );
			saveImageToWordPressLibrary( imgURL, prompt )
				.then( ( data ) => {
					Swal.fire( {
						title: __( 'Success!', 'article-gen' ),
						text: __(
							'The image has been saved in the wordpress library 🎉',
							'article-gen'
						),
						icon: 'success',
						position: 'center',
						showConfirmButton: true,
					} );
					const blocks = parse( `
							<!-- wp:image {"id":${ data.id },"sizeSlug":"full","linkDestination":"none"} -->
								<figure class="wp-block-image size-full"><img src="${ data.source_url }" alt="${ prompt }"/></figure>
							<!-- /wp:image -->
						` );
					dispatch( 'core/block-editor' ).replaceBlock(
						select( 'core/block-editor' ).getSelectedBlockClientId() ?? '',
						blocks
					);
				} )
				.catch( ( e ) => {
					console.log( e );
					Swal.fire( {
						title: __( 'Error!', 'article-gen' ),
						text: __(
							'Error saving image in wordpress library ☹️',
							'article-gen'
						),
						icon: 'error',
						position: 'center',
						showConfirmButton: true,
						showDenyButton: true,
						confirmButtonText: __( 'Try again?', 'article-gen' ),
						preConfirm: () => {
							GenerateIMG( prompt, size );
						},
					} );
				} );
		} catch ( e ) {
			throw new Error( 'Bad request' );
		} finally {
			setLoading( false );
			Swal.close();
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

			<div className="md:flex gap-5 md:items-center">
				<div className="md:w-1/2">
					<Select2Input
						options={ [ ...sizesAvailable ] }
						placeholder={ __( 'Select image size', 'article-gen' ) }
						defaultValue={ sizeValue }
						onChange={ ( input ) =>
							setAttributes( { sizeValue: input.value } )
						}
					/>
				</div>
				<div className="md:w-1/2 sm:mt-5 md:mt-0">
					<label className="flex gap-5 justify-center items-center">
						{ __( 'Save image to library?', 'article-gen' ) }
						<SwitchCheckbox
							customClass="flex"
							enabled={ toggleSaveImg }
							setEnabled={ ( action ) =>
								setAttributes( { toggleSaveImg: action } )
							}
						/>
					</label>
				</div>
			</div>

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
				onClick={ async () => {
					try {
						await GenerateIMG( prompt, sizeValue );
					} catch ( e: any ) {
						Swal.fire( {
							title: __( 'Error', 'article-gen' ),
							text: e.message,
							icon: 'error',
							toast: true,
							position: 'bottom',
							showConfirmButton: false,
							showCloseButton: true,
						} );
					}
				} }
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
