class Api {
  constructor() {
    this.method = 'get'
    this.path = ''
    this.type = 'request'
    this.needAuth = true
    this.needConfig = true
    this.url = ''
  }
  
  auth(need) {
    this.needAuth = need
    return this
  }
  
  config(need) {
    this.needConfig = need
    return this
  }
  
  get(path) {
    this.method = 'get'
    this.type = 'request'
    this.path = path
    return this
  }
  
  post(path) {
    this.method = 'post'
    this.type = 'request'
    this.path = path
    return this
  }
  
  put(path) {
    this.method = 'put'
    this.type = 'request'
    this.path = path
    return this
  }
  
  delete(path) {
    this.method = 'delete'
    this.type = 'request'
    this.path = path
    return this
  }
  
  patch(path) {
    this.method = 'patch'
    this.type = 'request'
    this.path = path
    return this
  }
  
  download(path, method = 'post') {
    this.method = method
    this.type = 'download'
    this.path = path
    return this
  }
  
  upload(path, method = 'post') {
    this.method = method
    this.type = 'upload'
    this.path = path
    return this
  }
  
}

export default Api