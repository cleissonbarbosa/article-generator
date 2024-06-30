/**
 * External dependencies.
 */
import { parse } from '@wordpress/blocks';
import { __, sprintf } from '@wordpress/i18n';
import { CreateCompletionRequest } from 'openai';
import { PanelBody } from '@wordpress/components';
import Swal from 'sweetalert2';
import { useState, useEffect } from '@wordpress/element';
import {
	faMarker,
	faMicrophone,
	faMicrophoneSlash,
} from '@fortawesome/free-solid-svg-icons';
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
	ICreateArticleOptions,
	createArticle,
} from '../../integrations/openai/createArticle';
import speech from '../../integrations/speechRecognition/speech';

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
	options?: ICreateArticleOptions;
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
	const [ speechStatus, setSpeechStatus ] = useState< boolean >( false );
	const [ speechResponse, setSpeechResponse ] =
		useState< SpeechRecognition | null >( null );
	const [ temperature, setTemperature ] = useState< number >( 0.6 );
	const [ maxTokens, setMaxTokens ] = useState< number >( 2048 );
	const [ model, setModel ] = useState< string >( 'text-davinci-003' );
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
			toggleCustomContext: toggleCustomContext
				? ! action
				: toggleCustomContext,
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
			toggleContext: toggleContext ? ! action : toggleContext,
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

	/**
	 * Set title with write effect
	 *
	 * @param {string} title
	 */
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

	/**
	 * speech recognition handle
	 *
	 * @param {string} attr
	 */
	function speechHandle( attr: string ) {
		if ( ! speechStatus ) {
			setSpeechStatus( true );
		} else {
			setSpeechStatus( false );
			if ( speechResponse ) {
				speechResponse.abort();
				return;
			}
		}

		if ( attr === 'prompt' ) {
			document.getElementById( 'text-generator-prompt' )?.focus();
		} else if ( attr === 'context' ) {
			document.getElementById( 'text-generator-context' )?.focus();
		}

		const speechResult = speech( {
			resultCallback: ( t ) => {
				if ( attr === 'prompt' ) {
					setAttributes( { prompt: t } );
				} else if ( attr === 'context' ) {
					setAttributes( { context: t } );
				}
			},
			endCallback: () => setSpeechStatus( false ),
		} );
		setSpeechResponse( speechResult ?? null );
	}

	return (
		<div
			{ ...useBlockProps() }
			style={ {
				backgroundColor: '#ffffff',
				padding: `20px 20px 20px 20px`,
			} }
		>
			<div className="block items-center relative">
				<RichText
					className="wp-block-article-generator-prompt flex-none focus:outline-none focus:ring focus:ring-primary"
					tagName="h4"
					placeholder={ __(
						'Write the subject of the article',
						'article-gen'
					) }
					id="text-generator-prompt"
					value={ prompt }
					onChange={ ( prompt: string ) =>
						setAttributes( { prompt } )
					}
				/>
				<Button
					icon={ speechStatus ? faMicrophoneSlash : faMicrophone }
					buttonCustomClass={ `w-[43px] h-10 absolute right-2 top-[20%] border-none flex justify-center items-center` }
					type={ speechStatus ? 'success' : 'primary' }
					iconCustomClass="block !px-0"
					onClick={ () => speechHandle( 'prompt' ) }
				/>
			</div>

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
						placeholder={ __( 'Select context', 'article-gen' ) }
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
				<div className="relative">
					<Input
						className="wp-block-article-generator-context focus:outline-none focus:ring focus:ring-primary"
						style={ { marginTop: '10px' } }
						placeholder={ __(
							'Enter the context of this article (optional)',
							'article-gen'
						) }
						value={ context }
						id="text-generator-context"
						autoFocus
						onChange={ ( context: IInputResponse ) =>
							setAttributes( { context: context.value } )
						}
					/>
					<Button
						icon={ speechStatus ? faMicrophoneSlash : faMicrophone }
						buttonCustomClass={ `w-7 h-7 absolute right-2 top-[34%] border-none flex justify-center items-center` }
						type={ speechStatus ? 'success' : 'primary' }
						iconCustomClass={ `block !px-0 absolute top-[20%] right-[30%] ${
							speechStatus ? 'text-primary' : ''
						}` }
						onClick={ () => speechHandle( 'context' ) }
					/>
				</div>
			) : (
				''
			) }
			<Button
				text={
					loading
						? __( 'Generating...', 'article-gen' )
						: __( 'Generate', 'article-gen' )
				}
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
								model
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
					<div className="mb-6">
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
					<div className="mb-6">
						<label>
							{ __( 'Model', 'article-gen' ) }:{ ' ' }
							<strong>{ model }</strong>
							<div className="mt-2">
								<Select2Input 
									defaultValue={model}
									isMulti={false}
									onChange={ input => setModel( input.value ) }
									options={[
										{ 
											label: 'Davinci 003',
											value: 'text-davinci-003'
										},
										{ 
											label: 'Davinci 002',
											value: 'text-davinci-002'
										},
										{
											label: 'Curie', 
											value: 'text-curie-001'
										},
										{
											label: 'Babbage', 
											value: 'text-babbage-001'
										},
										{
											label: 'Ada', 
											value: 'text-ada-001'
										}
									]}
								/>
							</div>
							<small>
								{ __(
									"The OpenAI API is powered by a diverse set of models with different capabilities and price points.",
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
