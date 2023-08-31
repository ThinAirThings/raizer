
import { Edge, useVertex } from "@thinairthings/react-nodegraph"
import chalk from "chalk"
import { useOpenai } from "../../clients/OpenAi/OpenAiProvider"
import Stocks from '../../aiApis/Stocks.ai.api/Stocks.json'
import { getStockData } from "../../aiApis/Stocks.ai.api/useVertexGetStockData.ai"

export const argumentsParserSystemPrompt = `
You are a node designed to parse arguments from an input string and call the function with those arguments.
You are responsible for taking the the input string and parsing into the proper argument structure for the function.
`
export const useArgumentParser = (dispatcherEdge: Edge<{
    functionName: string,
    argumentsEncoding: string
}>) => {
    const openaiClient = useOpenai()
    const [argumentsEdge] = useVertex(async ([{functionName, argumentsEncoding}]) => {

        const chatResponse = await openaiClient.createChatCompletion({
            model: "gpt-4",
            messages: [{ 
                role: "system", 
                content: argumentsParserSystemPrompt
            }, {
                role: "user",
                content: argumentsEncoding
            }],
            functions: [{
                name: functionName,
                description: Stocks.functions[functionName].description,
                parameters: Stocks.functions[functionName].parameters
            }],
            function_call: {
                name: functionName,
            }
        })
        
        const args = JSON.parse(chatResponse.data.choices[0].message!.function_call!.arguments!)
        const stockData = await getStockData(args)
        console.log(stockData)
        // const chatResponseContextCheck = await openaiClient.createChatCompletion({
        //     model: "gpt-4",
        //     messages: [{
        //         role: "user",
        //         content: JSON.stringify(JSON.parse(JSON.stringify(stockData)))
        //     }],
        //     functions: [{
        //         name: functionName,
        //         description: Stocks.functions[functionName].description,
        //         parameters: Stocks.functions[functionName].parameters
        //     }],
        //     function_call: {
        //         name: functionName,
        //     }
        // })
        // console.log(chalk.green(JSON.stringify(chatResponseContextCheck)))
        return chatResponse.data.choices[0].message!
    }, [dispatcherEdge], {
        pending: () => console.log(chalk.yellow("Parser is pending")),
        success: async (value) => console.log(chalk.green(`Parser Output: ${
            JSON.stringify(value)
        }`)),
        failure: {
            final: async ({errorLog}) => {
                console.log("Failure")
                console.log(chalk.yellow(
                    JSON.stringify(errorLog[0])
                ))
            },
        }
    })
    return argumentsEdge
}

