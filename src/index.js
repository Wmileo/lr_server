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

$fetch = {}

function setFetchs(fs, ext) {
  for (let key in fs) {
  	const apis = fs[key]
    if (!$fetch[key]) {
      $fetch[key] = {}
    }
    Object.assign($fetch[key], builders(apis, ext))
  }
}

function code(obj) {
  return {
    object() {
      return obj
    },
    value(key) {
      return obj[key]
    },
    array(keys, key = 'key', value = 'value') {
      let arr = []
      let ks = keys || Object.keys(obj)
      for (let k of ks) {
        arr.push({
          key: k,
          value: obj[k]
        })
      }
      return arr
    }
  }
}

$code = {}

function setCodes(cs) {
  for (let key in cs) {
  	let cds = cs[key]
    if (!$code[key]) {
      $code[key] = {}
    }
    for (let k of Object.keys(cds)) {
      cds[k] = code(cds[k])
    }
    Object.assign($code[key], cds)
  }
}

export default {
  
  config,
  auth,
  apiBuilder,
  
  setFetchs,
  setCodes
}
