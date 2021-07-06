let isUni = typeof(uni) != 'undefined'
const kAuthInfo = 'xq_auth_info'

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

function headerInfo(need) {
  let header = need ? authInfo : {}
  return {'server': 'xq', ...header}
}

function needAuth(need) {
  return !authInfo && need
}

export default {
  setInfo,
  headerInfo,
  clear,
  needAuth
}
