import Server from '../src/Server.js'
import TestApi from './TestApi.js'
import TestDelegate from './TestDelegate.js'
import TestHandle from './TestHandle.js'
import NodeFetch from '../src/fetch/NodeFetch.js'

const server = new Server({
  Api: TestApi,
  Handle: TestHandle,
  Fetch: NodeFetch
})
server.setDelegate(new TestDelegate())

let api = server.get('path')
api.fetch({ kk: 'kk' })
