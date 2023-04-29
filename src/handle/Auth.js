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

  checkResponse(res, api, data, delegate) {
    let isError = Object.prototype.toString.call(res).indexOf('Error') >= 0
    if (this.needAuth(res, isError)) {
      return delegate.auth().then(() => api.fetch(data))
    } else if (this.needRefresh(res, isError)) {
      return delegate.refreshAuth().then(() => api.fetch(data))
    } else {
      return res
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

  // unimplemented
  header(api) {
    return {}
  }

  // unimplemented
  needHandle(api) {
    return false
  }

  needAuth(res, isError) {
    return false
  }

  needRefresh(res, isError) {
    return false
  }
}

export default Auth
