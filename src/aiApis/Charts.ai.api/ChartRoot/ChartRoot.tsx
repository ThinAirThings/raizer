import { useNode } from "@thinairthings/react-nodegraph";
import { FC } from "react";




// Argument is Components are their own root node
export const ChartRoot: FC<{prompt: string}> = (
    {prompt}
) => {
    const [ChartTypeEdge] = useNode(async () => {
        // Decide which chart type to use
        return () => <ChartType
            prompt={prompt}   
        />
    }, [])
    if (ChartTypeEdge.type !== "success") return null
    return <ChartTypeEdge.next/>
}