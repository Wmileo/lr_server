class Config {
  constructor(need) {
    this.isConfig = !need
  }
  
  // unimplemented
  do() {
    this.finish()
    return Promise.resolve()
  }
  
  finish() {
    this.isConfig = true
  }
  
  // unimplemented
  need(path, need) {
    return !this.isConfig && need
  }
  
}

export default Config
