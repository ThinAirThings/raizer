import { FC } from "react";
import { LiveblocksNodeRoomProvider } from "@thinairthings/liveblocks-model";
import { OpenaiProvider } from "../../clients/OpenAi/OpenAiProvider";
import { ProcessChain } from "../ProcessChain/ProcessChain";

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
        <OpenaiProvider>
            <LiveblocksNodeRoomProvider
                userId={userId}
                spaceId={spaceId}
                serverName={`aiNode-${userId}-${spaceId}`}
            >
                {() => <ProcessChain prompt={rawInput} />}
            </LiveblocksNodeRoomProvider>
        </OpenaiProvider>
    </>
}


