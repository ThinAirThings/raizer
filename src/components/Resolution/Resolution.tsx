import { AirNode, NodeValue, nodeFromValue, useEdge } from "@thinairthings/react-nodegraph"
import { FC } from "react"
import { useOpenai } from "../../clients/OpenAi/useOpenai"
import { jsonStructureFromAirNode, jsonStructureFromNodeIndex } from "@thinairthings/ts-ai-api"
import { Goal } from "../../goals/Goal/Goal"
import { GoalNodeIndex } from "../../goals/GoalIndex"

export type ResolutionInputNode = AirNode<{
    initialPrompt: string
}, 'ResolutionInputNode'>

/** The input to the system which will take an array of goals and begin trying to achieve them. */
export type ResolutionOutputNode = AirNode<{
    /** An array of goals */
    goals: Array<{
        /** The name of the goal. */
        goalKey: keyof GoalNodeIndex,
        /** The reasoning behind choosing this goal. */
        reasoning: string
    }>
}, 'ResolutionOutputNode'>

export const Resolution: FC<{
    input: ResolutionInputNode
}> = ({input}) => {
    const openai = useOpenai()
    // Define Goals
    const [GoalNodes] = useEdge(async ([{initialPrompt}]) => {
        const outputNodeJson = jsonStructureFromAirNode('ResolutionOutputNode')
        const goalIndexJson = jsonStructureFromNodeIndex('GoalNodeIndex')
        const chatResponse = await openai.createChatCompletion({
            model: 'gpt-4',
            messages: [{
                role: 'system',
                content: `You're an ai which generates a set of goals based on a predetermined set of possible goals.
                Your task is to interpret the user prompt and define 1-5 goals to be achieved.
                The set of goals you may choose from are defined as follows:
                ${Object.entries(goalIndexJson.index).map(([key, value]) => {
                    return `${key}: ${value.description}`
                }).join('\n')}
                `
            }, {
                role: 'user',
                content: initialPrompt
            }],
            functions: [{
                name: outputNodeJson.name,
                description: outputNodeJson.description,
                parameters: outputNodeJson.structure
            }],
            function_call: {
                name: outputNodeJson.name,
            } 
        })
        if (!chatResponse.data.choices[0].message?.function_call?.arguments) {
            throw new Error("Model did not find a relevant function to call")
        }
        const functionCallArguments = chatResponse.data.choices[0].message.function_call.arguments
        const resolutionOutput = JSON.parse(functionCallArguments) as NodeValue<ResolutionOutputNode>
        return resolutionOutput.goals.map(({goalKey, reasoning}) => {
            return {
                initialPrompt,
                goalKey,
                reasoning,
                goalStructure: goalIndexJson.index[goalKey].structure
            }
        })
    }, [input], {
        lifecycleHandlers: {
            pending: () => console.log("Trying Resolution Node"),
            success: (output) => {
                console.log("Resolution Node Success")
                console.log(JSON.stringify(output, null, 4))
            },
            failure: {
                final: (error: any) => console.log("Resolution Node Error", JSON.stringify(error, null, 4)),
            }
        }
    })

    if (GoalNodes.state !== 'success') return null
    return <>
        {GoalNodes.value.map((goalInputValue) => {
            return <Goal
                key={goalInputValue.reasoning}
                input={nodeFromValue(goalInputValue, 'GoalInputNode')}
            />
        })}
    </>
}