import { FunctionCallOutputNode, useFunctionCallEdge } from "./edges/useFunctionCallEdge";
import { AirNode, SubtypeAdjacencyAirNode } from "@thinairthings/react-nodegraph";
import { useFunctionLoaderEdge } from "./edges/functionLoader/useFunctionLoaderEdge";
import { DecisionChain } from "../DecisionChain/DecisionChain";
import { FunctionIndex } from "../../apis/FunctionIndex";
import { FC } from "react";

export type FunctionCallChainBaseInputNode = AirNode<{
    reasoning: string
    functionKey: keyof typeof FunctionIndex
}, 'FunctionCallChainInputNode'>

export type FunctionCallChainSubtypeAdjacencySet =
    | FunctionCallOutputNode

export type FunctionCallChainSubtypeAdjacencyInputNode = SubtypeAdjacencyAirNode<
    FunctionCallChainBaseInputNode,
    FunctionCallChainSubtypeAdjacencySet
> 
export const FunctionCallChain = ({
    input
}: {
    input: FunctionCallChainSubtypeAdjacencyInputNode
}): FC<{
    input: FunctionCallOutputNode
}> => {
    // Function Loader
    const functionCallInputNode = useFunctionLoaderEdge(input)
    // Call Function
    const functionCallOutputNode = useFunctionCallEdge(functionCallInputNode)

    // Handle what to do next
    return <>
        <DecisionChain input={functionCallOutputNode} />
    </>
}


