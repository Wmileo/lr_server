import Server from './Server.js'

let GlobalFetch = null // 必须配置

export function setupFetch(Fetch) {
  GlobalFetch = Fetch
}

export function createServer(Api, Handle) {
  return new Server(GlobalFetch, Api, Handle)
}
