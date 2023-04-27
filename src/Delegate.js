class Delegate {
  constructor() {}

  // unimplemented 处理每个请求前的前置配置
  config() {
    return Promise.resolve()
  }

  // unimplemented 处理请求的前置鉴权动作
  auth() {
    return Promise.reject(new Error('暂无自动授权操作'))
  }

  // unimplemented 处理成功请求
  onSuccess(data, api) {}

  // unimplemented 处理失败请求
  onError(err, api) {}
}

export default Delegate
