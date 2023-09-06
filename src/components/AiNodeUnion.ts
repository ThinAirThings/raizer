import { useFunctionCallEdge } from "./FunctionCallChain/edges/useFunctionCallEdge"
import { RootNode } from "./RootAi/RootAi"


// Base Node Types (No subtype unions. Subtype unions are their own class of types used in decision making)
export type AiNodeUnion = 
    | RootNode
    | Parameters<typeof useFunctionCallEdge>[0]
    | ReturnType<typeof useFunctionCallEdge>[0]


export type BaseNodeValue = {
    initialPrompt: string
    t1Reasoning: string
}