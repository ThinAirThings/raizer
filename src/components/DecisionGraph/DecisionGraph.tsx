import { useEdge } from "@thinairthings/react-nodegraph"
import { ContextGraphOutputNode } from "../ContextGraph/ContextGraph"
import { FunctionGraphOutputNode } from "../FunctionGraph/FunctionGraph"
import { DecideFromFunctionInput } from "./Edges/DecideFromFunctionInput"
import { DecideFromContextInput } from "./Edges/DecideFromContextInput"
import { useOpenai } from "../../clients/OpenAi/useOpenai"
import { jsonStructureFromAirNode } from "@thinairthings/ts-ai-api"


export type DecisionGraphInputAdjacencySet = 
    | FunctionGraphOutputNode
    | ContextGraphOutputNode

export type DecisionGraphOutputAdjacencySet =
    | FunctionGraphOutputNode
    | ContextGraphOutputNode

export const DecisionGraph = ({
    input
}: {
    input: DecisionGraphInputAdjacencySet
}) => {
    const openai = useOpenai()
    const [ContextInputDecision] = useEdge(async ([inputNode]) => {
        const outputNodes = new Set(['ContextGraphInputNode', 'FunctionGraphInputNode'])
        const chatResponse = await openai.createChatCompletion({
            model: 'gpt-4',
            messages: [{
                role: 'system',
                content: `You are an ai within a graph which receives an input node of form ${
                    JSON.stringify(jsonStructureFromAirNode(inputNode.type))
                }.
                Your task is to interpret this input node and decide the next edge to spawn in the graph.
                
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
    return <>
        {input.type === 'functionGraphOutput' && 
            <DecideFromFunctionInput input={input}/>
        }
        {input.type === 'contextGraphOutput' &&
            <DecideFromContextInput input={input}/>
        }
    </> 
}