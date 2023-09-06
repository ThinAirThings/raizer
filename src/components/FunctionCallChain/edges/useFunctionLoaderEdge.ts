import { NodeValue, useEdge } from "@thinairthings/react-nodegraph";
import { FunctionCallChain } from "../FunctionCallChain";
import { useOpenai } from "../../../clients/OpenAi/useOpenai";
import { AirNodeTypes } from "../../AiNodeUnion";


export const useFunctionLoaderEdge = (
    input: Parameters<typeof FunctionCallChain>[0]['functionCallChainInputNode']
): [AirNodeTypes&{type: 'functionCallParams'}] => {
    const openai = useOpenai()
    const [functionParamsNode] = useEdge(async ([input]) => {
        switch (input.subtype) {
            case "root":
                // Generate Arguments
                return openai.generateArguments(input) 
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
        type: 'functionCallParams'
    })
    return [functionParamsNode]
}

