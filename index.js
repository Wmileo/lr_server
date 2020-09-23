import auth from './src/auth'
import http from './src/http'

function fetchs (params) {
  let fetchs = {}
  for (let key in params) {
    let param = params[key]
    let fetch = new http.Fetch(param)
    fetchs[key] = fetch
  }
  return fetchs
}

let param = {
  get: (path) => {
    return {method: 'get', path}
  },
  post: (path) => {
    return {method: 'post', path}
  }
}

export default {
  config: http.config,
  auth,
  fetchs,
  param
}