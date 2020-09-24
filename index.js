import auth from './src/auth'
import http from './src/http'

let apiBuilder = {
  get: (path) => {
    return {method: 'get', path, type: 'request'}
  },
  post: (path) => {
    return {method: 'post', path, type: 'request'}
  },
  download: (path, method = 'post') => {
    return {method, path, type: 'download'}
  },
  upload: (path, method = 'post') => {
    return {method, path, type: 'upload'}
  }
}

function fetchs(apis) {
  let fetchs = {}
  for (let key in apis) {
    let api = apis[key]
    fetchs[key] = () => {
      return new http.Fetch(api)
    }
  }
  return fetchs
}

export default {
  config: http.config,
  auth,
  apiBuilder,
  fetchs
}


