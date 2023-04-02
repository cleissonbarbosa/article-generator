import { Configuration } from "openai";
import controls from "../../data/settings/controls";
import { settingsEndpoint } from "../../data/settings/endpoint";
import { ISetting } from "../../interfaces";

export default async function openAiSettings(): Promise<Configuration> {
    const settings = await controls.FETCH_FROM_API({ path: `${settingsEndpoint}/openai-api-key` }) as ISetting
    
    if(!settings?.value){
        throw new Error( "OpenAI API key not configured");
    }
    const configuration = new Configuration({
        apiKey: settings.value,
    });
    
    return configuration;
}