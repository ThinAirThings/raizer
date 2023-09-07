import {render} from 'react-nil'
import { createServer } from 'http'
import { SocketioServer } from '@thinairthings/websocket-server'
import { enableMapSet } from 'immer'
import { RootAi } from './components/RootAi/RootAi'
import { jsonStructureFromAirNode } from '@thinairthings/ts-ai-api'

enableMapSet()
const httpServer = createServer()
export const socketioServer = new SocketioServer(httpServer, {})
render (
    <RootAi
        userId="777"
        spaceId="777"
        rawInput='Show me daily data for Apple opening prices from April 2023 - July 2023.'
    />
)

httpServer.listen(3001, () => {
    console.log('listening on port 3001')
})
