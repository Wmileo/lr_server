import Delegate from './Delegate'

class Config {
  constructor(need, delegate = new Delegate()) {
    this.isConfig = !need
    this.delegate = delegate
  }
  
  do() {
    this.finish()
    return this.delegate.config()
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
