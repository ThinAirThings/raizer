import { AirNode, NodeValue, useEdge } from "@thinairthings/react-nodegraph";
import { FunctionCallResultNode } from "../FunctionCallChain/edges/useFunctionCallEdge";
import { RootNode } from "../RootAi/RootAi";



export const DecisionChain = ({
    decisionChainInput
}: {
    decisionChainInput: (
        | RootNode
        | FunctionCallResultNode<any>
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