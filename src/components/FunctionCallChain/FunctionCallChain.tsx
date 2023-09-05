import { AsyncFunction,  FunctionCallParamsNode,  FunctionCallResultNode,  useFunctionCallEdge } from "./edges/useFunctionCallEdge";
import { AirNode, useEdge } from "@thinairthings/react-nodegraph";
import { useFunctionLoaderEdge } from "./edges/useFunctionLoaderEdge";
import { DecisionChain } from "../DecisionChain/DecisionChain";



export const FunctionCallChain = <T extends AsyncFunction,>({
    functionCallChainInput
}:{
    functionCallChainInput: AirNode<{
        fn: T extends (input: infer In)=>Promise<infer Out>?(input: In)=> Promise<Out>:never
        sourceNode: (
            {state: 'success'} & (
                | FunctionCallParamsNode<any>
                | FunctionCallResultNode<T extends (input: infer In)=>Promise<any>?In:never>
            )
        )
    }, 'functionCallChain'>
}) => {
    // Function Loader
    const [functionCallInputNode] = useFunctionLoaderEdge(functionCallChainInput)
    // const 
    const [functionResultNode] = useFunctionCallEdge(functionCallInputNode)
    // Handle what to do next
    return <>
        <DecisionChain decisionChainInput={functionResultNode} />
    </>
}