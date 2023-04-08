/**
 * External dependencies.
 */
import { parse } from '@wordpress/blocks';
import { __, sprintf } from '@wordpress/i18n';
import { CreateCompletionRequest } from 'openai';
import { PanelBody } from '@wordpress/components';
import Swal from 'sweetalert2';
import { useState, useEffect } from '@wordpress/element';
import { faMarker } from '@fortawesome/free-solid-svg-icons';
import { dispatch, select, useSelect } from '@wordpress/data';
import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
/**
 * Internal dependencies.
 */
import './editor.scss';
import { IContext } from '../../interfaces';
import contextStore from '../../data/contexts';
import Button from '../../components/button/Button';
import Select2Input from '../../components/inputs/Select2Input';
import SwitchCheckbox from '../../components/inputs/SwitchCheckbox';
import { IInputResponse, Input } from '../../components/inputs/Input';
import {
	IArticlePopulate,
	createArticle,
} from '../../integrations/openai/createArticle';

/**
 * Interface attributes props
 *
 * @interface IAttributesProps
 * @typedef {IAttributesProps}
 */
interface IAttributesProps {
	prompt: string;
	context: string;
	toggleContext: boolean;
	toggleCustomContext: boolean;
}

/**
 * Interface handle populate
 * @date 4/5/2023 - 4:06:14 PM
 *
 * @interface IHandlePopulate
 * @typedef {IHandlePopulate}
 */
interface IHandlePopulate {
	prompt: string;
	context: string;
	options?: Pick< CreateCompletionRequest, 'temperature' | 'max_tokens' >;
}

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 * @return {WPElement} Element to render.
 */
