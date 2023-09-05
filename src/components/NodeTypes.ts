import { FunctionCallChain } from "./FunctionCallChain/FunctionCallChain"
import { useFunctionCallEdge } from "./FunctionCallChain/edges/useFunctionCallEdge"
import { RootNode } from "./RootAi/RootAi"



export type AirNodeTypes = 
    | RootNode
    | Parameters<typeof useFunctionCallEdge>[0]
    | ReturnType<typeof useFunctionCallEdge>[0]


