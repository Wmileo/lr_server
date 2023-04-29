import Handle from '../src/handle/Handle.js'
import TestAuth from './TestAuth.js'

class TestHandle extends Handle {
  constructor(delegate) {
    super(delegate)
    super.setup(TestAuth, true)
    this.url = 'https://www.baidu.com'
    this.globalData = { aaa: 'llll' }
    this.globalHeaders = { kkk: 'oooo' }
  }

  // 处理请求前request
  request(req) {
    return req
  }

  // 处理返回数据
  data(data, isObject) {
    return data
  }
}

export default TestHandle
