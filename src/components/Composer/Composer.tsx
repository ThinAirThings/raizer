import { Vertex, useVertex } from "@thinairthings/react-nodegraph";
import { useOpenai } from "../../clients/OpenAi/OpenAiProvider";


export const Composer: Vertex<[string, number]> = ({inputEdges}) => {
    const openaiClient = useOpenai()
    const [compositionEdge] = useVertex(async ([rawInput, count]) => {
        // Filter Output Ui's
        // const filteredApis = await openaiClient.createChatCompletion({
        //     model: 'gpt-4',
        // })
        return {

        } as CompositionVertex
    }, [...inputEdges] as const)
    return <>
        {/* <Dispatcher>
        
        </Dispatcher> */}
    </>
}


type CompositionVertex = {
    name: string,
    reasoning: string
    children: CompositionVertex[]
}
type CompositionTree = {

}