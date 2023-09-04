import { jsonStructureFromFunction } from "@thinairthings/ts-ai-api"
import { OpenAIApi } from "openai"



export const callFunctionFactory = (openaiClient: OpenAIApi) => async <T,>({
    context,
    fn
}: {
    context: string,
    fn: (input: any) => Promise<T>
}): Promise<{
    result: T,
    outputForm: Record<string, any>
}> => {
    const jsonStructure = await jsonStructureFromFunction(fn)
    const chatResponse = await openaiClient.createChatCompletion({
        model: 'gpt-4',
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
            name: jsonStructure.name,
            description: jsonStructure.description,
            parameters: jsonStructure.input
        }],
        function_call: {
            name: jsonStructure.name
        }
    })
    if (!chatResponse.data.choices[0].message?.function_call || 
        !chatResponse.data.choices[0].message?.function_call?.arguments) {
        throw new Error("Model did not find a relevant function to call")
    }
    const functionCallString = chatResponse.data.choices[0].message.function_call
    return {
        result: await fn(JSON.parse(functionCallString.arguments!)),
        outputForm: jsonStructure.output
    }
}