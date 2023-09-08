import { useContext, useMemo } from "react"
import { callFunctionFactory } from "./api/callFunctionFactory"
import { OpenaiContext } from "./OpenAiProvider"
import { transformDataFactory } from "./api/transformDataFactory"
import { ChatCompletionFunctions, CreateChatCompletionRequestFunctionCall } from "openai"


export const useOpenai = () => {
    const openaiClient = useContext(OpenaiContext)
    // return useMemo(() => {
    //     return {
    //         generateArguments: generateArgumentsFactory(openaiClient),
    //         callFunction: callFunctionFactory(openaiClient),
    //         transformData: transformDataFactory(openaiClient)
    //     }
    // }, [openaiClient])
    return openaiClient
}


export const openaiReturnType = ({
    name,
    description,
    parameters
}: {
    name: string, 
    description: string,
    parameters: Record<string, {
        type: string,
        description: string
    }>
}): {
    functions: ChatCompletionFunctions[],
    function_calling: CreateChatCompletionRequestFunctionCall
} => {
    return {
        functions: [{
            name,
            description,
            parameters: {
                type: "object",
                properties: parameters,
                required: Object.keys(parameters)
            },
        }],
        function_calling: {
            name
        }
    }
}