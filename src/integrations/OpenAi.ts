import { Configuration, OpenAIApi } from "openai";
import { CreateImageRequestSizeEnum } from "openai/dist/api";

const configuration = new Configuration({
  apiKey: '',
});
const openai = new OpenAIApi(configuration);

export async function createImage (prompt: string, size: CreateImageRequestSizeEnum | null = null): Promise<string> {
  if (!configuration.apiKey) {
    throw new Error( "OpenAI API key not configured, please follow instructions in README.md");
  }

  if (prompt.trim().length === 0) {
    throw new Error( "Please enter a valid prompt" );
  }

  try {
    const result = await openai.createImage({
        prompt: generateImagePrompt(prompt),
        n: 1,
        size: size ?? "1024x1024",
    });
    return new Promise((resolve) => resolve( result.data.data[0].url as string ) );
  } catch(error: any) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
        console.error(error.response.status, error.response.data);
        throw new Error( error.response.data);
    } else {
        console.error(`Error with OpenAI API request: ${error.message}`);
        throw new Error( 'An error occurred during your request.' );
    }
  }
}

export async function createArticle (subject: string, context?: string): Promise<string | undefined> {
  if (!configuration.apiKey) {
    throw new Error( "OpenAI API key not configured");
  }

  if (prompt.trim().length === 0) {
    throw new Error( "Please enter a valid prompt" );
  }

  try {
    // Gera o artigo a partir do texto inicial
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: generateArticlePrompt(subject, context),
      temperature: 0.6,
      max_tokens:  1024,
      n: 1,
      stop: '\n',
    });

    // Retorna o texto do artigo gerado
    return response.data.choices[0].text;
  } catch (error) {
    // Trata possíveis erros durante a geração do artigo
    console.error(error);
    throw new Error('Failed to generate article.');
  }
}

function generateImagePrompt(input: string) : string {
  const capitalizedPrompt =
  input[0].toUpperCase() + input.slice(1).toLowerCase();
  return `${capitalizedPrompt}`;
}

function generateArticlePrompt(subject: string, context?: string): string {
  let prompt = `Write an article about ${subject}.`;

  if (context) {
    prompt += `\n\n${context}`;
  }

  prompt += `
    
  Title: 
  - Make the title catchy and interesting.
  - Insert a [TITLE_START] tag at the beginning of the title and a [TITLE_END] tag at the end of the title
  
  Content: 
  - Write an introduction that captures the reader's attention.
  - Divide the content into sections with subheadings.
  - Add examples and practical tips.
  - End the article with a conclusion and a call to action.
  `;

  return prompt;
}