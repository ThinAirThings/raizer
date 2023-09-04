/** Create a simple line chart */
export const createSimpleLineChart  = async (input: {
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
}): Promise<{
    stuff: string
}> => {
    return {
        stuff: "stuff"
    }
    // const openAiClient = useOpenai()
    // const [ChartDataGeneratorEdge] = useNode(async () => {
    //     // Decide where to get data from
    //     const functionTable = {
    //         'getFantasyData': () => {},
    //         'getStockData': () => {},
    //         'doConversation': () => {}
    //     }
    //     console.log((await jsonStructureFromFunction(getStockData)).output)
    //     console.log(await openAiClient.callFunction({
    //         context: "Show me data for Nvidia", 
    //         fn: getStockData
    //     }))
    //     return () => {

    //     }
    // },[])
} 