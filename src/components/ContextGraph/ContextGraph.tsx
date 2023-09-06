import { AirNode } from "@thinairthings/react-nodegraph"
import { FunctionGraphOutputNode } from "../FunctionGraph/FunctionGraph"


export type ContextGraphOutputNode = AirNode<{
    initialPrompt: string
    t1Reasoning: string
    context: string
}, 'ContextGraphOutputNode'>



export const ContextSubgraph = ({
    input
}: {
    input: ContextGraphOutputNode | FunctionGraphOutputNode
})  => {
    return <>
        <DecisionGraph/>
    </>
}