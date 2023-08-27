import { Edge, useNode } from "@thinairthings/react-nodegraph"
import { useOpenai } from "../../clients/OpenAi/OpenAiProvider"
import chalk from "chalk"
import { createOpenAiFunction } from "../../utils"
import { NextNode } from "../../typeUtils"
import { useParserNode } from "../ProcessChain/hooks/useParserNode.ai"

export const useLLMNode = (prompterEdge: Edge<{
    prompt: string
}>) => {
    const openaiClient = useOpenai()
    const [llmEdge] = useNode(async ([{prompt}]) => {
        const response = await openaiClient.createChatCompletion({
            model: "gpt-4",
            messages: [{
                role: "user",
                content: prompt
            }],
            functions: [
                createOpenAiFunction({
                    name: "useParser",
                    description: "Send the prompt to the Parser Node",
                })
            ]
        })
        if (!response.data.choices[0].message?.function_call?.arguments) {
            throw new Error("Error")
        }
        return JSON.parse(response.data.choices[0].message.function_call.arguments) as NextNode<typeof useParserNode>
    }, [prompterEdge], {
        pending: () => console.log(chalk.yellow("LLM is running")),
        success: (value) => console.log(chalk.green(`LLM Output: ${value}`)),
    })
    return llmEdge
}

export default useLLMNode