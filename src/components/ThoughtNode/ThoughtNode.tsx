import { FC } from "react"
import { useProcessChain } from "../ProcessChain/useProcessChain.ai"
import { useArgumentParser } from "../hooks/useArgumentParser"


export const ThoughtNode: FC<{rawInputEdge: Parameters<typeof useProcessChain>[0]}> = ({
    rawInputEdge
}) => {
    const nextNodes = useArgumentParser({
        type: "success",
        value: {
            functionName: "getStockData",
            argumentsEncoding: 'I want to see the data for Nvidia from the beginning of 2022 to the middle of it on a daily bar chart.'
        }
    })
    // Decision
    return <></>
}