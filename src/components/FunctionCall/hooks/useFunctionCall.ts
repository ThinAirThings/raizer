import { Edge, useNode } from "@thinairthings/react-nodegraph"
import { useOpenai } from "../../../clients/OpenAi/useOpenai"



export const useFunctionCall = <T,> ({
    context,
    fn,
}: {
    context: string,
    fn: (input: any) => Promise<T>
}, lifecycleHandlers?: Parameters<typeof useNode<any, {
    result: T,
    outputForm: Record<string, any>
}>>[2]
): Edge<Awaited<ReturnType<
    ReturnType<typeof useOpenai>['callFunction']
>>> => {
    const openai = useOpenai()
    return useNode<any, {
        result: T,
        outputForm: Record<string, any>
    }>(async () => {
        const result = await openai.callFunction({ context, fn })
        return result
    }, [], lifecycleHandlers)[0]
}