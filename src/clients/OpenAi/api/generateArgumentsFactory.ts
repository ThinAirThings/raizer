import { OpenAIApi } from "openai"
import { useFunctionLoaderEdge } from "../../../components/FunctionCallChain/edges/useFunctionLoaderEdge"
import { NodeValue } from "@thinairthings/react-nodegraph"
import { jsonStructureFromFunction } from "@thinairthings/ts-ai-api"
import { FunctionIndex } from "../../../apis/FunctionIndex"
import { AiNodeUnion } from "../../../components/AiNodeUnion"


export const generateArgumentsFactory = (openai: OpenAIApi) => async (
    input: NodeValue<Parameters<typeof useFunctionLoaderEdge>[0]>&{subtype: 'root'},
): Promise<NodeValue<AiNodeUnion&{type:'functionCallParams'}>> => {
    const jsonStructure = await jsonStructureFromFunction(FunctionIndex[input.functionKey])
    const chatResponse = await openai.createChatCompletion({
        model: 'gpt-4',
        messages: [{
            role: "system",
            content: `You're an ai which generates a structured JSON string as arguments based on the provided user input, ensuring it aligns with the parameters specified by the function_calling parameters specification. 
            The output should be a valid and relevant argument structure for the intended function.
            `
        }, {
            role: "user",
            content: `My initial prompt was: ${input.initialPrompt}.
            I decided to call this function because: ${input.t1Reasoning}
            `
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
        functionKey: input.functionKey,
        params: JSON.parse(functionCallString.arguments!),
    }
}