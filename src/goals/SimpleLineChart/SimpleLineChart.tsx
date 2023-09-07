import { AirNode, GoalResolver, NodeValue, useEdge } from "@thinairthings/react-nodegraph"
import { createContext, useRef } from "react"



/** The goal of creating a simple line chart to visualize data. */
export type SimpleLineChartGoalNode = AirNode<{
    /** Reasoning as to why a line chart was chosen as a target goal for the input prompt. */
    reasoning: string
}, 'SimpleLineChartGoalNode'>

/** The success case of this goal being acheieved. */
export type SimpleLineChartSuccessNode = AirNode<{
    /** Title of Chart */ 
    chartTitle: string
    /** X-Axis Label */
    xLabel: string
    /** Y-Axis Label */
    yLabel: string
    /** Data to be plotted */
    data: Array<{
        /** X-data*/
        x: number
        /** Y-data */
        y: number
    }>
}, 'SimpleLineChartSuccessNode'>

/** The failure case of this goal being acheieved. */
export type SimpleLineChartFailureNode = AirNode<{
    reason: string
}, 'SimpleLineChartFailureNode'>


export type SimpleLineChartGoalResolver = GoalResolver<
    SimpleLineChartSuccessNode,
    SimpleLineChartFailureNode
>
const SimpleLineChartGoalResolverContext = createContext<SimpleLineChartGoalResolver>(null as any)

export const SimpleLineChartGoal = ({
    input
}: {
    input: SimpleLineChartGoalNode
}) => {
    // Create Goal Return Ref
    const simpleLineChartGoalResolverRef = useRef<{
        success: (successValue: NodeValue<SimpleLineChartSuccessNode>)=>void,
        failure: (failureValue: NodeValue<SimpleLineChartFailureNode>)=>void
    }>()
    const [SimpleLineChartGoalNode] = useEdge(async ([]) => {
        return await new Promise<NodeValue<SimpleLineChartSuccessNode>>((success, failure) => {
            simpleLineChartGoalResolverRef.current = {success, failure}
        })
    }, [])
    // Create the SimpleLineChartNode
    useEdge(async ([{chartTitle, xLabel, yLabel, data}]) => {
        
    }, [SimpleLineChartGoalNode])
    return <>
        <SimpleLineChartGoalResolverContext.Provider value={simpleLineChartGoalResolverRef.current!}>

        </SimpleLineChartGoalResolverContext.Provider>
    </>

}