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
    let func = () => (this.isSuccess(res) || res.success ? this.success(res) : this.fail(res))
    if (this.auth) {
      return this.auth.checkResponse(res, this.delegate).then((type) => {
        // type 1 不需要授权 0 需要授权并已发起授权成功（需重新发起请求）
        return type == 1 ? func() : api.fetch(data)
      })
    } else {
      if (Object.prototype.toString.call(res).indexOf('Error') >= 0) throw res
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
    throw err
  }
}

export default Handle
