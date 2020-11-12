/* jshint esversion: 9 */
import auth from './auth'

let isUni = typeof(uni) != 'undefined'
let Fly = require(isUni ? 'flyio/dist/npm/wx' : 'flyio/dist/npm/fly')
let fly = new Fly()

let handleSuccess = (data) => {}
let handleFail = (code, message) => {}
let handelError = (err) => {}
let handelNeedRetry = (err) => {
  return false
}
let handelRetry = (err, retry) => {
  return retry()
}

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
    let err = new Error(data.message)
    err.response = data
    return Promise.reject(err)
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
    if (handelNeedRetry(err)) {
      return handelRetry(err, () => {
        return fly.request(err.request.url, err.request.body, err.request)
      })
    }
  }
)

class Page {

  constructor(fetch, data, size = 10) {
    this.fetch = fetch // 请求
    this.data = data // 查询参数
    this.size = size // 每页数量
    this.total = 0 // 总共数量
    this.num = 1 // 当前第几页
    this.nums = 0 // 总共页数
    this.cursor = null // 首次查询时间戳
    this.isAll = false // 是否拉取完
  }

  refresh() { // 刷新列表
    this.cursor = new Date().getTime() / 1000
    return this.page(1)
  }

  more() { // 加载更多
    return this.page(this.num + 1)
  }

  page(num) { // 第几页
    let data = Object.assign(this.data, {
      page: num,
      pageSize: this.size,
      cursor: this.cursor
    })
    return this.fetch.fetch(data).then(res => {
      this.total = res.total
      this.nums = Math.ceil(this.total / this.size)
      this.num = num
      this.isAll = this.nums == this.num
      return res.dataList
    })
  }

}

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

  page(data, size = 10) {
    return new Page(this, data, size)
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
          header: auth.headerInfo(this.api.path),
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
          header: auth.headerInfo(this.api.path),
          name: 'file',
          formData: data,
          success: (res) => {
            resolve(handleData(JSON.parse(res.data)))
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
  },
  onRetry: (func) => {
    handelRetry = func
  }
}

export default {
  Fetch,
  config
}
