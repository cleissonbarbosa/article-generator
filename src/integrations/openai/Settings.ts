import { Configuration } from "openai";
import controls from "../../data/settings/controls";
import { settingsEndpoint } from "../../data/settings/endpoint";
import { ISetting } from "../../interfaces";

export default async function openAiSettings(): Promise<Configuration> {
    const apiKey = await controls.FETCH_FROM_API({ path: `${settingsEndpoint}/openai-api-key` }) as ISetting
    const organizationID = await controls.FETCH_FROM_API({ path: `${settingsEndpoint}/openai-organization-id` }) as ISetting
    
    if(!apiKey?.value && !organizationID.value){
        throw new Error( "OpenAI API key not configured");
    }

    const configuration = new Configuration({
        apiKey: apiKey.value,
        organization: organizationID.value
    });
    
    return configuration;
}