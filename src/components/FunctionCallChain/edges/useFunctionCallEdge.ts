import { AirNode, LifeCycleHandlers, NodeValue, useEdge } from "@thinairthings/react-nodegraph"
import { jsonStructureFromAirNode, jsonStructureFromFunction } from "@thinairthings/ts-ai-api"
import { FunctionIndex } from "../../../apis/FunctionIndex"


/** The result of a function call. */
export type FunctionCallOutputNode = AirNode<{
    /** The value returned from the function call in object form. */
    result: {[key: string]: any}
    /** The JSON structured form of the result. */
    outputForm: {[key: string]: any}
}, 'FunctionCallOutputNode'>

export type FunctionCallInputNode = AirNode<{
    /** The key of the function to call. */
    functionKey: keyof typeof FunctionIndex
    /** The parameters to pass to the function. */
    params: Parameters<typeof FunctionIndex[keyof typeof FunctionIndex]>[0]
}, 'FunctionCallInputNode'>

export const useFunctionCallEdge = (
    input: FunctionCallInputNode,
    lifecycleHandlers?: LifeCycleHandlers<
        ReadonlyArray<FunctionCallInputNode>, 
        FunctionCallOutputNode
    >
): FunctionCallOutputNode => {
    const [output] = useEdge(async ([{functionKey, params}]) => {
        return {
            result: await FunctionIndex[functionKey](params as any),
            outputForm: jsonStructureFromAirNode('FunctionCallOutputNode')
        }
    }, [input], {
        type: 'FunctionCallOutputNode',
        lifecycleHandlers
    })
    return output
}

