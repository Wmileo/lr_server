class Api {
  constructor(fetch) {
    this.method = 'get'
    this.type = 'request'
    this.needAuth = true
    this.needConfig = true
    this.url = ''// unimplemented
    
    this.fetchHelper = fetch
    this.authHelper = fetch.handle.auth
    this.delegateHelper = this.authHelper.delegate
  }
  
  auth(need) {
    this.needAuth = need
    return this
  }
  
  config(need) {
    this.needConfig = need
    return this
  }
  
  tag(tag) {
    this.tag = tag
    return this
  }
  
  error(tag) {
    this.errTag = tag
    return this
  }
  
  get(path) {
    this.path = path
    return this
  }
  
  post(path) {
    this.method = 'post'
    this.path = path
    return this
  }
  
  put(path) {
    this.method = 'put'
    this.path = path
    return this
  }
  
  delete(path) {
    this.method = 'delete'
    this.path = path
    return this
  }
  
  patch(path) {
    this.method = 'patch'
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
  
  setData(data, opt) {
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
    this.headers = this.authHelper.header(this.path, this.needAuth)
    this.data = data || {}
    this.opt = opt
    return this
  }
  
  fetch(data, opt) {
    let same = (!data && !this.oldData) || ((data && this.oldData) && JSON.stringify(data) == JSON.stringify(this.oldData))
    this.oldData = {...data}
    this.setData(data, opt)
    if (same && this.fetchRes) {
      // 频繁请求返回上次结果
      this.delegateHelper.onSuccess(this.fetchRes, this)
      return Promise.resolve(this.fetchRes)
    } else if (same && this.fetchErr) {
      // 频繁请求返回上次结果
      this.delegateHelper.onError(this.fetchErr, this)
      return Promise.reject(this.fetchErr)
    } else if (same && this.fetching) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          this.fetch(data, opt).then(resolve, reject)
        }, 200)
      })
    } else {
      this.fetching = true
      return this.fetchHelper.fetch(this).then(res => {
        this.fetching = false
        this.fetchRes = res
        this.delegateHelper.onSuccess(this.fetchRes, this)
        setTimeout(() => {
          this.fetchRes = null
        }, 1000)
        return res
      }).catch(err => {
        this.fetching = false
        this.fetchErr = err
        this.delegateHelper.onError(this.fetchErr, this)
        setTimeout(() => {
          this.fetchErr = null
        }, 1000)
        throw err
      })
    }
  }
  
}

export default Api