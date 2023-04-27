import Handle from '../src/handle/Handle.js'
import TestAuth from './TestAuth.js'

class TestHandle extends Handle {
  constructor(delegate) {
    super(delegate)
    super.setup(TestAuth, true)
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

export default TestHandle
