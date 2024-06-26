import { useMutation, useMutationCreateNode } from "@thinairthings/liveblocks-model"
import { AirNode, useEdge } from "@thinairthings/react-nodegraph"


/** The success case of this goal being acheieved. */
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
}, 'SimpleLineChartGoalNode'>

export const SimpleLineChartGoalExecution = ({
    input
}: {
    input: SimpleLineChartGoalNode
}) => {
    const createUiNode = useMutationCreateNode(useMutation)
    useEdge(async ([{chartTitle, xLabel, yLabel, data}]) => {
        createUiNode({
            key: 'SimpleLineChart',
            state: {
                chartTitle,
                xLabel,
                yLabel,
                data,
                containerState: {
                    width: 500,
                    height: 500,
                    x: 0,
                    y: 0,
                    scale: 1
                }
            }
        })
    }, [input])
    return <></>
}