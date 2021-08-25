import dt from '@dt/dt';

class Fetch {
  constructor(api, handle) {
    this.api = api
    this.handle = handle
    this.path = api.path //实际路径path
    this.url = this.api.url + this.path //全路径url
  }

  fixPath(data) {
    if (this.api.path.indexOf('[') > 0) {
      let path = this.api.path
      for (let k in data) {
        path = path.replace(`[${k}]`, data[k])
      }
      this.path = path
      this.url = this.api.url + this.path
    }
  }
  
  fetch(data, opt) {
    if (this.handle.auth.need(this.api.path, this.api.auth)) {
      return this.handle.auth.do().then(() => {
        return this.fetch(data, opt)
      })
    }
    if (this.handle.config && this.handle.config.need(this.api.path, this.api.config)) {
      return this.handle.config.do().then(() => {
        return this.fetch(data, opt)
      })
    }
    return this[this.api.type](data, opt)
  }

  // 请求
  request(data, opt) {
    this.fixPath(data)
    return this.handle.fly[this.api.method](this.path, data, {
      ...opt,
      baseURL: this.api.url,
      headers: this.handle.auth.header(this.api.path, this.api.auth)
    }).then(res => {
      return res
    })
  }

  // 下载
  download(data, opt) {
    if (dt.env.isUni) {
      this.fixPath(data)
      return new Promise((resolve, reject) => {
        uni.downloadFile({
          url: this.url,
          header: this.handle.auth.header(this.api.path, this.api.auth),
          success: (res) => {
            // log('download', this.url, '', res)
            this.handle.onSuccess(res)
            resolve(res)
          },
          fail: (err) => {
            // log('download', this.url, '', err)
            this.handle.onError(err)
            reject(err)
          }
        })
      })
    } else {
      return this.request(data, {
        ...opt,
        responseType: 'blob'
      })
    }
  }

  // 上传
  upload(data, opt) {
    if (dt.env.isUni) {
      let file = data['file']
      delete data['file']
      this.fixPath(data)
      return new Promise((resolve, reject) => {
        uni.uploadFile({
          url: this.url,
          filePath: file,
          header: this.handle.auth.header(this.api.path, this.api.auth),
          name: 'file',
          formData: data,
          success: (res) => {
            resolve(this.handle.data(JSON.parse(res.data)))
            // log('upload', this.url, file, res.data)
          },
          fail: (err) => {
            // log('upload', this.url, file, err)
            this.handle.onError(err)
            reject(err)
          }
        })
      })
    } else {
      let formData = new FormData()
      for (let k in data) {
        formData.append(k, data[k])
      }
      return this.request(formData, opt)
    }                                                                                                                                                                                                                                                                                                                                                                                                                                  
  }
}

export default Fetch
