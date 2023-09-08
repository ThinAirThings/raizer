import { useMutation, useMutationCreateNode } from "@thinairthings/liveblocks-model"
import { AirNode, useEdge } from "@thinairthings/react-nodegraph"


/** The success case of this goal being acheieved. */
export type PieChartGoalNode = AirNode<{
    /** Title of Chart */ 
    chartTitle: string
    /** Pie Chart Data */
    data: Array<{
        /** Name of section in pie chart*/
        name: string
        /** Percentage value this section represents of the whole pie chart */
        percentage: number
    }>
}, 'PieChartGoalNode'>

export const PieChartGoalExecution = ({
    input
}: {
    input: PieChartGoalNode
}) => {
    const createUiNode = useMutationCreateNode(useMutation)
    useEdge(async ([{chartTitle, data}]) => {
        createUiNode({
            key: 'PieChart',
            state: {
                chartTitle,
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