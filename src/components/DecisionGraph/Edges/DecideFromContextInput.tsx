import { AirNode, NodeValue, useEdge } from "@thinairthings/react-nodegraph"
import { ContextGraphOutputNode } from "../../ContextGraph/ContextGraph"
import { useOpenai } from "../../../clients/OpenAi/useOpenai"
import { jsonStructureFromAirNode } from "@thinairthings/ts-ai-api"
import { FunctionGraphOutputNode } from "../../FunctionGraph/FunctionGraph"


export type DecisionNode = AirNode<{
    nextNodeKey: 
}, 'decision'>




export const DecideFromContextInput = ({
    input
}: {
    input: ContextGraphOutputNode
}) => {
    const openai = useOpenai()
    const [ContextInputDecision] = useEdge(async ([inputNode]) => {
        const outputNodes = new Set(['ContextGraphInputNode', 'FunctionGraphInputNode'])
        const chatResponse = await openai.createChatCompletion({
            model: 'gpt-4',
            messages: [{
                role: 'system',
                content: `You are an ai node within a graph which receives input of form ${
                    JSON.stringify(jsonStructureFromAirNode('ContextGraphOutputNode'))
                }.
                Your task is to interpret this input and decide which of the nodes specified in the function calling to output.
                `
            }],
            functions: [...outputNodes].map(outputNodeName => {
                const nodeJson = jsonStructureFromAirNode(outputNodeName)
                return {
                    name: nodeJson.name,
                    description: nodeJson.description,
                    parameters: nodeJson.structure,
                }
            }),
        })
        if (!chatResponse.data.choices[0].message?.function_call || 
            !chatResponse.data.choices[0].message?.function_call?.arguments) {
            throw new Error("Model did not find a relevant function to call")
        }
        const NextNode = JSON.parse(chatResponse.data.choices[0].message.function_call.arguments)
        return NextNode as ContextGraphInputNode | FunctionGraphOutputNode
    }, [input])
    return <></> 
}
