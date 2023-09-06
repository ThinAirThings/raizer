import { AirNode, SubtypeAdjacencyAirNode, useEdge } from "@thinairthings/react-nodegraph";
import { FunctionCallOutputNode } from "../FunctionCallChain/edges/useFunctionCallEdge";
import { FunctionCallChain } from "../FunctionCallChain/FunctionCallChain";


export type DecisionChainBaseInputNode = AirNode<{
    initialPrompt: string
}, 'DecisionChainInputNode'>

export type DecisionChainSubtypeAdjacencySet =
    | FunctionCallOutputNode
export type DecisionChainSubtypeAdjacencyInputNode = SubtypeAdjacencyAirNode<
    DecisionChainBaseInputNode,
    DecisionChainSubtypeAdjacencySet
>
export const DecisionChain = ({
    input
}: {
    input: DecisionChainSubtypeAdjacencyInputNode
}) => {

    // Decision Ai
    const [NextNodes] = useEdge(async ([input]) => {
        if (inputNode.type === 'root') {

        }
    }, [input])
    return <>
        <FunctionCallChain/>
    </>
}