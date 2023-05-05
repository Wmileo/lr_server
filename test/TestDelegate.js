import Delegate from '../src/Delegate.js'
import TestAuth from './TestAuth.js'

class TestDelegate extends Delegate {
  constructor() {
    super()
  }

  // unimplemented 处理每个请求前的前置配置
  config() {
    return Promise.resolve()
  }

  // unimplemented 处理请求的前置鉴权动作
  auth() {
    return Promise.reject(new Error('暂无自动授权操作'))
  }

  // unimplemented 处理请求授权失效的情况
  refreshAuth() {
    return Promise.reject(new Error('暂无自动刷新授权操作'))
  }

  // unimplemented 处理成功请求
  onSuccess(data, api) {
    console.log('success')
  }

  // unimplemented 处理失败请求
  onError(err, api) {
    console.log('error')
  }
}
export default TestDelegate
