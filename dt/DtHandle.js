import dt from '@dt/dt';
import Handle from '../base/Handle.js';

class DtHandle extends Handle {
  
  request(req) {
    let obj = {
      appId: dt.env.id,
      appName: dt.env.name,
      appVersion: dt.env.version,
    }
    req.headers = {
      ...obj,
      ...req.headers
      // ...this.auth.header(req.url),
    }
    if (!req.body) {
      req.body = {}
    }
    Object.assign(req.body, {
      ...obj
    })
    return req
  }
  
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
      this.delegate.onSuccess(data)
      return data.data
    } else {
      this.delegate.onFail(data.code, data.msg)
      let err = new Error(data.msg)
      err.code = data.code
      err.data = data.data
      return Promise.reject(err)
    }
  }
  
  err(err) {
    this.delegate.onError(err)
    let request = err.request
    if (err.status == 401) {
      return this.auth.do().then(() => {
        return this.fly.request(request.url, request.body, request)
      })
    }
  }
  
}

export default DtHandle