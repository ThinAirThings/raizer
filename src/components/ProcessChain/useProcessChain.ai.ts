import { Edge } from "@thinairthings/react-nodegraph"
import { usePrompterNode } from "./hooks/usePrompterNode.ai"
import useLLMNode from "../hooks/useLLMNode.ai"
import { useParserNode } from "./hooks/useParserNode.ai"
import { NextNode } from "../../typeUtils"

export type ProcessChainNode<T> = (processChainPreamble: string) => Edge<T>

export const processChainPreamble = `
    A 'Process Chain' is an atomic directed graph with an order of 4 path of nodes nested within a 'Thought Node' of a 'Thought Graph'.
    A Thought Node is a node in a Thought Graph which contains 'Thought State'.
    The purpose of a Process Chain is to perform a series of actions based on a prompt and a set of direct inputs derived from the parent Thought Node of the Thought Node which contains the Process Chain.
`

export const useProcessChain = (rawEdge: Edge<NextNode<typeof usePrompterNode>>, spec: {
    nodeInstructions: string
}) => {
    const prompterEdge = usePrompterNode(rawEdge)
    const llmEdge = useLLMNode(prompterEdge)
    const parserEdge = useParserNode(llmEdge)
    return parserEdge

}


