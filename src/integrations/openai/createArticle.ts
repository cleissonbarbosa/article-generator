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
		response.indexOf( '[TITLE_START]' ) + '[TITLE_START]'.length;
	const titleEndIndex = response.indexOf( '[TITLE_END]' );
	const title = response.slice( titleStartIndex, titleEndIndex ).trim();

	const contentStartIndex =
		response.indexOf( '[CONTENT_START]' ) + '[CONTENT_START]'.length;
	const contentEndIndex = response.indexOf( '[CONTENT_END]' );
	const content = response
		.slice( contentStartIndex, contentEndIndex )
		.trim()
		.replace( /(\r\n|\n|\r)/gm, '' );

	return { title, content };
}

function getFakeText() {
	return extractTitleAndContent( `
      [TITLE_START]The fake text[TITLE_END]
      [CONTENT_START]
      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

      Why do we use it?
      It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).


      Where does it come from?
      Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.

      The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.
      [CONTENT_END]
    ` );
}
