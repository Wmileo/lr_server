import lr from '@lr17/lr'

class Auth {
  constructor(key, cache = 'storage') {
    this.authKey = key
    this.cache = cache == 'storage' ? lr.storage : lr.session
    this.info = this.cache.get(this.authKey)
  }

  check(api, delegate) {
    let need = api.skip.indexOf('auth') >= 0
    if (this.needHandle(api.path) && !this.info && need) {
      return delegate.auth()
    } else {
      return Promise.resolve(1)
    }
  }

  checkResponse(delegate, status, res) {
    if (this.needAuth(status, res)) {
      return delegate.auth().then(() => 0)
    } else if (this.needRefresh(status, res)) {
      return delegate.refreshAuth().then(() => 0)
    } else {
      return Promise.resolve(1) // 原始数据还需处理下一步
    }
  }

  setInfo(info) {
    this.info = info
    this.cache.set(this.authKey, info)
  }

  clear() {
    this.info = null
    this.cache.remove(this.authKey)
  }

  // 返回授权头
  header(api) {
    return {}
  }

  // 是否需要授权操作
  needHandle(api) {
    return false
  }

  // 是否需要重新授权
  needAuth(status, res) {
    return false
  }
  // 是否需要刷新授权
  needRefresh(status, res) {
    return false
  }
}

export default Auth
