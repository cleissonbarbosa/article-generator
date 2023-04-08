import { CreateCompletionRequest } from 'openai';
import { getOpenAi } from './OpenAi';

export interface IArticlePopulate {
	title: string;
	content: string;
}

export async function createArticle(
	subject: string,
	context?: string,
	options?: Pick< CreateCompletionRequest, 'temperature' | 'max_tokens' >
): Promise< IArticlePopulate > {
	if ( subject.trim().length === 0 ) {
		throw new Error( 'Please enter a valid prompt' );
	}

	try {
		// Gera o artigo a partir do texto inicial
		const response = await (
			await getOpenAi()
		 ).createCompletion( {
			model: 'text-davinci-003',
			prompt: generateArticlePrompt( subject, context ),
			temperature: 0.6,
			max_tokens: 3024,
			n: 1,
			stop: '[CONTENT_END]',
			...options,
		} );
		console.log(response)
		// Retorna o texto do artigo gerado separado em titulo e conteúdo
		return extractTitleAndContent(
			response.data.choices[ 0 ].text as string
		);
	} catch ( error: Error | any ) {
		// Trata possíveis erros durante a geração do artigo
		console.info( { error } );
		const errorMessase =
			error.response.data.error.message ||
			`Failed to generate article. Make sure you entered the API Key in the settings`;
		throw new Error( errorMessase );
	}
}

function generateArticlePrompt( subject: string, context?: string ): string {
	let prompt = `Write an article about ${ subject }.`;

	if ( context ) {
		prompt += `\n\ncontext: ${ context }\n\n`;
	}

	prompt += `
      
    Title: 
    - Make the title catchy and interesting.
    - Insert a [TITLE_START] tag at the beginning of the title and a [TITLE_END] tag at the end of the title
    
    Content: 
    - Insert a [CONTENT_START] tag at the beginning of the content and a [CONTENT_END] tag at the end of the content
    - Write an introduction that captures the reader's attention.
    - Divide the content into sections with subheadings.
    - Add examples and practical tips.
    - End the article with a conclusion and a call to action.
    `;

	return prompt;
}

function extractTitleAndContent( response: string ): IArticlePopulate {
	const titleStartIndex =
		response.indexOf( '[TITLE_START]' ) + '[TITLE_START]'.length
	const titleEndIndex = response.indexOf( '[TITLE_END]' )
	const title = response.slice( titleStartIndex, titleEndIndex ).trim()

	const contentStartIndex =
		response.indexOf( '[CONTENT_START]' ) + '[CONTENT_START]'.length
	const contentEndIndex = response.indexOf( '[CONTENT_END]' )
	const content = `<!-- wp:paragraph -->${response
		.slice( contentStartIndex, contentEndIndex )
		.trim()
		.replace( /[\r\n\v\f\u2028\u2029]+/g, '<!-- /wp:paragraph --><!-- wp:paragraph -->' )}<!-- /wp:paragraph -->`;

	return { title, content };
}