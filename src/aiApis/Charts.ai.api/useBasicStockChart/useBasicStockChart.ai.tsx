import { Edge, useVertex } from "@thinairthings/react-nodegraph"
import { useOpenai } from "../../../clients/OpenAi/OpenAiProvider"
import getStockDataJson from "../../Stocks.ai.api/getStockData/getStockData.ai.json"
import useBasicStockChartJson from "./useBasicStockChart.ai.json"
import { StocksApi } from "../../Stocks.ai.api/Stocks.ai.api"


export type _Input = Array<{
    time: string,
    value: number
}>

const basicStockChartSystemPrompt = `
You are an ai designed to interpret the prompt of a user and determine the appropriate api to call
such that a chart can be created.
`

const basicStockChartArgumentParserSystemPrompt = `
Given a collection of unstructured stock ticker data, parse and transform this data to fit the following structured format specified in the function calling section.
`
export const useBasicStockChart = (
    /** This function displays stock data in a chart*/
    input: Edge<{
        rawInput: string
    }>
) => {
    const openaiClient = useOpenai()
    const [createBasicStockChartCallbackEdge] = useVertex(async ([{rawInput}]) => {
        const chatResponse = await openaiClient.createChatCompletion({
            model: "gpt-4",
            messages: [{
                role: "system",
                content: basicStockChartSystemPrompt
            }, {
                role: "user",
                content: rawInput
            }],
            functions: [{
                name: getStockDataJson.name,
                description: getStockDataJson.description,
                parameters: getStockDataJson.input
            }],
            function_call: {
                name: getStockDataJson.name
            }
        })
        if (!chatResponse.data.choices[0].message?.function_call) {
            throw new Error("Model did not find a relevant function to call")
        }
        const functionCallString = chatResponse.data.choices[0].message.function_call
        const functionCall: {
            name: keyof typeof StocksApi,
            arguments: Parameters<typeof StocksApi[keyof typeof StocksApi]>[0]
        } = {
            name: functionCallString.name as keyof typeof StocksApi,
            arguments: JSON.parse(functionCallString.arguments!)
        }
        
        // Create Liveblocks node
        return async () => {
            const stockData = await StocksApi[functionCall.name](functionCall.arguments)
            const chatResponse = await openaiClient.createChatCompletion({
                model: "gpt-4",
                messages: [{
                    role: "system",
                    content: basicStockChartArgumentParserSystemPrompt
                }, {
                    role: "user",
                    content: rawInput
                }],
                functions: [{
                    name: useBasicStockChartJson.name,
                    description: useBasicStockChartJson.description,
                    parameters: useBasicStockChartJson.input
                }],
                function_call: {
                    name: useBasicStockChartJson.name
                }
            })
            
        }
    }, [input])
    const [basicStockChartEdge] = useVertex(async ([callback]) => {

    }, [createBasicStockChartCallbackEdge])


}