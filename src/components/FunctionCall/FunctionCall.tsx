import { FC } from "react";
import { useFunctionCall } from "./hooks/useFunctionCall";
import { useNode } from "@thinairthings/react-nodegraph";



export const FunctionCall: FC<{
    context: {
        prompt: string,
        previousFunction?: {
            result: any
            outputForm: string
        }
    },
    fn: (input: any)=>any
}> = ({
    context,
    fn
}) => {
    /*
    * Check input form to see if it matches output form. If not, transform it.
    */
    
    // const 
    const functionResult = useFunctionCall({
        context: context.prompt,
        fn
    }, {
        pending: () => console.log("Running Function Call"),
    })
    // Handle what to do next
    // Run Next Steps node with defined set of possible branches.
    const [NextNodes] = useNode(async ([result]) => {
        // Run Decision Ai injecting result and context
        return [
            () => <FunctionCall
                context={context}
                fn={fn}
            />,
            () => <></>
        ]
    },[functionResult])
    return <>
        {NextNodes.type === "success" && NextNodes.next.map(
            (NextNode, i) => <NextNode key={i} />
        )}
    </>
}