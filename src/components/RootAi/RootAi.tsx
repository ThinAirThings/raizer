import { FC } from "react";
import { Edge } from "@thinairthings/react-nodegraph"
import { OpenAiProvider } from "../../clients/OpenAi/OpenAiProvider";
import { ThoughtNode } from "../ThoughtNode/ThoughtNode";


export const RootAi: FC<{
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


