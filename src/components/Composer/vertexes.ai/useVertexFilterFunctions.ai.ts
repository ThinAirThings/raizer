import { Edge, useVertex } from "@thinairthings/react-nodegraph";
import { useOpenai } from "../../../clients/OpenAi/OpenAiProvider";

export const filterFunctionsSystemPrompt = `

`

export type _Input = {
    rawInput: string
}

export const useVertexFilterFunctions = (
    /**Filter functions from api */
    input: Edge<{
        apiName: string
    }>
) => {
    const openaiClient = useOpenai()
    const [filteredFunctionsEdge] = useVertex(async ([{apiName}]) => {
        // await aiVertex_filterFunctions({rawInput}, openaiClient)
    }, [input])
}

export type _Output = {
    filteredFunctions: string[]
}