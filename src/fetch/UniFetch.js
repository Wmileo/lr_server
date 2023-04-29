import Fetch from './Fetch.js'
import Fly from 'flyio/dist/npm/wx.js'

class UniFetch extends Fetch {
  constructor(handle) {
    super(handle)
  }

  setupFly() {
    this.fly = new Fly()
    super.setupFly()
    this.fly.interceptors.response.use(
      (res) => res.data,
      (err) => err
    )
  }

  // 下载～～～
  download(api) {
    let data = this.getData(api)
    let file = data.file
    return new Promise((resolve, reject) => {
      uni.downloadFile({
        url: this.handle.url + api.reqPath,
        header: this.getHeaders(api),
        timeout: api.timeout,
        filePath: file,
        success: (res) => {
          if (res.statusCode == 200) {
            resolve({
              success: true,
              file: res.filePath ?? res.tempFilePath
            })
          } else {
            // ～～～
            reject()
          }
        }
        // ～～～
        // fail: (err) => this.handle.err(err).then(resolve, reject)
      })
    })
  }

  // 上传～～～
  upload(api) {
    let data = this.getData(api)
    let file = data.file
    return new Promise((resolve, reject) => {
      uni.uploadFile({
        url: this.handle.url + api.reqPath,
        filePath: file,
        header: this.getHeaders(api),
        name: data.name,
        formData: data,
        success: (res) => resolve(JSON.parse(res.data))
        // ～～～
        // fail: (err) => this.handle.err(err).then(resolve, reject)
      })
    })
  }
}

export default UniFetch
