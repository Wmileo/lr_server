let isUni = typeof(uni) != 'undefined'
const kAuthInfo = 'xq_auth_info'

let data = isUni ? uni.getStorageSync(kAuthInfo) : window.localStorage.getItem(kAuthInfo)
let authInfo = null
try {
  authInfo = JSON.parse(data)
} catch (e) {
  console.warn('本地授权数据出错', data)
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

function headerInfo(path) {
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
  needAuth
}
