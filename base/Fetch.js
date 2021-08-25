import dt from '@dt/dt';

class Fetch {
  constructor(handle) {
    this.handle = handle
  }
  
  fetch(api, data, opt) {
    if (this.handle.auth.need(api.path, api.needAuth)) {
      return this.handle.auth.do().then(() => {
        return this.fetch(api, data, opt)
      })
    }
    if (this.handle.config && this.handle.config.need(api.path, api.needConfig)) {
      return this.handle.config.do().then(() => {
        return this.fetch(api, data, opt)
      })
    }
    return this[api.type](api, data, opt)
  }

  // 请求
  request(api, data, opt) {
    api.fixPath(data)
    return this.handle.fly[api.method](api.reqPath, data, {
      ...opt,
      baseURL: api.url,
      headers: this.handle.auth.header(api.path, api.needAuth)
    }).then(res => {
      return res
    })
  }

  // 下载
  download(api, data, opt) {
    if (dt.env.isUni) {
      api.fixPath(data)
      return new Promise((resolve, reject) => {
        uni.downloadFile({
          url: api.reqUrl,
          header: this.handle.auth.header(api.path, api.needAuth),
          success: (res) => {
            // log('download', api.reqUrl, '', res)
            this.handle.delegate.onSuccess(res)
            resolve(res)
          },
          fail: (err) => {
            // log('download', api.reqUrl, '', err)
            this.handle.delegate.onError(err)
            reject(err)
          }
        })
      })
    } else {
      return this.request(api, data, {
        ...opt,
        responseType: 'blob'
      })
    }
  }

  // 上传
  upload(api, data, opt) {
    if (dt.env.isUni) {
      let file = data['file']
      delete data['file']
      api.fixPath(data)
      return new Promise((resolve, reject) => {
        uni.uploadFile({
          url: api.reqUrl,
          filePath: file,
          header: this.handle.auth.header(api.path, api.needAuth),
          name: 'file',
          formData: data,
          success: (res) => {
            resolve(this.handle.data(JSON.parse(res.data)))
            // log('upload', api.reqUrl, file, res.data)
          },
          fail: (err) => {
            // log('upload', api.reqUrl, file, err)
            this.handle.delegate.onError(err)
            reject(err)
          }
        })
      })
    } else {
      let formData = new FormData()
      for (let k in data) {
        formData.append(k, data[k])
      }
      return this.request(api, formData, opt)
    }                                                                                                                                                                                                                                                                                                                                                                                                                                  
  }
}

export default Fetch
