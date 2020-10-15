import auth from './src/auth'
import http from './src/http'
import img from './src/image.js'

let apiBuilder = {
  get: (path) => {
    return { method: 'get', path, type: 'request' }
  },
  post: (path) => {
    return { method: 'post', path, type: 'request' }
  },
  put: (path) => {
    return { method: 'put', path, type: 'request' }
  },
  del: (path) => {
    return { method: 'delete', path, type: 'request' }
  },
  download: (path, method = 'post') => {
    return { method, path, type: 'download' }
  },
  upload: (path, method = 'post') => {
    return { method, path, type: 'upload' }
  },
  builders: (apis, extras) => {
    let bs = {}
    for (let key in apis) {
      bs[key] = () => {
        return new http.Fetch({
          ...apis[key],
          ...extras
        })
      }
    }
    return bs
  }
}

let config = {
  ...http.config,
  setImageURL: (url) => {
    img.setURL(url)
  }
}

function image(path) {
  return img.path(path)
}

export default {
  config,
  auth,
  apiBuilder,
  image
}
