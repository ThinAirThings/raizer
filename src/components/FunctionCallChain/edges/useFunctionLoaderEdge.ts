import { NodeValue, useEdge } from "@thinairthings/react-nodegraph";
import { FunctionCallChain } from "../FunctionCallChain";
import { FunctionCallParamsNode } from "./useFunctionCallEdge";



export const useFunctionLoaderEdge = (
    input: Parameters<typeof FunctionCallChain<any>>[0]['functionCallChainInput']
): [FunctionCallParamsNode<any>] => {
    const [functionParamsNode] = useEdge(async ([{fn, sourceNode}]) => {
        switch (sourceNode.type) {
            case "functionParams":
                return {
                    fn,
                    params: sourceNode.value.params,
                    context: sourceNode.value.context
                } as NodeValue<FunctionCallParamsNode<any>>
            case "functionResult":
                // RUN PRE FUNCTION HANDLER
                // Check output form and input form
                // Handle transforms
                return {
                    fn,
                    params: {} as any,
                    context: sourceNode.value.context
                } as NodeValue<FunctionCallParamsNode<any>>
            // default:
            //     return null as never
        }
    }, [input], {
        type: 'functionParams'
    })
    return [functionParamsNode]
}