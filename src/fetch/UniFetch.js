import Fetch from './Fetch.js'
import Fly from 'flyio/dist/npm/wx.js'

class UniFetch extends Fetch {
  constructor(handle) {
    super(handle)
  }

  setupFly() {
    this.fly = new Fly()
    super.setupFly()
    this.fly.interceptors.response.use((res) => res.data)
  }

  // 下载
  download(api, requestContext) {
    let data = this.getData(requestContext)
    return new Promise((resolve, reject) => {
      let task = uni.downloadFile({
        url: (api.url || this.handle.url) + requestContext.reqPath,
        header: this.getHeaders(api),
        timeout: api.timeout,
        filePath: data.filePath,
        success: (res) => {
          res.status = res.statusCode
          if (res.status == 200) {
            resolve({
              success: true,
              file: res.filePath ?? res.tempFilePath,
              ...res
            })
          } else {
            let err = new Error()
            Object.assign(err, res)
            reject(err)
          }
        },
        fail: reject
      })
      if (api.onTask) api.onTask(task)
    })
  }

  // 上传
  upload(api, requestContext) {
    let data = this.getData(requestContext)
    let filePath = data.filePath
    return new Promise((resolve, reject) => {
      if (filePath) {
        let task = uni.uploadFile({
          url: (api.url || this.handle.url) + requestContext.reqPath,
          filePath,
          timeout: api.timeout,
          header: this.getHeaders(api),
          name: data.name ?? 'file',
          formData: data,
          success: (res) => {
            res.status = res.statusCode
            if (res.status == 200) {
              resolve(JSON.parse(res.data))
            } else {
              let err = new Error()
              Object.assign(err, res)
              reject(err)
            }
          },
          fail: reject
        })
        if (api.onTask) api.onTask(task)
      } else {
        reject(new Error('上传文件 filePath 必传'))
      }
    })
  }
}

export default UniFetch
