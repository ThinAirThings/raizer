import { useErrorListener, useLostConnectionListener, useStatus, useStorage } from "@thinairthings/liveblocks-model"


export const LiveblocksTestConnection = () => {
    useErrorListener(error => {
        console.log(error)
    })
    useLostConnectionListener((event) => {
        console.log(event)
    })
    const data = useStorage(root => {
        console.log("Here")
        console.log(root)
        return root
    })
    return <></>
}