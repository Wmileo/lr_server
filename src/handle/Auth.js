import lr from '@lr17/lr'

class Auth {
  constructor(key, cache = 'storage') {
    this.authKey = key
    this.cache = cache == 'storage' ? lr.storage : lr.session
    this.info = this.cache.get(this.authKey)
  }

  check(api, delegate) {
    let need = api.skip.indexOf('auth') >= 0
    if (this.need(api.path) && !this.info && need) {
      return delegate.auth()
    } else {
      return Promise.resolve(1)
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
  header(path, need) {
    return {}
  }

  // unimplemented
  need(path) {
    return false
  }
}

export default Auth
