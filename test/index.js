import { createServer, setupFetch } from '../src/index.js'
import TestDelegate from './TestDelegate.js'
import TestHandle from './TestHandle.js'
import NodeFetch from '../src/fetch/NodeFetch.js'

setupFetch(NodeFetch)
const server = createServer(TestHandle)
server.setup(TestDelegate)

let api = server.post('').bindTimeout(1000)
api.fetch({ kk: 'kk' })
