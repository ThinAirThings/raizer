import { AirNode, LifeCycleHandlers, NodeValue, useEdge } from "@thinairthings/react-nodegraph"
import { jsonStructureFromFunction } from "@thinairthings/ts-ai-api"
import { FunctionIndex } from "../../../apis/FunctionIndex"


export const useFunctionCallEdge = (
    functionCallParamsNode: AirNode<{
        functionKey: keyof typeof FunctionIndex
        params: Parameters<typeof FunctionIndex[keyof typeof FunctionIndex]>[0]
    }, 'functionCallParams'>,
    lifecycleHandlers?: LifeCycleHandlers<[typeof functionCallParamsNode], ReturnType<typeof FunctionIndex[keyof typeof FunctionIndex]>>
) => {
    const [functionOutputNode] = useEdge(async ([{functionKey, params}]) => {
        return {
            result: await FunctionIndex[functionKey](params as any),
            outputForm: (await jsonStructureFromFunction(FunctionIndex[functionKey])).output
        }
    }, [functionCallParamsNode], {
        type: 'functionResult',
        lifecycleHandlers: lifecycleHandlers as any
    })
    return [functionOutputNode]
}

