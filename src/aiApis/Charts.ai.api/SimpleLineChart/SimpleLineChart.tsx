import { useNode } from "@thinairthings/react-nodegraph";
import { FC } from "react";



export const SimpleLineChart: FC<{prompt: string}> = (
    {prompt}
) => {
    const [ChartDataGeneratorEdge] = useNode(async () => {
        // Decide where to get data from
        
        return () => <></>
    },[])

}