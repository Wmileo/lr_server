import Fetch from './Fetch.js'
import Fly from 'flyio/dist/npm/wx.js'

class UniFetch extends Fetch {
  constructor(handle) {
    super(handle)
  }

  setupFly() {
    this.fly = new Fly()
    this.fly.interceptors.request.use((request) => {
      return this.handle.request(request)
    })
    this.fly.interceptors.response.use(
      (res) => {
        return this.handle.response(res)
      },
      (err) => {
        return this.handle.err(err)
      }
    )
  }

  // 下载
  download(api) {
    return new Promise((resolve, reject) => {
      uni.downloadFile({
        url: api.url + api.reqPath,
        header: api.getHeaders(),
        success: (res) => {
          this.handle.response(res).then(resolve, reject)
        },
        fail: (err) => {
          this.handle.err(err).then(resolve, reject)
        }
      })
    })
  }

  // 上传
  upload(api) {
    let data = api.getData()
    let file = data.file
    return new Promise((resolve, reject) => {
      uni.uploadFile({
        url: api.url + api.reqPath,
        filePath: file,
        header: api.getHeaders(),
        name: data.name,
        formData: data,
        success: (res) => {
          this.handle.response(JSON.parse(res.data)).then(resolve, reject)
        },
        fail: (err) => {
          this.handle.err(err).then(resolve, reject)
        }
      })
    })
  }
}

export default UniFetch
