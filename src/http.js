/* jshint esversion: 9 */
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
  constructor(api) {
    this.method = api.method
    this.path = api.path
    this.url = api.url
    this.server = api.server
    this.type = api.type
    
    this.data = null
    this.response = null
  }

  fixPath() {
    console.log('why', this.path)
    if (this.path.indexOf('[') > 0) {
      for (let k in this.data) {
        console.log(k, this.data[k])
        this.path = this.path.replace(`[${k}]`, this.data[k])
        console.log(this.path)
      }
    }
  }

  fetch(data, options = {}) {
    return this[this.type](data, options)
  }
  
  // 请求
  request(data, options = {}) {
    this.data = data
    console.log(this.data)
    this.fixPath()
    Object.assign(options, { baseURL: this.url} )
    return fly[this.method](this.path, data, options).then(res => {
      this.response = res
      return res
    })
  }

  // 下载
  download(data) {
    this.data = data
    if (isUni) {
      this.fixPath()
      return new Promise((resolve, reject) => {
        uni.downloadFile({
          url: this.url + this.path, //仅为示例，并非真实的资源
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
    this.data = data
    if (isUni) {
      let file = data['file']
      delete data['file']
      this.fixPath()
      return new Promise((resolve, reject) => {
        uni.uploadFile({
          url: this.url + this.path,
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
