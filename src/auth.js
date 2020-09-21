import storage from '@/utils/storage'
import params from '@/server/params'

const Key_AuthInfo = 'xq_auth_info'
let authInfo = storage.get(Key_AuthInfo)

console.log('aaaaa', uni)



function setInfo(info) {
  authInfo = info
  storage.set(Key_AuthInfo, info)
}

function getInfo() {
  return authInfo
}

function clear() {
  authInfo = null
  storage.remove(Key_AuthInfo)
}

function passList() {
  return [params.user.login.path]
}

export default {
  setInfo,
  getInfo,
  clear,
  passList
}

