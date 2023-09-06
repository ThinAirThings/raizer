import { AirNode, CompositeAirNode } from "@thinairthings/react-nodegraph"
import { FunctionIndex } from "../../apis/FunctionIndex"
import { BaseNodeValue } from "../AiNodeUnion"
import { ContextGraphOutputNode } from "../ContextGraph/ContextGraph"
import { jsonStructureFromAirNode } from "@thinairthings/ts-ai-api"


export type FunctionGraphOutputNode = AirNode<BaseNodeValue & {
    functionKey: keyof typeof FunctionIndex
    params: Parameters<typeof FunctionIndex[keyof typeof FunctionIndex]>[0]
    result: ReturnType<typeof FunctionIndex[keyof typeof FunctionIndex]>
    outputForm: Record<string, any>
}, 'FunctionGraphOutputNode'>

export type FunctionCallSubgraphInput = AirNode<BaseNodeValue & {
    functionKey: keyof typeof FunctionIndex
    
}>
export const FunctionCallSubgraph = ({
    input
}: {
    input: FunctionGraphOutputNode | ContextGraphOutputNode
}) => {

    return <>
        {root.state === 'success' && <>
            {root.value.subtype === 'functionGraphResult' && }
        </>}        
    </>
}

FunctionCallSubgraph.description = `
A subgraph which takes as input either a node with structure ${
    jsonStructureFromAirNode('FunctionGraphOutputNode')
} or ${
    jsonStructureFromAirNode('ContextGraphOutputNode')
}. This subgraph will interpret 
`