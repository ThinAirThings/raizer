import { FC } from "react";
import { useProcessChain } from "../ProcessChain/useProcessChain.ai";

export const ResearchNode: FC<{rawEdge: Parameters<typeof useProcessChain>[0]}> = ({
    rawEdge
}) => {
    const nextNodes = useProcessChain(rawEdge, )
}