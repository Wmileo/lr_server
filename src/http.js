/* jshint esversion: 9 */
import serverMgr from './server.js'

function auth(server) {
  return serverMgr.get(server).auth
}

function config(server) {
  return serverMgr.get(server).config
}

function handle(server) {
  return serverMgr.get(server).handle
}

let isUni = typeof(uni) != 'undefined'
let Fly = require(isUni ? 'flyio/dist/npm/wx' : 'flyio/dist/npm/fly')
let fly = new Fly()

fly.config.timeout = 8000

fly.interceptors.request.use((request) => {
  let server = request.headers.server
  return handle(server).handlerequest(request)
})

function log(method, url, body, data) {
  $log.info('server', `${url} (${method})`, { req: body, res: data})
}

fly.interceptors.response.use(
  (res) => {
    let request = res.request
    let server = request.headers.server
    log(request.method, request.baseURL + request.url, request.body, res.data)
    if (request.responseType && request.responseType === 'blob') {
			if (res.data.type === 'application/json') {
				let reader = new FileReader()
				reader.readAsText(res.data)
				reader.onload = e => {
					handle(server).handleData(JSON.parse(e.target.result))
				}
				return Promise.reject()
			}
      return res.data
    } else {
      return handle(server).handleResponseRes(fly, res)
    }
  },
  (err) => {
    let request = err.request
    let server = request.headers.server
    log(request.method, request.baseURL + request.url, request.body, err)
    return handle(server).handleResponseErr(fly, err)
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
    if (auth(this.api.server).needAuth(this.api.path)) {
      return handle(this.api.server).handleAuth().then(() => {
        return this.fetch(data, opt)
      })
    }
    if (config(this.api.server).needConfig(this.api.path)) {
      return handle(this.api.server).handleConfig().then(() => {
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
      headers: auth(this.api.server).headerInfo(this.api.path)
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
          header: auth(this.api.server).headerInfo(this.api.path),
          success: (res) => {
            log('download', this.url, '', res)
            handle(this.api.server).handleSuccess(res)
            resolve(res)
          },
          fail: (err) => {
            log('download', this.url, '', err)
            handle(this.api.server).handleError(err)
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
          header: auth(this.api.server).headerInfo(this.api.path),
          name: 'file',
          formData: data,
          success: (res) => {
            resolve(handle(this.api.server).handleData(JSON.parse(res.data)))
            log('upload', this.url, file, res.data)
          },
          fail: (err) => {
            log('upload', this.url, file, err)
            handle(this.api.server).handleError(err)
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
  onSuccess: (servers) => {
    Object.keys(servers).forEach(key => {
      if (serverMgr.get(key)) {
        serverMgr.get(key).handle.setup.onSuccess(servers[key])
      }
    })
  },
  onFail: (servers) => {
    Object.keys(servers).forEach(key => {
      if (serverMgr.get(key)) {
        serverMgr.get(key).handle.setup.onFail(servers[key])
      }
    })
  },
  onError: (servers) => {
    Object.keys(servers).forEach(key => {
      if (serverMgr.get(key)) {
        serverMgr.get(key).handle.setup.onError(servers[key])
      }
    })
  },
  onAuth: (servers) => {
    Object.keys(servers).forEach(key => {
      if (serverMgr.get(key)) {
        serverMgr.get(key).handle.setup.onAuth(servers[key])
      }
    })
  },
  onConfig: (servers) => {
    Object.keys(servers).forEach(key => {
      if (serverMgr.get(key)) {
        serverMgr.get(key).handle.setup.onConfig(servers[key])
      }
    })
  }
}

export default {
  Fetch,
  http
}
