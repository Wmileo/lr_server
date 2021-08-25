import dt from '@dt/dt';

class Auth {
  
  constructor(key) {
    this.authKey = key
    this.info = dt.storage.get(this.authKey)
  }
  
  setInfo(info) {
    this.info = info
    dt.storage.set(this.authKey, info)
  }
  
  clear() {
    this.info = null
    dt.storage.remove(this.authKey)
  }
  
  // unimplemented
  do() {
    return Promise.reject(new Error('暂无自动授权操作'))
  }
  
  // unimplemented
  header(path, need) {
    return {}
  }
  
  // unimplemented
  need(path, need) {
    return false
  }
  
}

export default Auth