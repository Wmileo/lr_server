import Handle from '../base/Handle.js';

class DtHandle extends Handle {
  response(res) {
    let request = res.request
    let data = res.data
    if (data.code == 401) {
      return this.auth.do().then(() => {
        return this.fly.request(request.url, request.body, request)
      })
    } else {
      return this.data(data)
    }
  }
  
  data(data) {
    data.success = data.code == 200
    if (data.success) {
      return data.data
    } else {
      let err = new Error(data.msg)
      err.fail = true
      err.code = data.code
      err.data = data.data
      return Promise.reject(err)
    }
  }
  
  err(err) {
    let request = err.request
    if (err.status == 401) {
      return this.auth.do().then(() => {
        return this.fly.request(request.url, request.body, request)
      })
    } else {
      return Promise.reject(err)
    }
  }
  
}

export default DtHandle