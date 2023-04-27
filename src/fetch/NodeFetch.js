import Fetch from './Fetch.js'
import Fly from 'flyio/src/node/index.js'

class NodeFetch extends Fetch {
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
        let request = res.request
        if (request.responseType && request.responseType === 'blob') {
          if (res.data.type === 'application/json') {
            return new Promise((resolve, reject) => {
              let reader = new FileReader()
              reader.readAsText(res.data)
              reader.onload = (e) => {
                let data = this.handle.data(JSON.parse(e.target.result))
                resolve(data)
              }
              reader.onerror = resolve
            })
          }
          return res.data
        } else {
          return this.handle.response(res)
        }
      },
      (err) => {
        return this.handle.err(err)
      }
    )
  }

  // 下载
  download(api) {
    return this.request(api, { responseType: 'blob' })
  }

  // 上传
  upload(api) {
    api.isFormData = true
    return this.request(api)
  }
}

export default NodeFetch
