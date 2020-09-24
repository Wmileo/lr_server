let isUni = typeof(uni) != 'undefined'
const kAuthInfo = 'xq_auth_info'

let data = isUni ? uni.getStorageSync(kAuthInfo) : window.localStorage.getItem(kAuthInfo)
let authInfo = JSON.parse(data)

function setInfo(info) {
  authInfo = info
  let data = JSON.stringify(info)
  let key = kAuthInfo
  if (isUni) {
    uni.setStorage({key, data})
    console.log('uni add')
  } else {
    new Promise(() => {
      window.localStorage.setItem(key, data)
    })
  }
}

function clear() {
  authInfo = null
  let key = kAuthInfo
  if (isUni) {
    uni.removeStorage({key})
    console.log('uni remove')
  } else {
    new Promise(() => {
      window.localStorage.removeItem(key)
    })
  }
}

let list = []

function headerInfo (path) {
  return list.indexOf(path) == -1 ? authInfo : {}
}

let passList = {
  push: (path) => {
    if (list.indexOf(path) == -1) {
      list.push(path)
    }
  }
}

export default {
  setInfo,
  headerInfo,
  clear,
  passList
}

