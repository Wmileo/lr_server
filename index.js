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
  },
  build: (api) => {
    return () => {
      return new http.Fetch(api)
    }
  }
}

export default {
  config: http.config,
  auth,
  apiBuilder
}


