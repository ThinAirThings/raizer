import { AirNode, NodeValue, useEdge } from "@thinairthings/react-nodegraph";
import { RootNode } from "../RootAi/RootAi";
import { AirNodeTypes } from "../AiNodeUnion";



export const DecisionChain = ({
    decisionChainInput
}: {
    decisionChainInput: (
        | AirNodeTypes&{type: 'root'|'functionResult'}
    )
}) => {

    // Decision Ai
    const [NextNodes] = useEdge(async ([inputNode]) => {
        if (inputNode.type === 'root') {

        }
    }, [decisionChainInput])
    return <>
        {/* {NextNodes.state === "success" && NextNodes.value.map(
            (NextNode, i) => <NextNode key={i} />
        )} */}
    </>
}