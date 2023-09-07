import { AirNode, NodeValue, useEdge } from "@thinairthings/react-nodegraph"
import { FC } from "react"
import { useOpenai } from "../../clients/OpenAi/useOpenai"
import { SimpleLineChartGoalNode } from "../../goals/SimpleLineChart/SimpleLineChart"
import { jsonStructureFromAirNode, jsonStructureFromNodeIndex } from "@thinairthings/ts-ai-api"


/** The set of possible goals. */
export type GoalNodeIndex = {
    /** The goal of creating a simple line chart to visualize data. */
    'SimpleLineChartGoalNode': NodeValue<SimpleLineChartGoalNode>
}

export type ResolutionInputNode = AirNode<{
    initialPrompt: string
}, 'ResolutionInputNode'>

/** The input to the system which will take an array of goals and begin trying to achieve them. */
export type ResolutionOutputNode = AirNode<{
    /** An array of goals */
    goals: Array<{
        /** The name of the goal. */
        goal: keyof GoalNodeIndex,
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
        // console.log(outputNodeJson)
        const goalIndexJson = jsonStructureFromNodeIndex('GoalNodeIndex')
        console.log(JSON.stringify(goalIndexJson, null, 4))
        console.log(`${Object.entries(jsonStructureFromNodeIndex('GoalNodeIndex').index).map(([key, value]) => {
            return `${key}: ${value.description}`
        }).join('\n')}`)
        const chatResponse = await openai.createChatCompletion({
            model: 'gpt-4',
            messages: [{
                role: 'system',
                content: `You're an ai which generates a set of goals based on a predetermined set of possible goals.
                Your task is to interpret the user prompt and define 1-5 goals to be achieved.
                The set of goals you may choose from are defined as follows:
                ${Object.entries(jsonStructureFromNodeIndex('GoalNodeIndex').index).map(([key, value]) => {
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
            }]
        })
        if (!chatResponse.data.choices[0].message?.function_call || 
            !chatResponse.data.choices[0].message?.function_call?.arguments) {
                console.log("HERE!!!")
            throw new Error("Model did not find a relevant function to call")
        }
        const functionCallString = chatResponse.data.choices[0].message.function_call
        const functionCallArguments = chatResponse.data.choices[0].message.function_call.arguments
        console.log(functionCallString, functionCallArguments)
    }, [input], {
        lifecycleHandlers: {
            pending: () => console.log("Trying Resolution Node"),
            success: () => console.log("Resolution Node Success"),
            failure: {
                final: (error: any) => console.log("Resolution Node Error", JSON.stringify(error, null, 4)),
            }
        }
    })

    return <></>
}