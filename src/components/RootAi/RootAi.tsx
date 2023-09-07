import { FC } from "react";
import { LiveblocksNodeRoomProvider } from "@thinairthings/liveblocks-model";
import { OpenaiProvider } from "../../clients/OpenAi/OpenAiProvider";
import { AirNode } from "@thinairthings/react-nodegraph";
import { Resolution } from "../Resolution/Resolution";


export type RootNode = AirNode<{
    initialPrompt: string
}, 'RootNode'>

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
                {() => <Resolution input={{
                    type: 'ResolutionInputNode',
                    state: 'success',
                    value: {
                        initialPrompt: rawInput
                    }
                }} />}
            </LiveblocksNodeRoomProvider>
        </OpenaiProvider>
    </>
}


