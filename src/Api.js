import lr from '@lr17/lr'

class Api {
  constructor(path) {
    this.path = path
    this.method = 'get'
    this.type = 'request'
    this.timeout = 8000
    this.skip = [] // auth config
    this.tags = []

    // 参数
    this.query = null
    this.data = null

    // 缓存
    this.isCache = true
  }

  unbindAuth() {
    return this.skip.push('auth') && this
  }
  unbindConfig() {
    return this.skip.push('config') && this
  }
  unbindCache() {
    return (this.isCache = false) && this
  }
  bindTimeout(timeout) {
    return (this.timeout = timeout) && this
  }
  bindTags(tags) {
    return (this.tags = tags) && this
  }
  // get post put delete patch
  bindMethod(method) {
    return (this.method = method) && this
  }
  // request download upload
  bindType(type) {
    return (this.type = type) && this
  }

  setQuery(data) {
    this.query = data
  }

  setData(data) {
    this.reqPath = this.path
    if (this.path.indexOf('{') > 0 || this.path.indexOf('[') > 0) {
      // 拼接参数
      for (let k in data) {
        this.reqPath = this.reqPath.replace(`{${k}}`, data[k])
        this.reqPath = this.reqPath.replace(`[${k}]`, data[k])
      }
    }
    if (this.query) {
      // 拼接 query
      this.reqPath = lr.url.build(this.reqPath, this.query)
    }
    this.data = { ...(data ?? {}) }
  }
}

export default Api
