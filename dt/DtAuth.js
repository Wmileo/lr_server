import Auth from '../base/Auth.js';

class DtAuth extends Auth {
  constructor(delegate) {
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