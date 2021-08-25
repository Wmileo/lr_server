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
  onSuccess(data) {
  }
  
  // unimplemented
  onFail(code, message) {
  }
  
  // unimplemented
  onError(err) {
  }
}
export default Delegate