import {render} from 'react-nil'
import { createServer } from 'http'
import { SocketioServer } from '@thinairthings/websocket-server'
import { enableMapSet } from 'immer'
import { RootAi } from './components/RootAi/RootAi'

enableMapSet()
const httpServer = createServer()
export const socketioServer = new SocketioServer(httpServer, {})
render (
    <RootAi
        userId="777"
        spaceId="777"
        rawInput='I want to see the options data for Nvidia at a strike price of $550 leading up to their earnings call which happened on August 23rd 2023.'
    />
)

httpServer.listen(3001, () => {
    console.log('listening on port 3001')
})
