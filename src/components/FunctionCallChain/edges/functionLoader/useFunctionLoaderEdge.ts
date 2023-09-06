import { NodeValue, useEdge } from "@thinairthings/react-nodegraph";
import { FunctionCallChain, FunctionCallChainSubtypeAdjacencyInputNode } from "../../FunctionCallChain";
import { useOpenai } from "../../../../clients/OpenAi/useOpenai";
import { generateArgumentsBranch } from "./generateArgumentsBranch";
import { FunctionCallInputNode } from "../useFunctionCallEdge";



export const useFunctionLoaderEdge = (
    input: FunctionCallChainSubtypeAdjacencyInputNode
): FunctionCallInputNode => {
    const openai = useOpenai()
    const [functionParamsNode] = useEdge(async ([input]) => {
        switch (input.subtype) {
            case "FunctionCallOutputNode":
                 
            default:
                // Generate Arguments
                return generateArgumentsBranch(input, openai)
        }
    }, [input], {
        type: 'FunctionCallInputNode'
    })
    return functionParamsNode
}

