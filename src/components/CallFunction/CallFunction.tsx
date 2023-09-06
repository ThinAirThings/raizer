import { AirNode, NodeValue } from "@thinairthings/react-nodegraph"
import { BaseNodeValue } from "../AiNodeUnion"
import { FunctionIndex } from "../../apis/FunctionIndex"
import { FC } from "react"



export type CallFunctionOutputNode = AirNode<
    NodeValue<Parameters<typeof CallFunction>[0]['callFunctionInputNode']> & {
        result: ReturnType<typeof FunctionIndex[keyof typeof FunctionIndex]>
    }
>

export const CallFunction = ({
    callFunctionInputNode
}: {
    callFunctionInputNode: AirNode<BaseNodeValue & {
        functionKey: keyof typeof FunctionIndex
        params: Parameters<typeof FunctionIndex[keyof typeof FunctionIndex]>[0]
    }, 'callFunctionInput'>
}) => {

}