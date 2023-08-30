import { FC, createContext, useContext, useRef } from "react";
import {Configuration, OpenAIApi} from "openai"
import {Edge, useNode} from "@thinairthings/react-nodegraph"
import { ProcessChainNode, useProcessChain } from "../ProcessChain/useProcessChain.ai";
import { OpenAiProvider } from "../../clients/OpenAi/OpenAiProvider";
import { ThoughtNode } from "../ThoughtNode/ThoughtNode";


export const RootThought: FC<{
    rawInputEdge: Edge<{
        rawInput: string
    }>
}> = ({rawInputEdge}) => {
    return <>
        <OpenAiProvider>
            <ThoughtNode
                rawInputEdge={rawInputEdge}
            />
        </OpenAiProvider>
    </>
}


