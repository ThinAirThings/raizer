import { Vertex, useVertex } from "@thinairthings/react-nodegraph";

import { useOpenai } from "../../clients/OpenAi/OpenAiProvider";



export const Composer: Vertex<[string, number]> = ({inputEdges}) => {
    const openaiClient = useOpenai()
    const [compositionEdge] = useVertex(async ([rawInput, count]) => {
        return {}   // Some composition structure
    }, [...inputEdges] as const)
    return <>
        {/* <Dispatcher></Dispatcher> */}
    </>
}
