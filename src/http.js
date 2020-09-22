
import auth from './auth'

let isUni = typeof(uni) != 'undefined'
let fly = require(isUni ? 'flyio/dist/npm/wx' : 'flyio')

let handleSuccess = (data) => {}
let handleFail = (code, msg) => {}
let handelError = (err) => {}

fly.config.timeout = 8000

fly.interceptors.request.use((request) => {
  let headers = {}
  Object.assign(headers, auth.headerInfo(request.url))
  request.headers = headers
  return request
})

function handleData(data) {
  data.success = data.code == 1
  if (data.success) {
    handleSuccess(data)
    return data
  } else {
    handleFail(data.code, data.msg)
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
  }
)

class Fetch {
  constructor(param) {
    this.method = param.method
    this.path = param.path
    this.data = null
    this.response = null
  }

  fixPath(data) {
    if (this.path.indexOf('[') > 0) {
      Object.keys(data).forEach(key => {
        this.path = this.path.replace(`[${key}]`, data[key])
      })
    }
  }

  url() {
    return fly.config.baseURL + this.path
  }

  // 请求
  fetch(data, options = {}) {
    this.data = data
    fixPath(data)
    return fly[this.method](this.path, data, options).then(res => {
      this.response = res
      return res
    })
  }

  // 下载
  download(data) {
    if (isUni) {
      fixPath(data)
      return new Promise((resolve, reject) => {
        uni.downloadFile({
          url: url(), //仅为示例，并非真实的资源
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
      return this.fetch(data, {
        responseType: 'blob'
      })
    }
  }

  // 上传
  upload(file, data) {
    if (isUni) {
      fixPath(data)
      return new Promise((resolve, reject) => {
        uni.uploadFile({
          url: url(),
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
      formData.append('file', file)
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key])
      })
      return this.fetch(formData)
    }
  }

}

let config = {
  setBaseURL: (url) => {
    fly.config.baseURL = url
  },
  onSuccess: (func) => {
    handleSuccess = func
  },
  onFail: (func) => {
    handleFail = func
  },
  onError: (func) => {
    handelError = func
  },
}

export default {
  Fetch,
  config
}
