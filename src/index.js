import DtAuth from '../dt/DtAuth.js';
import DtHandle from '../dt/DtHandle.js';
import Fetch from '../base/Fetch.js'
import dt from '@dt/dt'

let apiBuilder = {
  get: (path, auth = true, config = true) => {
    return {
      method: 'get',
      path,
      type: 'request',
      auth,
      config
    }
  },
  post: (path, auth = true, config = true) => {
    return {
      method: 'post',
      path,
      type: 'request',
      auth,
      config
    }
  },
  put: (path, auth = true, config = true) => {
    return {
      method: 'put',
      path,
      type: 'request',
      auth,
      config
    }
  },
  del: (path, auth = true, config = true) => {
    return {
      method: 'delete',
      path,
      type: 'request',
      auth,
      config
    }
  },
  patch: (path, auth = true, config = true) => {
    return {
      method: 'patch',
      path,
      type: 'request',
      auth,
      config
    }
  },
  download: (path, method = 'post', auth = true, config = true) => {
    return {
      method,
      path,
      type: 'download',
      auth,
      config
    }
  },
  upload: (path, method = 'post', auth = true, config = true) => {
    return {
      method,
      path,
      type: 'upload',
      auth,
      config
    }
  }
}

function builders(apis, extras) {
  let bs = {}
  for (let key in apis) {
    bs[key] = () => {
      let handle = new DtHandle(new DtAuth())
      return new Fetch({
        ...apis[key],
        ...extras
      }, handle)
    }
  }
  return bs
}

dt.fetch = {}

function setFetchs(fs, ext) {
  for (let key in fs) {
    const apis = fs[key]
    if (!dt.fetch[key]) {
      dt.fetch[key] = {}
    }
    Object.assign(dt.fetch[key], builders(apis, ext))
  }
}

export default {
  // auth: {
  //   setInfo(info, server){
  //     serverMgr.get(server).auth.setInfo(info)
  //   }
  // },
  setFetchs,
  apiBuilder,
}

// function code(obj) {
//   return {
//     object() {
//       return obj
//     },
//     value(key) {
//       return obj[key]
//     },
//     array(keys, key = 'key', value = 'value') {
//       let arr = []
//       let ks = keys || Object.keys(obj)
//       let isKeyNum = obj['__keytype__'] == 'number'
//       for (let k of ks) {
//         if (k == '__keytype__') {
//           continue
//         }
//         let data = {}
//         data[key] = isKeyNum ? Number(k) : k
//         data[value] = obj[k]
//         arr.push(data)
//       }
//       return arr
//     }
//   }
// }

// $code = {}

// function setCodes(cs) {
//   for (let key in cs) {
//     let cds = cs[key]
//     if (!$code[key]) {
//       $code[key] = {}
//     }
//     for (let k of Object.keys(cds)) {
//       cds[k] = code(cds[k])
//     }
//     Object.assign($code[key], cds)
//   }
// }


