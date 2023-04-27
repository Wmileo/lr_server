import Config from './Config.js'

class Handle {
  constructor(delegate) {
    this.delegate = delegate
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

  // 处理请求后response
  response(res) {
    return this.data(res.data)
  }

  // 处理返回数据
  data(data) {
    return data
  }

  // 处理返回错误
  err(err) {
    return err
  }
}

export default Handle
