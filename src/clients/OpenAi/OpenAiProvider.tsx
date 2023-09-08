import { ReactNode, createContext, useContext, useMemo } from "react";
import { ChatCompletionFunctions, Configuration, CreateChatCompletionRequestFunctionCall, OpenAIApi } from 'openai'
import { GetSecretValueCommand, SecretsManagerClient } from "@aws-sdk/client-secrets-manager";
import { useEdge } from "@thinairthings/react-nodegraph";

const secretsClient = new SecretsManagerClient({region: "us-east-1"});
export const OpenaiContext = createContext<OpenAIApi>(null as any)

export const OpenaiProvider = ({children}: {children: ReactNode}) => {
    const [tokenNode] = useEdge(async () => {
        // Get Token
        return (await secretsClient.send(
            new GetSecretValueCommand({
                SecretId: "OPENAI_API_KEY_DEV"
            })
        )).SecretString!
    }, [])
    const [clientNode] = useEdge(async ([token]) => {
        return new OpenAIApi(new Configuration({
            apiKey: token
        }))
    }, [tokenNode])
    if (clientNode.state !== "success") return null
    return <>
        <OpenaiContext.Provider value={clientNode.value}>
            {children}
        </OpenaiContext.Provider>
    </>
}

