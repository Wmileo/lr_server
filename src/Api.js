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
    this.url = null
    this.query = null
    this.data = null

    // 缓存
    this.isCache = true
  }

  unbindAuth() {
    this.skip.push('auth')
    return this
  }
  unbindConfig() {
    this.skip.push('config')
    return this
  }
  unbindCache() {
    this.isCache = false
    return this
  }
  bindTimeout(timeout) {
    this.timeout = timeout
    return this
  }
  bindTags(tags) {
    this.tags = tags
    return this
  }
  // get post put delete patch
  bindMethod(method) {
    this.method = method
    return this
  }
  // request download upload
  bindType(type) {
    this.type = type
    return this
  }

  bindUrl(url) {
    this.url = url
    return this
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
