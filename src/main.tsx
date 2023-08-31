import React from 'react'
import {render} from 'react-nil'
import { createServer } from 'http'
import { SocketioServer } from '@thinairthings/websocket-server'
import { enableMapSet } from 'immer'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { RootAi } from './components/RootAi/RootAi'

enableMapSet()
const httpServer = createServer()
export const socketioServer = new SocketioServer(httpServer, {})
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);
render (
    <RootAi
        userId="777"
        spaceId="777"
        rawInput='I want to see the data for Apple from 2011 to 2012 on a daily bar chart.'
    />
)

httpServer.listen(3001, () => {
    console.log('listening on port 3001')
})
