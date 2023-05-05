import { Handle } from '../src/index.js'
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

  // 判断业务请求是否成功，并按需要处理数据
  isSuccess(res) {
    return true
  }
}

export default TestHandle
