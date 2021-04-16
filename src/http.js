/* jshint esversion: 9 */
import auth from './auth'
import config from './config'

let isUni = typeof(uni) != 'undefined'
let Fly = require(isUni ? 'flyio/dist/npm/wx' : 'flyio/dist/npm/fly')
let fly = new Fly()

let handleSuccess = (data) => {}
let handleFail = (code, message) => {}
let handleError = (err) => {}
let handleAuth = () => {
  return Promise.reject(new Error('暂无自动授权操作'))
}
let handleConfig = () => {
  return Promise.resolve()
}

fly.config.timeout = 8000

fly.interceptors.request.use((request) => {
  request.headers = {
    ...auth.headerInfo(request.url),
  }
  return request
})

function handleData(data) {
  data.success = data.code === '1'
  if (data.success) {
    handleSuccess(data)
    return data
  } else {
    handleFail(data.code, data.message)
    let err = new Error(data.message)
    err.code = data.code
    err.response = data
    return Promise.reject(err)
  }
}

function log(method, url, body, data) {
  $log.info('server', `${url} (${method})`, { req: body, res: data})
}

fly.interceptors.response.use(
  (res) => {
    let request = res.request
    log(request.method, request.baseURL + request.url, request.body, res.data)
    if (request.responseType && request.responseType === 'blob') {
			if (res.data.type === 'application/json') {
				let reader = new FileReader()
				reader.readAsText(res.data)
				reader.onload = e => {
					handleData(JSON.parse(e.target.result))
				}
				return Promise.reject()
			}
      return res.data
    } else {
      let data = res.data
      if (data.code == 401) {
        return handleAuth().then(() => {
          return fly.request(request.url, request.body, request)
        })
      } else {
        return handleData(data)
      }
    }
  },
  (err) => {
    handleError(err)
    let request = err.request
    log(request.method, request.baseURL + request.url, request.body, err)
    if (err.status == 401) {
      return handleAuth().then(() => {
        return fly.request(request.url, request.body, request)
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
  
  handleList(func) {
    this.handle = func
  }

  refresh() { // 刷新列表
    this.cursor = Math.floor(new Date().getTime() / 1000)
    return this.page(1)
  }

  more() { // 加载更多
    if (this.isAll) {
      return Promise.resolve([])
    }
    return this.page(this.num + 1)
  }

  page(num) { // 第几页
    let data = Object.assign(this.data, {
      page: num,
      pageSize: this.size,
      cursor: this.cursor
    })
    return this.fetch.fetch(data).then(res => {
      this.total = res.data ? res.data.total : 0
      this.nums = Math.ceil(this.total / this.size)
      this.num = num
      this.isAll = this.nums == this.num
      let list = (res.data && res.data.dataList) ? res.data.dataList : []
      if (this.handle) {
        list = this.handle(list)
      }
      return list
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

  fetch(data, opt) {
    if (auth.needAuth(this.api.path)) {
      return handleAuth().then(() => {
        return this.fetch(data, opt)
      })
    }
    if (config.needConfig(this.api.path)) {
      return handleConfig().then(() => {
        return this.fetch(data, opt)
      })
    }
    return this[this.api.type](data, opt)
  }

  // 请求
  request(data, opt) {
    this.fixPath(data)
    return fly[this.api.method](this.path, data, {
      ...opt,
      baseURL: this.api.url,
      headers: auth.headerInfo(this.api.path)
    }).then(res => {
      return res
    })
  }

  // 下载
  download(data, opt) {
    if (isUni) {
      this.fixPath(data)
      return new Promise((resolve, reject) => {
        uni.downloadFile({
          url: this.url,
          header: auth.headerInfo(this.api.path),
          success: (res) => {
            log('download', this.url, '', res)
            handleSuccess(res)
            resolve(res)
          },
          fail: (err) => {
            log('download', this.url, '', err)
            handleError(err)
            reject(err)
          }
        })
      })
    } else {
      return this.request(data, {
        ...opt,
        responseType: 'blob'
      })
    }
  }

  // 上传
  upload(data, opt) {
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
            log('upload', this.url, file, res.data)
          },
          fail: (err) => {
            log('upload', this.url, file, err)
            handleError(err)
            reject(err)
          }
        })
      })
    } else {
      let formData = new FormData()
      for (let k in data) {
        formData.append(k, data[k])
      }
      return this.request(formData, opt)
    }
  }

}

let http = {
  onSuccess: (func) => {
    handleSuccess = func
  },
  onFail: (func) => {
    handleFail = func
  },
  onError: (func) => {
    handleError = func
  },
  onAuth: (func) => {
    handleAuth = func
  },
  onConfig: (func) => {
    handleConfig = func
  }
}

export default {
  Fetch,
  http
}
