import { ReactNode, createContext, useContext, useRef } from "react";
import { Configuration, OpenAIApi } from 'openai'
import { useNode } from "@thinairthings/react-nodegraph";
import { GetSecretValueCommand, SecretsManagerClient } from "@aws-sdk/client-secrets-manager";


const secretsClient = new SecretsManagerClient({region: "us-east-1"});
const OpenAiContext = createContext<OpenAIApi>(null as any)
export const useOpenai = () => useContext(OpenAiContext)

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
        <OpenAiContext.Provider value={openAiClient.value}>
            {children}
        </OpenAiContext.Provider>
    </>
}