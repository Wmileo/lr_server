let isUni = typeof(uni) != 'undefined'
const kAuthInfo = 'jz_auth_info'

let data = isUni ? uni.getStorageSync(kAuthInfo) : window.localStorage.getItem(kAuthInfo)
let authInfo = null
try {
  authInfo = JSON.parse(data)
} catch (e) {
  console.info('本地暂无有效授权数据', data)
}

function setInfo(info) {
  authInfo = info
  let data = JSON.stringify(info)
  if (data) {
    let key = kAuthInfo
    if (isUni) {
      uni.setStorage({
        key,
        data
      })
    } else {
      new Promise(() => {
        window.localStorage.setItem(key, data)
      })
    }
  } else {
    clear()
  }
}

function clear() {
  authInfo = null
  let key = kAuthInfo
  if (isUni) {
    uni.removeStorage({
      key
    })
  } else {
    new Promise(() => {
      window.localStorage.removeItem(key)
    })
  }
}

let list = []

function guid() {
  let udid = $storage._get('jz_udid')
  if (udid) {
    return udid
  }
  udid = 'xxyxxxxxx4xxxyxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
  $storage._set('jz_udid', udid)
  return udid
}


function headerInfo(path) {
  let udid = guid()
  return {
    udid,
    server: 'jz'
  }
  
  return list.indexOf(path) == -1 ? authInfo : {}
}

let passList = {
  push: (path) => {
    if (list.indexOf(path) == -1) {
      list.push(path)
    }
  }
}

function needAuth(path) {
  return false

  if (path) {
    return !authInfo && list.indexOf(path) == -1
  } else {
    return !authInfo
  }
}

export default {
  setInfo,
  headerInfo,
  clear,
  passList,
  needAuth,
  guid
}
