import { SocketioChannelCommandClient } from "@thinairthings/websocket-server"
import { useRef } from "react"
import { socketioServer } from "../../../main"
import { Updater } from "use-immer"




export const useWebClient = (setPromptQueue: Updater<Array<string>>) => {
    return useRef<SocketioChannelCommandClient>((() => {
        const client = new SocketioChannelCommandClient(
            socketioServer.createChannel('webclient', {
                connectionHandler: () => {
                    console.log("WebClient Connected")
                },
                actions: {
                    "rxPrompt": async (payload:{
                        prompt: string
                    }) => {
                        setPromptQueue((queue) => {
                            queue.push(payload.prompt)
                        })
                    }
                }
            })
        )
        return client
    })()).current
}