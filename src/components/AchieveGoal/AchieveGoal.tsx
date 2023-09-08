import { FC, useRef } from "react"
import { GoalInputNode } from "../../goals/Goal/Goal"
import { useOpenai, openaiReturnType } from "../../clients/OpenAi/useOpenai"
import { NodeTypeString, NodeValue, useEdge, useNodeResolver } from "@thinairthings/react-nodegraph"
import { jsonStructureFromAirNode, jsonStructureFromNodeIndex } from "@thinairthings/ts-ai-api"
import { ToolExecutionIndex, ToolNodeIndex } from "../../tools/ToolIndex"
import { ToolSelectionOutputNode, useToolSelection } from "./edges/useToolSelection"


export const AchieveGoal: FC<{
    input: GoalInputNode,
    goalResolver: ReturnType<typeof useNodeResolver>[0]
}> = ({input}) => {
    const openai = useOpenai()
    // Previous Executions
    const previousExecutions = useRef<Array<NodeValue<ToolSelectionOutputNode>>>([])
    // Collect Tools
    const [toolSelectionOutputNode, triggerToolSelection] = useToolSelection(
        input,
        previousExecutions.current
    )
    // Create Tool Execution Resolver Ref
    const [
        toolExecutionResolver, 
        toolExecutionResolverNode,
        triggerNewToolResolver
    ] = useNodeResolver()
    // Check if we've acquired enough data to achieve the goal.
    const [GoalCompleteNode] = useEdge(async ([input, toolExecutionResolverNode, toolSelectionValue]) => {
        const goalCheckOutput = await openai.createChatCompletion({
            model: 'gpt-4',
            messages: [{
                role: 'system',
                content: `You're an ai which receives the output structure from a previous stage of the system.
                Your task is to check if the structure you receive contains enough relevant data to complete the goal the system has been assigned to reach.
                The goal you are trying to achieve is encoded in JSON schema form as follows:
                ${JSON.stringify(input)}
                If the structure you receive contains enough relevant data to complete the goal, you should return true. Otherwise, you should return false.
                `
            }, {
                role: 'user',
                content: `The structure you have received is: ${JSON.stringify(
                    jsonStructureFromAirNode(
                        toolSelectionValue.toolKey.replace(/Node$/, 'InputNode') as NodeTypeString
                    )
                )}`
            }],
            ...openaiReturnType({
                name: 'goalIsComplete',
                description: 'Checks if the goal has been completed.',
                parameters: {
                    goalIsComplete: {
                        type: 'boolean',
                        description: 'Whether or not the goal has been completed.'
                    }
                }
            })
        })
        if (!goalCheckOutput.data.choices[0].message?.function_call?.arguments) {
            throw new Error("Model did not find a relevant function to call")
        }
        const checkForCompletionOutput = JSON.parse(goalCheckOutput.data.choices[0].message.function_call.arguments) as {
            goalIsComplete: boolean
        }
        if (checkForCompletionOutput.goalIsComplete) {
            console.log("Transform and resolve")
        } else {
            previousExecutions.current.push(toolSelectionValue)
            triggerToolSelection()
            triggerNewToolResolver()
        }
    }, [input, toolExecutionResolverNode, toolSelectionOutputNode] as const)

    return <>
        {/* {ToolNode.state === 'success' && <ToolNode.value/>} */}
    </>
}