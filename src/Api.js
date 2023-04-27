import lr from '@lr17/lr'

class Api {
  constructor(path) {
    this.url = '' // unimplemented
    this.globalData = {} // unimplemented
    this.globalHeaders = {} // unimplemented

    this.path = path
    this.method = 'get'
    this.type = 'request'
    this.timeout = 8000
    this.skip = [] // auth config
    this.tags = []

    // 参数
    this.query = null
    this.data = null
    this.isSame = false

    // 缓存
    this.isCache = true
    this.resErr = null
    this.resStr = null
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
  bindMethod(method) {
    return (this.method = method) && this
  } // get post put delete patch
  bindType(type) {
    return (this.type = type) && this
  } // request download upload

  setQuery(data) {
    this.query = data
  }

  getData() {
    let data = { ...this.data, ...this.globalData }
    if (this.isFormData) {
      let formData = new FormData()
      for (let k in data) {
        formData.append(k, data[k])
      }
      return formData
    }
    return data
  }

  getHeaders() {
    return { ...this.headers, ...this.globalHeaders }
  }

  setData(data) {
    this.isSame = true
    let newStr = data ? JSON.stringify(data) : null
    if (newStr != this.oldStr) {
      this.resErr = null
      this.resStr = null
      this.isSame = false
    }
    this.oldStr = newStr

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
    this.headers = this.fetcher.handle.auth?.header(this.path, this.needAuth) // ～～～
    this.data =
      toString.call(data).slice(8, -1) == 'Object' ? { ...data } : data || {}
  }

  setFetcher(fetcher) {
    this.fetcher = fetcher
  }

  fetch(data) {
    this.setData(data)
    if (this.isSame && this.fetching) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          this.fetch(data).then(resolve, reject)
        }, 200)
      })
    } else {
      this.fetching = true
      return new Promise((resolve, reject) => {
        // 加入宏观任务
        setTimeout(() =>
          this.fetcher
            .fetch(this)
            .then(resolve, reject)
            .finally(() => (this.fetching = false))
        )
      })
    }
  }
}

export default Api
