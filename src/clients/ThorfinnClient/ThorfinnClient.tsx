import { FC, forwardRef, useImperativeHandle } from "react";
import { SocketioChannelCommandClient } from "@thinairthings/websocket-server";
import { useThorfinnClient } from "./hooks/useThorfinnClient";

export const ThorfinnClient = forwardRef<
    SocketioChannelCommandClient,
    {}
>(({}, forwardRef) => {
    const thorfinnClient = useThorfinnClient()
    useImperativeHandle(forwardRef, () => thorfinnClient, [])
    return <></>
})