import { FC } from "react"
import { DepthContext, useDepth } from "../RootThought/RootThought"
import { useProcessChain } from "../ProcessChain/useProcessChain.ai"


export const ThoughtNode: FC<{rawEdge: Parameters<typeof useProcessChain>[0]}> = ({
    rawEdge
}) => {
    const depth = useDepth()
    const nextNodes = useProcessChain(rawEdge)
    // Decision
    return <DepthContext.Provider value={depth+1}>

    </DepthContext.Provider>
}