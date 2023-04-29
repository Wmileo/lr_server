class Fetch {
  constructor(handle) {
    this.handle = handle
    this.fly = null // 子类赋值
    this.setupFly()
  }

  // unimplemented
  setupFly() {
    if (!this.fly) {
      console.error('Fetch 参数未正常配置')
      return
    }
    this.fly.interceptors.request.use((request) => {
      return this.handle.request(request)
    })
  }

  bindApi(api) {
    api.fetch = (data) => this.fetchStep1(api, data)
  }

  fetchStep1(api, data) {
    api.isSame = true
    let newStr = data ? JSON.stringify(data) : null
    if (newStr != api.oldStr) {
      api.resErr = null
      api.resStr = null
      api.isSame = false
    }
    api.oldStr = newStr
    api.setData(data)
    // 判断是否相同参数的请求
    if (api.isSame && api.fetching) {
      // 等待请求
      return new Promise((resolve, reject) =>
        setTimeout(() => this.fetchStep1(api, data).then(resolve, reject), 200)
      )
    } else {
      api.fetching = true
      // 加入宏观任务 开始请求
      return new Promise((resolve, reject) =>
        setTimeout(() =>
          this.fetchStep2(api, data)
            .then(resolve, reject)
            .finally(() => (api.fetching = false))
        )
      )
    }
  }

  fetchStep2(api, data) {
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
            return this.handle.response(res, api, data).then((res) => {
              if (api.isCache) {
                api.resStr = JSON.stringify(res)
                setTimeout(() => (api.resStr = null), 1500)
              }
              this.handle.delegate.onSuccess(res, api)
              return res
            })
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

  getData(api) {
    return { ...api.data, ...this.handle.globalData }
  }

  getHeaders(api) {
    return {
      ...api.headers,
      ...this.handle.globalHeaders,
      ...(this.handle.auth?.header(api) ?? {})
    }
  }

  // 请求
  request(api, opt) {
    return this.fly[api.method](api.reqPath, this.getData(api), {
      ...opt,
      baseURL: this.handle.url,
      headers: this.getHeaders(api),
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
