import { Edge, useNode } from "@thinairthings/react-nodegraph"
import { useOpenai } from "../../../clients/OpenAi/useOpenai"



export const useFunctionCall = <T,> ({
    context,
    fn,
    lifecycleHandlers
}: {
    context: string,
    fn: (input: any) => Promise<T>
    lifecycleHandlers?: Parameters<typeof useNode<any, T>>[2]
}): Edge<T> => {
    const openai = useOpenai()
    return useNode(async () => {
        const result = await openai.callFunction({ context, fn })
        return result
    }, [], lifecycleHandlers)[0]
}