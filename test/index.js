import { createServer, setupFetch } from '../src/index.js'
import TestApi from './TestApi.js'
import TestDelegate from './TestDelegate.js'
import TestHandle from './TestHandle.js'
import NodeFetch from '../src/fetch/NodeFetch.js'

setupFetch(NodeFetch)
const server = createServer(TestApi, TestHandle)
server.setup(TestDelegate)

let api = server.get('path')
api.fetch({ kk: 'kk' })
