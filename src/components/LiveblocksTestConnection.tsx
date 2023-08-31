import { useStorage } from "@thinairthings/liveblocks-model"


export const LiveblocksTestConnection = () => {
    const data = useStorage(root => {
        console.log("Here")
        console.log(root)
        return root
    })
    console.log(data)
    return <></>
}