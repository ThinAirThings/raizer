import { FC } from "react";
import { Edge } from "@thinairthings/react-nodegraph"
import { OpenAiProvider } from "../../clients/OpenAi/OpenAiProvider";
import { ThoughtNode } from "../ThoughtNode/ThoughtNode";
import { LiveblocksRoomProvider } from "@thinairthings/liveblocks-model";
import { LiveblocksTestConnection } from "../LiveblocksTestConnection";


export const RootAi: FC<{
    userId: string
    spaceId: string
    rawInput: string
}> = ({
    userId,
    spaceId,
    rawInput
}) => {
    return <>
        <OpenAiProvider>
            <LiveblocksRoomProvider
                userId={userId}
                spaceId={spaceId}
                serverName={`aiNode-${userId}-${spaceId}`}
            >
                <LiveblocksTestConnection/>
                {/* <ThoughtNode
                    rawInputEdge={rawInputEdge}
                /> */}
            </LiveblocksRoomProvider>
        </OpenAiProvider>
    </>
}


