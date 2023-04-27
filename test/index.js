import Server from '../src/Server.js'
import TestApi from './TestApi.js'
import TestDelegate from './TestDelegate.js'
import TestHandle from './TestHandle.js'
import NodeFetch from '../src/fetch/NodeFetch.js'

const server = new Server(TestApi, TestHandle)
server.setup(NodeFetch, TestDelegate)

let api = server.get('path')
api.fetch({ kk: 'kk' })
