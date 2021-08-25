import Auth from '../base/Auth.js';
import Delegate from '../base/Delegate.js'

class DtAuth extends Auth {
  constructor(delegate = new Delegate()) {
    super('dt_auth', delegate)
  }

  header(path, need) {
    return this.need(path, need) ? this.info || {} : {}
  }
  
  need(path, need) {
    return path.indexOf('/noToken/') < 0 && need
  }
}

export default DtAuth