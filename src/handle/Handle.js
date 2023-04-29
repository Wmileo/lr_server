import Config from './Config.js'

class Handle {
  constructor(delegate) {
    this.delegate = delegate

    this.url = '' // unimplemented
    this.globalData = {} // unimplemented
    this.globalHeaders = {} // unimplemented
  }

  // 初始化 auth, config
  setup(Auth, needConfig) {
    if (Auth) {
      this.auth = new Auth()
    }
    if (needConfig) {
      this.config = new Config()
    }
  }

  before(api) {
    if (this.auth) {
      return this.auth.check(api, this.delegate).then(() => {
        if (this.config) {
          return this.config.check(api, this.delegate)
        }
        return 1
      })
    } else if (this.config) {
      return this.config.check(api, this.delegate)
    } else {
      return Promise.resolve(1)
    }
  }

  // 处理请求前request
  request(req) {
    return req
  }

  response(res, api, data) {
    let isObject = typeof res == 'object'
    if (this.auth && isObject) {
      return this.auth.checkResponse(res, api, data, this.delegate).then((res) => this.data(res, true))
    } else {
      if (Object.prototype.toString.call(res).indexOf('Error') >= 0) throw res
      return this.data(res, isObject)
    }
  }

  // 处理返回数据
  data(res, isObject) {
    return Promise.resolve(res)
  }
}

export default Handle
