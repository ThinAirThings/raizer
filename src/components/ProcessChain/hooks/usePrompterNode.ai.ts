import { Edge, useNode } from "@thinairthings/react-nodegraph"
import { useOpenai } from "../../../clients/OpenAi/OpenAiProvider"
import { parserSystemPrompt } from "./useParserNode.ai"
import { createJsonSchema, createOpenAiFunction, objectPrettify } from "../../../utils"
import { resolve } from "path"
import chalk from "chalk"
import { __dirname } from "../../../main"
import { processChainPreamble } from "../useProcessChain.ai"
import { NextNode } from "../../../typeUtils"
import useLLMNode from "../../hooks/useLLMNode.ai"

export const prompterSystemPrompt = `
You are the (1 of 4) node in the path; the 'Prompter Node'.
You are responsible for encoding the relevant Thought Node state from the Thought Graph into the prompt.
You are also responsible for encoding the relevant direct inputs from the parent Thought Node into the prompt.
Your ultimate goal is to output a prompt which can be sent to an LLM.
`


export const usePrompterNode = (rawInputEdge: Edge<{
    rawInput: string
}>, spec: {
    nodeInstructions: string
}) => {
    const openaiClient = useOpenai()
    const [prompterEdge] = useNode(async ([{rawInput}]) => {
        const response = await openaiClient.createChatCompletion({
            model: "gpt-4",
            messages: [{ 
                role: "system", 
                content: processChainPreamble
                    + prompterSystemPrompt
                    + `You are adjacent to the (2 of 4) node in the Process Chain; the 'Parser Node'.
                    The Parser Node's system prompt is: ${parserSystemPrompt}
                    The specific instructions for your node are
                    `
            }, {
                role: "user",
                content: rawInput
            }],
            functions: [
                createOpenAiFunction({
                    name: "useLLM",
                    description: "Send the prompt to the LLM",
                })
            ],
            function_call: {
                name: "useLLM",
            }
        })
        if (!response.data.choices[0].message?.function_call?.arguments) {
            throw new Error("Error")
        }
        return JSON.parse(response.data.choices[0].message.function_call.arguments) as NextNode<typeof useLLMNode>
    }, [rawInputEdge], {
        pending: () => console.log(chalk.yellow("Prompter is pending")),
        success: async (value) => console.log(
            chalk.green(
                await objectPrettify(value)
            )
        ),
        failure: {
            final: ({errorLog}) => console.log(chalk.red(`Prompter Error: ${errorLog[0].message}`)),
        }
    })
    return prompterEdge
}