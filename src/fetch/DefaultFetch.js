import Fetch from './Fetch.js'

class DefaultFetch extends Fetch {
  constructor(handle) {
    super(handle)
  }

  setupFly() {
    // DefaultFetch需要子类设置fly后再调用
    if (this.fly) {
      super.setupFly()
      this.fly.interceptors.response.use((res) => {
        if (res.request.responseType == 'blob' && res.data.type == 'application/json') {
          return new Promise((resolve, reject) => {
            let reader = new FileReader()
            reader.readAsText(res.data)
            reader.onload = (e) => resolve(JSON.parse(e.target.result))
            reader.onerror = reject
          })
        }
        return res.data
      })
    }
  }

  getData(requestContext) {
    let data = super.getData(requestContext)
    if (requestContext.isFormData) {
      let formData = new FormData()
      for (let k in data) {
        formData.append(k, data[k])
      }
      return formData
    }
    return data
  }

  // 下载
  download(api, requestContext) {
    return this.request(api, requestContext, { responseType: 'blob' }).then(
      (res) => (res.success = true && res)
    )
  }

  // 上传
  upload(api, requestContext) {
    requestContext.isFormData = true
    return this.request(api, requestContext)
  }
}

export default DefaultFetch
