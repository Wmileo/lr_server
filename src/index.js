import Server from './Server.js'

export { default as Handle } from './handle/Handle.js'
export { default as Delegate } from './Delegate.js'
export { default as Auth } from './handle/Auth.js'

let GlobalFetch = null // 必须配置

export function setupFetch(Fetch) {
  GlobalFetch = Fetch
}

export function createServer(Handle) {
  return new Server(GlobalFetch, Handle)
}
