import { OpenAIApi } from "openai";
import openAiSettings from "./Settings";


export const getOpenAi = async () => new OpenAIApi( await openAiSettings() );

export function generateImagePrompt(input: string) : string {
  const capitalizedPrompt =
  input[0].toUpperCase() + input.slice(1).toLowerCase();
  return `${capitalizedPrompt}`;
}

