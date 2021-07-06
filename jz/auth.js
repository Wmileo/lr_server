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

function guid(key = 'xxyxxxxxx4xxxyxx') {
  let udid = $storage._get('jz_udid')
  if (udid) {
    return udid
  }
  udid = key.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
  $storage._set('jz_udid', udid)
  return udid
}


function headerInfo(need) {
  let udid = guid()
  let requestid = guid('xxyxxxyxx4xxx6xx')
  let appkey = guid('xx3xxxyxx4xxxyxx')
  return {
    udid,
    requestid,
    appkey,
    server: 'jz'
  }
}

function needAuth(need) {
  return false
}

export default {
  setInfo,
  headerInfo,
  clear,
  needAuth,
  guid
}
