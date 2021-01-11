import auth from './auth'
import http from './http'

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
  patch: (path) => {
    return { method: 'patch', path, type: 'request' }
  },
  download: (path, method = 'post') => {
    return { method, path, type: 'download' }
  },
  upload: (path, method = 'post') => {
    return { method, path, type: 'upload' }
  }
}

function builders(apis, extras) {
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

let config = {
  ...http.config
}

let fets = {}

function setFetchs(fs, ext) {
  for (let key in fs) {
  	const apis = fs[key]
    if (!fets[key]) {
      fets[key] = {}
    }
    Object.assign(fets[key], builders(apis, ext))
  }
  console.log("fetchs :", fets)
}

let codes = {}

function setCodes(cs) {
  
}

export default {
  config,
  auth,
  apiBuilder,
  setFetchs,
  setCodes
}

export let fetchs = fets
export let fetchCode = codes
