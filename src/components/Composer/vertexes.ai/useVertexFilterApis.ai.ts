import { Edge, useVertex } from "@thinairthings/react-nodegraph";
import { useOpenai } from "../../../clients/OpenAi/OpenAiProvider";
import apisJson from '../../../aiApis/apis.ai.json'
import useVertexFilterFunctionsInput from "./useVertexFilterFunctions.ai.json"


export const filterApisSystemPrompt = `
You are a vertex in an ai system designed to receive a prompt as an input edge from a user and based on the prompt filter the set of available apis such that
the only remaining apis are those that are relevant to the prompt.
The set of available apis is in stringified json format.
The set of available apis is: ${JSON.stringify(apisJson)}.
Your response should conform the the argument structure of the next vertex in the system as specified by the nextEdge function.
`

export type _Input = {
    rawInput: string
}

export const useVertexFilterApis = (
    /** This function, named useVertextFilterApis, is designed to sift through a collection of APIs, each defined within individual JSON files. Its primary goal is to identify and return the set of APIs that align most closely with a provided prompt.*/
    input: Edge<_Input>
) => {
    const openaiClient = useOpenai()
    const [filteredApiEdge] = useVertex(async ([{rawInput}]) => {
        const chatResponse = await openaiClient.createChatCompletion({
            model: "gpt-4",
            messages: [{
                role: "system",
                content: filterApisSystemPrompt
            }, {
                role: "user",
                content: rawInput
            }],
            functions: [{
                name: useVertexFilterFunctionsInput.name,
                description: useVertexFilterFunctionsInput.description,
                parameters: useVertexFilterFunctionsInput.input
            }],
            function_call: {
                name: useVertexFilterFunctionsInput.name
            }
        })

    }, [input])
    return filteredApiEdge
}
export type _Output = {
    filteredApis: string[]
}