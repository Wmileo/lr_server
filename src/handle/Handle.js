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

  response(status, res, api, data) {
    let func = () => {
      if (status != 200) return Promise.reject(res)
      if (api.type == 'download') return Promise.resolve(res)
      return this.isSuccess(res) || res.success ? this.success(res) : this.fail(res)
    }
    if (this.auth) {
      return this.auth.checkResponse(this.delegate, status, res).then((type) => {
        // type 1 不需要授权 0 需要授权并已发起授权成功（需重新发起请求）
        if (type == 1) return func()
        else {
          api.fetching = false
          return api.fetch(data)
        }
      })
    } else {
      return func()
    }
  }

  // 判断业务请求是否成功，并按需要处理数据
  isSuccess(res) {
    return true
  }

  success(res) {
    return Promise.resolve(res)
  }

  fail(res) {
    let err = new Error()
    Object.assign(err, res)
    return Promise.reject(err)
  }
}

export default Handle
