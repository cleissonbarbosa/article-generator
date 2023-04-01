/**
 * External dependencies.
 */
import { __ } from "@wordpress/i18n";
import { InspectorControls, RichText, useBlockProps } from "@wordpress/block-editor";
import { PanelBody, __experimentalBoxControl as BoxControl } from '@wordpress/components';
import { dispatch, select } from '@wordpress/data';
import { createBlock, parse } from '@wordpress/blocks';
import { useEffect, useState } from '@wordpress/element';
import { createArticle } from '../../integrations/OpenAi'
/**
 * Internal dependencies.
 */
import "./editor.scss";
import Button from "../../components/button/Button";

interface IArticlePopulate {
  title: string,
  content: string,
}
/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 * @return {WPElement} Element to render.
 */
export default function Prompt({ attributes, setAttributes } ) {
  const { prompt, context, bgColor, padding } = attributes;
  //const [title, setTitle] = useState('');

  return (
    <div
        {...useBlockProps()}
        style={{
            backgroundColor: bgColor,
            padding: `${padding?.top} ${padding?.right} ${padding?.bottom} ${padding?.left}`
        }}
    >
      <RichText
        className="wp-block-article-generator-subject"
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
        text="Generate"
        buttonCustomClass="components-button is-primary"
        onClick={() => handlePopulate({title: prompt, content: context})}
        />

        <InspectorControls>
            <PanelBody
                title={__('Settings', 'article-gen')}
                initialOpen={false}
                opened={false}
            >
                <RichText
                  className="wp-block-article-generator-subject-side"
                  tagName="div"
                  placeholder={__("Write the subject of the article", "article-gen")}
                  value={prompt}
                  onChange={(prompt: string) => setAttributes({ prompt })}
                  required
                  hidden
                />
            </PanelBody>
            <PanelBody
                title={__('Padding/Margin Settings', 'cartpulse')}
                initialOpen={false}
            >
                <BoxControl
                    label={__('Inline Padding', 'cartpulse')}
                    values={padding}
                    onChange={(padding: object) => setAttributes({ padding })}
                />
            </PanelBody>
        </InspectorControls>
    </div>
  );
}

function handlePopulate({ title, content }: IArticlePopulate) {
  const blocks = parse(content);
  //createArticle(prompt).then((response)=> {
    dispatch('core/editor').editPost({title});
    dispatch('core/block-editor').removeBlock(
      select('core/block-editor').getSelectedBlockClientId() ?? ''
    )
    dispatch('core/block-editor').insertBlocks(blocks)

  //})
}

export function extractArticle(response: string): IArticlePopulate {
  const article: IArticlePopulate = {
    title: '',
    content: '',
  };

  const titleRegex = /# (.+)\n/;
  const titleMatch = response.match(titleRegex);
  if (titleMatch) {
    article.title = titleMatch[1];
  }

  const contentRegex = /# .+\n((?:.|\n)+)/;
  const contentMatch = response.match(contentRegex);
  if (contentMatch) {
    article.content = contentMatch[1];
  }

  return article;
}