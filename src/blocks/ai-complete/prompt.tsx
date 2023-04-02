/**
 * External dependencies.
 */
import { __ } from "@wordpress/i18n";
import { parse } from '@wordpress/blocks';
import { dispatch, select } from '@wordpress/data';
import Swal, { SweetAlertResult } from "sweetalert2";
import { useState, useEffect } from '@wordpress/element'
import { faMarker } from "@fortawesome/free-solid-svg-icons";
import { InspectorControls, RichText, useBlockProps } from "@wordpress/block-editor";
import { PanelBody, __experimentalBoxControl as BoxControl } from '@wordpress/components';
/**
 * Internal dependencies.
*/
import "./editor.scss";
import Button from "../../components/button/Button";
import { createArticle } from '../../integrations/openai/createArticle'

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 * @return {WPElement} Element to render.
 */
export default function Prompt({ attributes, setAttributes } ) {
  const { prompt, context } = attributes;
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    let alert: Promise<SweetAlertResult<any>> | undefined;
    if(loading) {
      alert = Swal.fire({
        title: __('Wait...', 'article-gen'),
        text: `Writing text about: ${prompt}`,
        icon: 'info',
        toast: true,
        position: 'center',
        showConfirmButton: false,
        timer: 3000
      })
    }
  })
  return (
    <div
        {...useBlockProps()}
        style={{
            backgroundColor: '#ffffff',
            padding: `20px 20px 20px 20px`
        }}
    >
      <RichText
        className="wp-block-article-generator-prompt"
        tagName="h4"
        placeholder={__("Write the subject of the article", "article-gen")}
        value={prompt}
        onChange={(prompt: string) => setAttributes({ prompt })}
        required
      />
      

      <RichText
        className="wp-block-article-generator-header_title"
        tagName="div"
        placeholder={__("Enter the context of this article (optional)", "article-gen")}
        value={context}
        onChange={(context: string) => setAttributes({ context })}
      />
      

      <Button 
        text={loading ? " Generating..." : " Generate"}
        buttonCustomClass="components-button is-primary article-gen-btn"
        disabled={loading}
        iconCustomClass="btn-icon"
        icon={faMarker}
        onClick={() => handlePopulate({prompt: prompt, context: context}, setLoading)}
        />
        <InspectorControls>
            <PanelBody
                title={__('Settings', 'article-gen')}
                initialOpen={false}
                opened={false}
            >
            </PanelBody>
        </InspectorControls>
    </div>
  );
}

function handlePopulate({ prompt, context } : { prompt: string, context: string }, setLoading: React.Dispatch<React.SetStateAction<boolean>>) {
  setLoading(true)
  createArticle(prompt, context).then(( response )=> {
    const blocks = parse(response.content);
    dispatch('core/editor').editPost({title: response.title});
    dispatch('core/block-editor').removeBlock(
      select('core/block-editor').getSelectedBlockClientId() ?? ''
    )
    dispatch('core/block-editor').insertBlocks(blocks)

  }).catch((e) => {
    Swal.fire({
      title: __('Error', 'article-gen'),
      text: e.message,
      icon: 'error',
      toast: true,
      position: 'bottom',
      showConfirmButton: false,
      timer: 3000,
    }).finally( () => setLoading(false) )
  })
}