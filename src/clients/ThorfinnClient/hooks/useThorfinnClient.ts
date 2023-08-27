import { SocketioChannelCommandClient } from "@thinairthings/websocket-server"
import { useRef } from "react"
import { socketioServer } from "../../../main"


export const useThorfinnClient = () => {
    return useRef<SocketioChannelCommandClient>(new SocketioChannelCommandClient(
        socketioServer.createChannel('thorfinn', {
            connectionHandler: () => {
                console.log("Connected to Thorfinn Client")
            }
        })
    )).current
}