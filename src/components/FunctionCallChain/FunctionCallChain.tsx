import { useFunctionCallEdge } from "./edges/useFunctionCallEdge";
import { AirNode, NodeValue } from "@thinairthings/react-nodegraph";
import { useFunctionLoaderEdge } from "./edges/useFunctionLoaderEdge";
import { DecisionChain } from "../DecisionChain/DecisionChain";
import { FunctionIndex } from "../../apis/FunctionIndex";
import { AirNodeTypes } from "../NodeTypes";


export const FunctionCallChain = ({
    functionCallChainInputNode
}:{
    functionCallChainInputNode: AirNode<({
        initialPrompt: string
        t1Reasoning: string
        functionKey: keyof typeof FunctionIndex
    } & (
        | {
            subtype: 'root'
        }
        | {
            subtype: 'functionResult'
        } & (NodeValue<AirNodeTypes&{type: 'functionResult'}>)
    )), 'functionChainInput'>
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
