/* jshint esversion: 9 */
import config from '@config'
import auth from '@/server/auth'
import params from '@/server/params'
import toast from '@/utils/toast'

let fly = require('flyio')

fly.config.baseURL = config.baseURL
fly.config.timeout = 8000

fly.interceptors.request.use((request) => {
  let headers = {
  }
  if (auth.passList().indexOf(request.url) == -1) {
    let info = auth.getInfo()
    Object.assign(headers, info)
  }
  request.headers = headers
  return request
})

fly.interceptors.response.use(
  (response) => {
    // if (typeof response.data === string) response = JSON.parse(response)
    let data = response.data
    data.success = data.code == 1
    if (data.success) {
      return data
    } else {
      toast.message.error(`code: ${data.code}\n${data.msg}`)
      throw new Error(data.code)
    }
  },
  (err) => {
    toast.message.error(`status: ${err.status}\n${err.message}`)
  }
)

class Fetch {
  constructor () {
    this.method = 'get'
    this.path = '/'
    this.data = null
    this.response = null
    this.isFormData = false
  }
  fetch (data) {
    this.data = data
    if (this.path.indexOf('[') > 0) {
      Object.keys(data).forEach(key => {
        this.path = this.path.replace(`[${key}]`, data[key])
      })
    } 
    let options = {
      parseJson: !this.isFormData,
    };
    return fly[this.method](this.path, data, options).then(res => {
      this.response = res
      return res
    })
  }
  list (data) {
    return this.fetch(data).then(res => {
      return res.list
    })
  }
  page (num) {
    this.data.pageNum = num
    return this.list(this.data)
  }
  next () {
    return this.page(this.response.nextPage)
  }
  previous () {
    return this.page(this.response.prePage)
  }
  first () {
    return this.page(this.response.navigateFirstPage)
  }
  last () {
    return this.page(this.response.navigateLastPage)
  }

}

function fetchs (params) {
  let fetchs = {}
  for (let key in params) {
    let param = params[key]
    let fetch = new Fetch()
    fetch.method = param.method
    fetch.path = param.path
    fetch.isFormData = param.isFormData
    fetchs[key] = fetch
  }
  return fetchs
}

export default {
  fetchs,
  auth,
  params
}