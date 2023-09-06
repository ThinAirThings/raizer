import { useFunctionCallEdge } from "./edges/useFunctionCallEdge";
import { CompositeAirNode } from "@thinairthings/react-nodegraph";
import { useFunctionLoaderEdge } from "./edges/useFunctionLoaderEdge";
import { DecisionChain } from "../DecisionChain/DecisionChain";
import { FunctionIndex } from "../../apis/FunctionIndex";
import { AiNodeUnion } from "../AiNodeUnion";

export const FunctionCallChain = ({
    functionCallChainInputNode
}: {
    functionCallChainInputNode: CompositeAirNode<{
        initialPrompt: string
        t1Reasoning: string
        functionKey: keyof typeof FunctionIndex
    },'functionChainInput', AiNodeUnion, ('functionResult'|'root')> 
}) => {

    // Function Loader
    const [functionCallInputNode] = useFunctionLoaderEdge(functionCallChainInputNode)
    // const 
    const [functionResultNode] = useFunctionCallEdge(functionCallInputNode)
    // Handle what to do next
    return <>
        <DecisionChain decisionChainInput={functionResultNode} />
    </>
}


