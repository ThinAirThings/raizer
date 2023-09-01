import { Vertex, useNode } from "@thinairthings/react-nodegraph";
import { useOpenai } from "../../clients/OpenAi/OpenAiProvider";
import { FC } from "react";



export const Composer: Vertex<[string, number]> = ({inputEdges}) => {
    const openaiClient = useOpenai()
    const [compositionEdge] = useNode(async ([rawInput, count]) => {
        // Filter Output Ui's
        // const filteredApis = await openaiClient.createChatCompletion({
        //     model: 'gpt-4',
        // })
        const ComponentList = [

        ] as Array<FC<{rawInput: string}>>
        return () => {
            return <>
                {ComponentList.map((Component, index) => {
                    return <Component 
                        key={index}
                        rawInput={rawInput}
                    />
                })}
            </>
        }
    }, [...inputEdges] as const)
    return <>
        {/* <Dispatcher>
        
        </Dispatcher> */}
    </>
}


