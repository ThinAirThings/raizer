import { FC } from "react";
import { LiveblocksNodeRoomProvider } from "@thinairthings/liveblocks-model";
import { OpenaiProvider } from "../../clients/OpenAi/OpenAiProvider";
import { AirNode, nodeFromValue } from "@thinairthings/react-nodegraph";
import { Resolution } from "../Resolution/Resolution";
import { PolygonProvider } from "../../clients/Polygon/PolygonProvider";


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
        <PolygonProvider>
            <LiveblocksNodeRoomProvider
                userId={userId}
                spaceId={spaceId}
                serverName={`aiNode-${userId}-${spaceId}`}
            >
                {() => <Resolution input={nodeFromValue({
                            initialPrompt: rawInput
                        }, 'ResolutionInputNode')} 
                />}
            </LiveblocksNodeRoomProvider>
        </PolygonProvider>
        </OpenaiProvider>
    </>
}


