import { OpenAIApi } from "openai";
import openAiSettings from "./Settings";

// construct open ai instance
export const getOpenAi = async () => new OpenAIApi( await openAiSettings() );
