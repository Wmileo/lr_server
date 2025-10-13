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

  getRequestContext(data) {
    // 创建请求上下文，包含需要隔离的关键参数
    const context = {
      data: { ...(data ?? {}) },
      reqPath: this.path
    }

    // 处理路径参数替换
    if (this.path.indexOf('{') > 0 || this.path.indexOf('[') > 0) {
      // 拼接参数
      for (let k in data) {
        context.reqPath = context.reqPath.replace(`{${k}}`, data[k])
        context.reqPath = context.reqPath.replace(`[${k}]`, data[k])
      }
    }

    // 处理query参数
    if (this.query) {
      // 拼接 query - 简化处理，直接拼接
      const queryString = Object.keys(this.query)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(this.query[key])}`)
        .join('&')
      context.reqPath += (context.reqPath.includes('?') ? '&' : '?') + queryString
    }

    return context
  }
}

export default Api
