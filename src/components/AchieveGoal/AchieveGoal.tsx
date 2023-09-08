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
}> = ({input, goalResolver}) => {
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
    const [GoalCompleteNode] = useEdge(async ([input, toolExecutionResolverValue, toolSelectionValue]) => {
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
                        toolSelectionValue.toolKey.replace(/Node$/, 'OutputNode') as NodeTypeString
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
            // This is where you use the toolExecutionResolverNode to resolve the goal.
            return toolExecutionResolverValue
        } else {
            previousExecutions.current.push(toolSelectionValue)
            triggerToolSelection()
            triggerNewToolResolver()
        }
    }, [input, toolExecutionResolverNode, toolSelectionOutputNode] as const)

    // Handle Goal complete and transformation
    useEdge(async ([goalInputValue, goalCompleteValue, toolSelectionOutputValue]) => {
        const inputStructure = jsonStructureFromAirNode(
            toolSelectionOutputValue.toolKey.replace(/Node$/, 'OutputNode') as NodeTypeString
        )
        const outputStructure = goalInputValue.goalStructure
        const transformationCodeResponse = await openai.createChatCompletion({
            model: 'gpt-4',
            messages: [{
                role: 'system',
                content: `
                    Generate a string of valid JavaScript function body code that transforms the output of the first function into the input of the second function and returns the data in the form of the input of the second function.
                    Your output should look like this: {javascriptFunctionBodyCode: "return { {{transformationCode}} }"}, not like this {javascriptFunctionBodyCode: "\\n { return {{transformationCode}} }"}.
                    In other words, the string should not have a newline character at the beginning.
                    The output should be a string which can be passed as the input to a JavaScript Function constructor.

                    Example Output: "return { 
                        chartTitle: 'Nvidia closing prices', 
                        xLabel: 'Time', 
                        yLabel: 'Price', 
                        data: data.results.map(item => ({ x: item.t, y: item.c })) 
                    };"
                `
            }, {
                role: 'user',
                content: `
                The input structure is: ${JSON.stringify(inputStructure)}.
                The output structure is: ${JSON.stringify(outputStructure)}.
                Perform the transform based on this information:
                The initial prompt: ${JSON.stringify(goalInputValue.initialPrompt)}
                The reasoning beging the goal: ${JSON.stringify(goalInputValue.reasoning)}
                `
            }],
            ...openaiReturnType({
                name: 'transformationFunctionBodyCode',
                description: 'The body of a JavaScript function which transforms the input structure into the output structure.',
                parameters: {
                    transformationFunctionBodyCode: {
                        type: 'string',
                        description: 'The body of a JavaScript function which transforms the input structure into the output structure.'
                    }
                }
            })
        })
        if (!transformationCodeResponse.data.choices[0].message?.function_call?.arguments) {
            throw new Error("Model did not find a relevant function to call")
        }
        const codeString = (JSON.parse(transformationCodeResponse.data.choices[0].message.function_call.arguments) as {
            transformationFunctionBodyCode: string
        }).transformationFunctionBodyCode
        const transformationFunction = new Function('data', codeString)
        const transformedData = transformationFunction(goalCompleteValue)
        // Resolve Goal
        goalResolver.success(transformedData)
    }, [input, GoalCompleteNode, toolSelectionOutputNode] as const)
    return <>
        {/* {ToolNode.state === 'success' && <ToolNode.value/>} */}
    </>
}