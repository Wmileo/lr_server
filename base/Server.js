import Fetch from './Fetch.js'

class Server {
  
  constructor(Api, Handle, Auth, Config) {
    this.Api = Api
    this.auth = new Auth()
    if (Config) {
      this.config = new Config()
    }
    this.handle = new Handle(this.auth, this.config)
    this.fetch = new Fetch(this.handle)
  }
  
  config(Config) {
    this.config = new Config()
    this.handle.config = this.config
    return this
  }
  
  delegate(Delegate) {
    this.delegate = new Delegate()
    this.auth.delegate = this.delegate
    if (this.config) {
      this.config.delegate = this.delegate
    }
    this.handle.delegate = this.delegate
  }
  
  api() {
    return new this.Api(this.fetch)
  }
  
}

export default Server