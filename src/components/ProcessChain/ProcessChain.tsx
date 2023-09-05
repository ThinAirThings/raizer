import { FC } from "react";
import {useOpenai} from '../../clients/OpenAi/useOpenai'
import { useNode } from "@thinairthings/react-nodegraph";
import { getStockData } from "../../apis/Stocks/getStocksData/getStocksData";
import {createSimpleLineChart} from '../../apis/Charts/createSimpleLineChart/createSimpleLineChart'
import { useFunctionCall } from "../FunctionCall/edges/useFunctionCallEdge";


export const ProcessChain: FC<{
    prompt: string
}> = ({
    prompt
}) => {
    const openAiClient = useOpenai()
    const functionCallResult = useFunctionCall({
        context: prompt,
        fn: getStockData
    })
    // LEFT OFF HERE!!!
    const [NextNode] = useNode(async () => {
        const stockData = await openAiClient.callFunction({
            context: "Show me data for Nvidia", 
            fn: getStockData
        })
        console.log(stockData)
        const transformCode = await openAiClient.transformData({
            prompt,
            fn1: getStockData,
            fn2: createSimpleLineChart
        })
        console.log(transformCode.javascriptFunctionBodyCode)
        const dataTransformFunction = new Function('data', transformCode.javascriptFunctionBodyCode)
        const result = dataTransformFunction(stockData)
        // eval(transformCode.javascriptCode)
        // // @ts-ignore
        // const result = transformData(stockData)
        console.log(result)
        return 5
    }, [], {
        pending: () => console.log("Running Transform Data"),
        failure: {
            maxRetryCount: 3,
            retry: (error, {runRetry}) => runRetry(),
            final: (err) => console.log("Error Transforming Data", JSON.stringify(err))
        }

    })
    return <></>
}