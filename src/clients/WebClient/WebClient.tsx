

import { FC, forwardRef, useImperativeHandle } from "react";
import { SocketioChannelCommandClient } from "@thinairthings/websocket-server";
import { useWebClient } from "./hooks/useWebClient";
import { Updater } from "use-immer";

export const WebClient = forwardRef<
    SocketioChannelCommandClient,{
    setPromptQueue: Updater<Array<string>>
}>(({setPromptQueue}, forwardRef) => {
    // Refs
    const webClient = useWebClient(setPromptQueue)
    useImperativeHandle(forwardRef, () => webClient, [])
    return <></>
})