import { ReactNode, createContext, useContext, useMemo } from "react";
import { Configuration, OpenAIApi } from 'openai'
import { GetSecretValueCommand, SecretsManagerClient } from "@aws-sdk/client-secrets-manager";
import { useNode } from "@thinairthings/react-nodegraph";

const secretsClient = new SecretsManagerClient({region: "us-east-1"});
const OpenAiContext = createContext<OpenAIApi>(null as any)


export const OpenAiProvider = ({children}: {children: ReactNode}) => {
    const [openAiToken] = useNode(async () => {
        // Get Token
        return (await secretsClient.send(
            new GetSecretValueCommand({
                SecretId: "OPENAI_API_KEY_DEV"
            })
        )).SecretString!
    }, [])
    const [openAiClient] = useNode(async ([token]) => {
        return new OpenAIApi(new Configuration({
            apiKey: token
        }))
    }, [openAiToken])
    if (openAiClient.type !== "success") return null
    return <>
        <OpenAiContext.Provider value={openAiClient.next}>
            {children}
        </OpenAiContext.Provider>
    </>
}

type JsonFunction = {
    name: string
    description: string
    input: {
        type: "object"
        properties: Record<string, any>
    }
}
export const useOpenai = () => {
    const openaiClient = useContext(OpenAiContext)
    return useMemo( () => {
        return {
            generateArguments: async ({
                model = 'gpt-4',
                context,
                jsonFunction
            }: {
                model?: `gpt-4` | `gpt-3.5-turbo`
                context: string,
                jsonFunction: JsonFunction
            }) => {
                const chatResponse = await openaiClient.createChatCompletion({
                    model,
                    messages: [{
                        role: "system",
                        content: `Generate a structured JSON string as arguments based on the provided user input, ensuring it aligns with the parameters specified by the function_calling parameters specification. 
                        The output should be a valid and relevant argument structure for the intended function.
                        `
                    }, {
                        role: "user",
                        content: context
                    }],
                    functions: [{
                        name: jsonFunction.name,
                        description: jsonFunction.description,
                        parameters: jsonFunction.input
                    }],
                    function_call: {
                        name: jsonFunction.name
                    }
                })
                if (!chatResponse.data.choices[0].message?.function_call || 
                    !chatResponse.data.choices[0].message?.function_call?.arguments) {
                    throw new Error("Model did not find a relevant function to call")
                }
                const functionCallString = chatResponse.data.choices[0].message.function_call
                return JSON.parse(functionCallString.arguments!) as Record<string, any>
            },
            selectFunctions: async ({
                model = 'gpt-4',
                systemPrompt,
                userPrompt,
                jsonFunctions
            }: {
                model?: `gpt-4` | `gpt-3.5-turbo`
                systemPrompt?: string
                userPrompt: string,
                jsonFunctions: Array<JsonFunction>
            }) => {
                const chatResponse = await openaiClient.createChatCompletion({
                    model,
                    messages: [{
                        role: "system",
                        content: systemPrompt
                    }, {
                        role: "user",
                        content: userPrompt
                    }],
                    functions: jsonFunctions.map(jsonFunction => ({
                        name: jsonFunction.name,
                        description: jsonFunction.description,
                        parameters: jsonFunction.input
                    })),
                    function_call: {
                        name: jsonFunctions[0].name
                    }
                })
                if (!chatResponse.data.choices[0].message?.function_call || 
                    !chatResponse.data.choices[0].message?.function_call?.arguments) {
                    throw new Error("Model did not find a relevant function to call")
                }
                const functionCallString = chatResponse.data.choices[0].message.function_call
                return JSON.parse(functionCallString.arguments!) as Record<string, any>
            }
        }
    }, [openaiClient])
}


const executeFunctions = (parameters: {
    fns: Array<{
        functionKey: string
        context: string
    }>,
}) => {

}
executeFunctions.arguments