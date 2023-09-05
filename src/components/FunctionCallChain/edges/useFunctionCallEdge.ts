import { AirNode, LifeCycleHandlers, NodeValue, useEdge } from "@thinairthings/react-nodegraph"
import { jsonStructureFromFunction } from "@thinairthings/ts-ai-api"


export type AsyncFunction = (input: any) => Promise<any>
export type FunctionCallParamsNode<T extends AsyncFunction> = Parameters<typeof useFunctionCallEdge<T>>[0]
export type FunctionCallResultNode<T> = AirNode<{
    context: string
    result: T
    outputForm: Record<string, any>
}, 'functionResult'>

export const useFunctionCallEdge = <T extends AsyncFunction> (
    functionCallParamsNode: AirNode<{
        fn: T extends (input: infer P) => Promise<infer R>? (input: P) => Promise<R> : never
        context: string
        params: T extends (input: infer P) => Promise<infer _>? P : never
    }, 'functionParams'>,
    lifecycleHandlers?: LifeCycleHandlers<[typeof functionCallParamsNode], NodeValue<FunctionCallResultNode<T>>>
): [FunctionCallResultNode<Awaited<ReturnType<(typeof functionCallParamsNode & {state: 'success'})['value']['fn']>>>] => {
    const [functionOutputNode] = useEdge(async ([{fn, params, context}]) => {
        return {
            context,
            result: await fn(params),
            outputForm: (await jsonStructureFromFunction(fn)).output
        }
    }, [functionCallParamsNode], {
        type: 'functionResult',
        lifecycleHandlers: lifecycleHandlers as any
    })
    return [functionOutputNode]
}