export default function Prompt( { attributes, setAttributes } ) {
	const { prompt, context, toggleContext, toggleCustomContext } =
		attributes as IAttributesProps;
	const [ loading, setLoading ] = useState< boolean >( false );
	const [ temperature, setTemperature ] = useState< number >( 0.6 );
	const [ maxTokens, setMaxTokens ] = useState< number >( 2048 );

	const contexts: IContext[] = useSelect(
		( select ) => select( contextStore ).getContexts(),
		[]
	);

	useEffect( () => {
		if ( loading ) {
			Swal.fire( {
				title: __( 'Wait...', 'article-gen' ),
				text: sprintf(
					__( 'Writing text about: %s', 'article-gen' ),
					prompt
				),
				icon: 'info',
				toast: true,
				position: 'center',
				showConfirmButton: false,
			} );
		}
	} );
	/**
	 * toggle contexts
	 *
	 * @param {boolean} action
	 */
	const toggleContexts = ( action: boolean ) => {
		setAttributes( {
			toggleContext: action,
			toggleCustomContext: ! action,
		} );
	};

	/**
	 * toggle custom context
	 *
	 * @param {boolean} action
	 */
	const toggleCustomContexts = ( action: boolean ) => {
		setAttributes( {
			toggleCustomContext: action,
			toggleContext: ! action,
		} );
	};

	/**
	 * Handle populate post
	 *
	 * @param {IHandlePopulate} { prompt, context, options }
	 * @param {React.Dispatch<React.SetStateAction<boolean>>} setLoading
	 */
	function handlePopulate(
		{ prompt, context, options }: IHandlePopulate,
		setLoading: React.Dispatch< React.SetStateAction< boolean > >
	) {
		setLoading( true );
		createArticle( prompt, context, options )
			.then( ( response ) => {
				Swal.close(); // close all popups

				const blocks = parse( response.content );
				dispatch( 'core/block-editor' ).removeBlock(
					select( 'core/block-editor' ).getSelectedBlockClientId() ??
						''
				);
				dispatch( 'core/block-editor' ).insertBlocks( blocks );

				// set title
				writeEffectTitle( response.title );
			} )
			.catch( ( e ) => {
				Swal.fire( {
					title: __( 'Error', 'article-gen' ),
					text: e.message,
					icon: 'error',
					toast: true,
					position: 'bottom',
					showConfirmButton: false,
					showCloseButton: true,
					footer: getAlertCustomFooter(),
				} );
			} )
			.finally( () => setLoading( false ) );
	}

	function writeEffectTitle( title: string ) {
		let current = 0;
		const titleEnd = title.length - 1;
		const titleSpeed = 10000 / title.length;

		let titleAppend = '';

		const titleInterval = setInterval( function () {
			if ( current > titleEnd ) {
				clearInterval( titleInterval );
			} else {
				titleAppend += title[ current++ ];
				dispatch( 'core/editor' ).editPost( { title: titleAppend } );
			}
		}, titleSpeed );
	}

	/**
	 * Alert custom footer
	 *
	 * @returns {string}
	 */
	function getAlertCustomFooter(): string {
		return `
      <a href="/wp-admin/admin.php?page=article-gen#/contexts">${ __(
			'Contexts',
			'article-gen'
		) }</a>
      &nbsp;-&nbsp;
      <a href="/wp-admin/admin.php?page=article-gen#/settings">${ __(
			'Settings',
			'article-gen'
		) }</a>
    `;
	}

	return (
		<div
			{ ...useBlockProps() }
			style={ {
				backgroundColor: '#ffffff',
				padding: `20px 20px 20px 20px`,
			} }
		>
			<RichText
				className="wp-block-article-generator-prompt"
				tagName="h4"
				placeholder={ __(
					'Write the subject of the article',
					'article-gen'
				) }
				value={ prompt }
				onChange={ ( prompt: string ) => setAttributes( { prompt } ) }
				required
			/>

			<div className="justify-between flex gap-5">
				<label>
					{ __( 'Enable pre written context', 'article-gen' ) }
					<SwitchCheckbox
						enabled={ toggleContext }
						setEnabled={ toggleContexts }
					/>
				</label>
				<label>
					{ __( 'Enable custom context', 'article-gen' ) }
					<SwitchCheckbox
						enabled={ toggleCustomContext }
						setEnabled={ toggleCustomContexts }
					/>
				</label>
			</div>
			{ toggleContext && ! toggleCustomContext ? (
				<>
					<Select2Input
						placeholder={__('Select context', 'article-gen')}
						defaultValue={ context }
						options={ [
							...contexts.map( ( data ) => {
								return {
									label: data.title,
									value: data.content,
								};
							} ),
						] }
						onChange={ ( input ) => {
							setAttributes( { context: input.value } );
						} }
					/>
				</>
			) : (
				''
			) }

			{ ! toggleContext && toggleCustomContext ? (
				<>
					<Input
						className="wp-block-article-generator-header_title"
						style={ { marginTop: '10px' } }
						placeholder={ __(
							'Enter the context of this article (optional)',
							'article-gen'
						) }
						value={ context }
						onChange={ ( context: IInputResponse ) =>
							setAttributes( { context: context.value } )
						}
					/>
				</>
			) : (
				''
			) }
			<Button
				text={ loading ? __('Generating...', 'article-gen') : __('Generate', 'article-gen') }
				buttonCustomClass="article-gen-btn"
				disabled={ loading }
				iconCustomClass="btn-icon"
				type="primary"
				icon={ faMarker }
				onClick={ () =>
					handlePopulate(
						{
							prompt: prompt,
							context: context,
							options: {
								temperature,
								max_tokens: maxTokens,
							},
						},
						setLoading
					)
				}
			/>
			<InspectorControls>
				<PanelBody
					title={ __( 'Settings', 'article-gen' ) }
					initialOpen={ false }
					icon={ 'admin-settings' }
					opened={ true }
				>
					<div className="mb-6">
						<label>
							{ __( 'Temperature', 'article-gen' ) }:{ ' ' }
							<strong> { temperature } </strong>
							<div>
								<input
									className="w-full h-2 mb-5 rounded-lg appearance-none cursor-pointer bg-gray"
									min={ 0 }
									max={ 2 }
									type="range"
									step="0.1"
									value={ temperature }
									onChange={ ( event ) => {
										setTemperature(
											Number( event.target.value )
										);
									} }
								/>
							</div>
							<small>
								{ __(
									'What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.',
									'article-gen'
								) }
							</small>
						</label>
					</div>
					<div>
						<label>
							{ __( 'Max Tokens', 'article-gen' ) }:{ ' ' }
							<strong>{ maxTokens }</strong>
							<div>
								<input
									className="w-full h-2 mb-5 rounded-lg appearance-none cursor-pointer bg-gray"
									min={ 256 }
									max={ 4096 }
									type="range"
									step="1"
									value={ maxTokens }
									onChange={ ( event ) => {
										setMaxTokens(
											Number( event.target.value )
										);
									} }
								/>
							</div>
							<small>
								{ __(
									"The token count of your prompt plus max_tokens cannot exceed the model's context length. Most models have a context length of 2048 tokens",
									'article-gen'
								) }
							</small>
						</label>
					</div>
				</PanelBody>
			</InspectorControls>
		</div>
	);
}
