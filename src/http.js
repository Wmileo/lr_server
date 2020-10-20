/* jshint esversion: 9 */
import auth from './auth'

let isUni = typeof(uni) != 'undefined'
let Fly = require(isUni ? 'flyio/dist/npm/wx' : 'flyio/dist/npm/fly')
let fly = new Fly()

let handleSuccess = (data) => {}
let handleFail = (code, message) => {}
let handelError = (err) => {}
let handelNeedRetry = (err, retry) => {}

fly.config.timeout = 8000

fly.interceptors.request.use((request) => {
  request.headers = {
    ...auth.headerInfo(request.url),
  }
  return request
})

function handleData(data) {
  data.success = data.code == 1
  if (data.success) {
    handleSuccess(data)
    return data
  } else {
    handleFail(data.code, data.message)
    throw new Error(data.code)
  }
}

fly.interceptors.response.use(
  (res) => {
    let request = res.request
    if (request.responseType && request.responseType === 'blob') {
      return res.data
    } else {
      let data = res.data
      return handleData(data)
    }
  },
  (err) => {
    handelError(err)
    return handelNeedRetry(err, () => {
      return fly.request(err.request.url, err.request.body, err.request)
    })
  }
)

class Fetch {
  constructor(api) {
    this.api = api
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

  fetch(data) {
    return this[this.api.type](data)
  }
  
  // 请求
  request(data, options) {
    this.fixPath(data)
    return fly[this.api.method](this.path, data, {
      ...options,
      baseURL: this.api.url,
      headers: auth.headerInfo(this.api.path)
    }).then(res => {
      return res
    })
  }

  // 下载
  download(data) {
    if (isUni) {
      this.fixPath(data)
      return new Promise((resolve, reject) => {
        uni.downloadFile({
          url: this.url,
          success: (res) => {
            handleSuccess(res.data)
            resolve(res.data)
          },
          fail: (err) => {
            handelError(err)
            reject(err)
          }
        })
      })
    } else {
      return this.request(data, {
        responseType: 'blob'
      })
    }
  }

  // 上传
  upload(data) {
    if (isUni) {
      let file = data['file']
      delete data['file']
      this.fixPath(data)
      return new Promise((resolve, reject) => {
        uni.uploadFile({
          url: this.url,
          filePath: file,
          name: 'file',
          formData: data,
          success: (res) => {
            resolve(handleData(res.data))
          },
          fail: (err) => {
            handelError(err)
            reject(err)
          }
        })
      })
    } else {
      let formData = new FormData()
      for (let k in data) {
        formData.append(k, data[k])
      }
      return this.request(formData)
    }
  }

}

let config = {
  onSuccess: (func) => {
    handleSuccess = func
  },
  onFail: (func) => {
    handleFail = func
  },
  onError: (func) => {
    handelError = func
  },
  needRetry: (func) => {
    handelNeedRetry = func
  }
}

export default {
  Fetch,
  config
}
