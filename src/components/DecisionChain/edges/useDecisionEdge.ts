import { useEdge } from "@thinairthings/react-nodegraph";
import { useOpenai } from "../../../clients/OpenAi/useOpenai";
import { DecisionChain } from "../DecisionChain";



export const useDecisionEdge = (
    decisionChainInput: Parameters<typeof DecisionChain>[0]['decisionChainInput'] 
) => {
    const openai = useOpenai()
    // Decision Ai
    const [NextNodes] = useEdge(async ([inputNode]) => {
        switch(inputNode.type) {
            case 'root': {
                
            }
            case 'functionResult': {

            }
        }

    }, [decisionChainInput])
}