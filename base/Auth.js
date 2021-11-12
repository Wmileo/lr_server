import lr from '@lr17/lr';
import Delegate from './Delegate'

class Auth {
  
  constructor(key, delegate = new Delegate()) {
    this.authKey = key
    this.info = lr.storage.get(this.authKey)
    this.delegate = delegate
  }
  
  setInfo(info) {
    this.info = info
    lr.storage.set(this.authKey, info)
  }
  
  clear() {
    this.info = null
    lr.storage.remove(this.authKey)
  }
  
  do() {
    return this.delegate.auth()
  }
  
  // unimplemented
  header(path, need) {
    return {}
  }
  
  // unimplemented
  need(path, need) {
    return false
  }
  
}

export default Auth