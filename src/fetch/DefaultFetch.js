import Fetch from './Fetch.js'

class DefaultFetch extends Fetch {
  constructor(handle) {
    super(handle)
  }

  setupFly() {
    super.setupFly()
    this.fly.interceptors.request.use((request) => {
      return this.handle.request(request)
    })
    this.fly.interceptors.response.use(
      (res) => {
        let request = res.request
        if (request.responseType == 'blob') {
          if (res.data.type == 'application/json') {
            return new Promise((resolve, reject) => {
              let reader = new FileReader()
              reader.readAsText(res.data)
              reader.onload = (e) => {
                resolve(this.handle.data(JSON.parse(e.target.result)))
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

  getData(api) {
    let data = super.getData(api)
    if (api.isFormData) {
      let formData = new FormData()
      for (let k in data) {
        formData.append(k, data[k])
      }
      return formData
    }
    return data
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

export default DefaultFetch
