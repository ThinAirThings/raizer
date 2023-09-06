import { AirNode, NodeValue, useEdge } from "@thinairthings/react-nodegraph"
import { createContext, useRef } from "react"



/** 
 * This node is used as input to the ai which will gather and create 
 * information to create a simple line chart based on the initialPrompt. 
 */
export type SimpleLineChartInputNode = AirNode<{
    /** Reasoning as to why a simple line chart was chosen based on the initialPrompt */
    reasoning: string
}>

/** This node is used as input to a ui component to create a simple line chart. */
export type SimpleLineChartGoalNode = AirNode<{
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
}>

type SimpleLineChartGoalResolver = (goal: NodeValue<SimpleLineChartGoalNode>)=>void
const SimpleLineChartGoalResolverContext = createContext<SimpleLineChartGoalResolver>(null as any)

export const SimpleLineChart = ({
    input
}: {
    input: SimpleLineChartInputNode
}) => {
    // Create Resolver Ref
    const simpleLineChartGoalResolverRef = useRef<
        (goal: NodeValue<SimpleLineChartGoalNode>)=>void
    >()
    const [SimpleLineChartGoalNode] = useEdge(async ([]) => {
        return await new Promise<NodeValue<SimpleLineChartGoalNode>>((resolve) => {
            simpleLineChartGoalResolverRef.current = resolve
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