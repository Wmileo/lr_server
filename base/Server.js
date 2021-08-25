import Fetch from './Fetch.js'

class Server {
  
  constructor(Handle, Auth, Config) {
    this.auth = new Auth()
    if (Config) {
      this.config = new Config()
    }
    this.handle = new Handle(this.auth, this.config)
  }
  
  delegate(Delegate) {
    this.delegate = new Delegate()
    this.auth.delegate = this.delegate
    this.config.delegate = this.delegate
    this.handle.delegate = this.delegate
  }
  
  fetch(api) {
    return new Fetch(api, this.handle)
  }
}

export default Server