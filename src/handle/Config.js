class Config {
  constructor() {
    this.isConfig = false
  }
  
  check(api, delegate) {
    let need = api.skip.indexOf('config') >= 0
    if (!this.isConfig && need) {
      return delegate.config().then(res => {
        this.isConfig = true
        return res
      })
    } else {
      return Promise.resolve(1)
    }
  }
}

export default Config
