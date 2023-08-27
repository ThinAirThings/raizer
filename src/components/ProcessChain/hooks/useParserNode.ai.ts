import { useOpenai } from "../../../clients/OpenAi/OpenAiProvider"
import { scorerSystemPrompt } from "../systemPrompts"
import { prompterSystemPrompt } from "./usePrompterNode.ai"
import { Edge, useNode } from "@thinairthings/react-nodegraph"
import { createOpenAiFunction, objectPrettify } from "../../../utils"
import chalk from "chalk"
import { __dirname } from "../../../main"
import { processChainPreamble } from "../useProcessChain.ai"

export const parserSystemPrompt = `
You are the (2 of 4) node in the path; the 'Parser Node'.
You are responsible for parsing and compressing the output of the LLM into a Thought State.
A Thought State is a json object which contains the compressed state of a Thought Node.
The Thought State represents where 
Your ultimate goal is to output a Thought State. 
`

export const useParserNode = (llmEdge: Edge<{
    rawOutput: string
}>) => {
    const openaiClient = useOpenai()
    const [parserEdge] = useNode(async ([{rawOutput}]) => {
        const chatResponse = await openaiClient.createChatCompletion({
            model: "gpt-4",
            messages: [{ 
                role: "system", 
                content: processChainPreamble
                    + parserSystemPrompt
                    + `You are adjacent to the (3 of 4) node in the Process Chain; the 'Scorer Node'.
                    The Scorer Node's system prompt is: ${scorerSystemPrompt}.
                    You are also adjacent to the (1 of 4) node in the Process Chain; the 'Prompter Node'.
                    The Prompter Node's system prompt is: ${prompterSystemPrompt}.
                    `
            }, {
                role: "user",
                content: rawOutput
            }],
            functions: [
                createOpenAiFunction({
                    name: "useEmbedder",
                    description: "Send the prompt to the Embedder Node",
                })
            ],
            function_call: {
                name: "send_thought_state_to_scorer_node",
            }
        })
        return chatResponse.data.choices[0].message!
    }, [llmEdge], {
        pending: () => console.log(chalk.yellow("Parser is pending")),
        success: async (value) => console.log(chalk.green(`Parser Output: ${
            await objectPrettify(value)
        }`)),
        failure: {
            final: async ({errorLog}) => {
                console.log(chalk.yellow(
                    await objectPrettify(errorLog[0])
                ))
            },
        }
    })
    return parserEdge
}


