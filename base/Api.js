class Api {
  constructor(fetchHelper) {
    this.method = 'get'
    this.path = ''
    this.type = 'request'
    this.needAuth = true
    this.needConfig = true
    this.url = ''
    this.fetchHelper = fetchHelper
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
  
  fixPath(data) {
    if (this.path.indexOf('[') > 0) {
      let path = this.path
      for (let k in data) {
        path = path.replace(`[${k}]`, data[k])
      }
      this.reqPath = path
      this.reqUrl = this.url + this.reqPath
    } else {
      this.reqPath = this.path //实际路径path
      this.reqUrl = this.url + this.reqPath //全路径url
    }
  }
  
  fetch(data, opt) {
    return this.fetchHelper.fetch(this, data, opt)
  }
  
}

export default Api