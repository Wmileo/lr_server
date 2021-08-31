class Delegate {
  constructor() {
  }
  
  // unimplemented
  config() {
    return Promise.resolve()
  }
  
  // unimplemented
  auth() {
    return Promise.reject(new Error('暂无自动授权操作'))
  }
  
  // unimplemented
  onSuccess(data, api) {
  }
  
  // unimplemented
  onError(err, api) {
  }
}

export default Delegate