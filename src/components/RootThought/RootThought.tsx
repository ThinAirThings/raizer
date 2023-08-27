import { FC, createContext, useContext, useRef } from "react";
import {Configuration, OpenAIApi} from "openai"
import {Edge, useNode} from "@thinairthings/react-nodegraph"
import { ProcessChainNode, useProcessChain } from "../ProcessChain/useProcessChain.ai";
import { OpenAiProvider } from "../../clients/OpenAi/OpenAiProvider";
import { NextNode } from "../../typeUtils";


export const DepthContext = createContext(0)
export const useDepth = () => useContext(DepthContext)

export const RootThought: FC<{
    rawRootInput: string
}> = ({rawRootInput}) => {
    // Depth Ref
    const depthRef = useRef(0)
    return <>
        <OpenAiProvider>
            <DepthContext.Provider value={depthRef.current+1}>
                <ThoughtNode
                    rawEdge={{
                        type: "success",
                        value: {
                            rawInput: rawRootInput
                        }
                    }}
                />
            </DepthContext.Provider>
        </OpenAiProvider>
    </>
}


