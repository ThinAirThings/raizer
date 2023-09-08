import { AirNode, NodeValue, useEdge } from "@thinairthings/react-nodegraph";
import { GoalInputNode } from "../../../goals/Goal/Goal";
import { jsonStructureFromAirNode, jsonStructureFromNodeIndex } from "@thinairthings/ts-ai-api";
import { useOpenai, openaiReturnType } from "../../../clients/OpenAi/useOpenai";
import { ToolNodeIndex } from "../../../tools/ToolIndex";

/** The information representing the selected tool and the reasoning for selecting the tool. */
export type ToolSelectionOutputNode = AirNode<{
    /** The name of the tool. */
    toolKey: keyof ToolNodeIndex
    /** The reasoning behind choosing the tool. */
    reasoning: string
}, 'ToolSelectionOutputNode'>

export const useToolSelection = (
    goalInputNode: GoalInputNode,
    previousToolSelections: NodeValue<ToolSelectionOutputNode>[]
) => {
    const openai = useOpenai()
    return useEdge(async ([goalInput]) => {
        const toolNodeIndexJson = jsonStructureFromNodeIndex('ToolNodeIndex')
        const toolSelectionOutputNodeJson = jsonStructureFromAirNode('ToolSelectionOutputNode')
        const toolResponse = await openai.createChatCompletion({
            model: 'gpt-4',
            messages: [{
                role: 'system',
                content: `You're an ai which selects a tool from a set of possible tools to achieve a goal.
                You will receive a prompt in JSON encoded form of the following structure:
                ${jsonStructureFromAirNode('GoalInputNode').structure}.
                Your task is to return the structure specified in the function_calling specification which
                specifies the next tool to be used to achieve the goal.
                The set of tools you may choose from are defined as follows:
                ${Object.entries(toolNodeIndexJson.index).map(([key, value]) => {
                    return `${key}: ${value.description}`
                }).join('\n')}
                `
            }, {
                role: 'user',
                content: `${JSON.stringify(goalInput)}`
            }, 
            ...previousToolSelections.flatMap((toolSelection) => {
                return [{
                    role: 'assistant' as any,
                    content: `${JSON.stringify(toolSelection)}`
                }, {
                    role: 'user' as any,
                    content: `Now, what tool should I use next?`
                }]
            })],
            // This is really the return statement of the llm
            ...openaiReturnType({
                name: toolSelectionOutputNodeJson.name,
                description: toolSelectionOutputNodeJson.description,
                parameters: toolSelectionOutputNodeJson.structure
            })
        })
        if (!toolResponse.data.choices[0].message?.function_call?.arguments) {
            throw new Error("Model did not find a relevant function to call")
        }
        const functionCallArguments = toolResponse.data.choices[0].message.function_call.arguments
        const toolSelectionOutput = JSON.parse(functionCallArguments) as NodeValue<ToolSelectionOutputNode>
        return toolSelectionOutput
    },[goalInputNode], {
        type: 'ToolSelectionOutputNode',
        lifecycleHandlers: {
            pending: () => console.log("Achieve goal pending"),
        }
    })
}