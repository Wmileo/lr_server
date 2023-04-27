class Fetch {
  constructor(handle) {
    this.handle = handle
    this.fly = null // 子类赋值
    this.setupFly()
  }

  // unimplemented
  setupFly() {}

  fetch(api) {
    if (api.resStr) {
      // 频繁请求返回上次结果
      let res = JSON.parse(api.resStr)
      this.handle.delegate.onSuccess(res, api)
      return Promise.resolve(res)
    } else if (api.resErr) {
      // 频繁请求返回上次结果
      this.handle.delegate.onError(api.resErr, api)
      return Promise.reject(api.resErr)
    } else {
      return this.handle.before(api).then(() => {
        return this[api.type](api)
          .then((res) => {
            if (api.isCache) {
              api.resStr = JSON.stringify(res)
              setTimeout(() => (api.resStr = null), 1500)
            }
            this.handle.delegate.onSuccess(res, api)
            return res
          })
          .catch((err) => {
            if (api.isCache) {
              api.resErr = err
              setTimeout(() => (api.resErr = null), 1500)
            }
            this.handle.delegate.onError(err, api)
            throw err
          })
      })
    }
  }

  // 请求
  request(api, opt) {
    return this.fly[api.method](api.reqPath, api.getData(), {
      ...opt,
      baseURL: api.url,
      headers: api.getHeaders(),
      timeout: api.timeout
    })
  }

  // unimplemented
  download(api) {
    return this.request(api)
  }

  // unimplemented
  upload(api) {
    return this.request(api)
  }
}

export default Fetch
