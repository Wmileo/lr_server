import dt from '@dt/dt';
let isUni = typeof(uni) != 'undefined'
let Fly = require(isUni ? 'flyio/dist/npm/wx' : 'flyio/dist/npm/fly')

// function log(method, url, body, data) {
//   dt.log.info('server', `${url} (${method})`, { req: body, res: data})
// }

class Handle {
  
  constructor(auth, config) {
    this.auth = auth
    this.config = config
    
    this.setupFly()
  }
  
  setupFly() {
    this.fly = new Fly()
    this.fly.config.timeout = 8000
    this.fly.interceptors.request.use((request) => {
      return this.request(request)
    })
    this.fly.interceptors.response.use(
      (res) => {
        let request = res.request
        // log(request.method, request.baseURL + request.url, request.body, res.data)
        if (request.responseType && request.responseType === 'blob') {
    			if (res.data.type === 'application/json') {
            return new Promise((resolve, reject) => {
              let reader = new FileReader()
              reader.readAsText(res.data)
              reader.onload = e => {
                let data = this.data(JSON.parse(e.target.result))
              	resolve(data)
              }
              reader.onerror = resolve
            })
    			}
          return res.data
        } else {
          return this.response(res)
        }
      },
      (err) => {
        // let request = err.request
        // log(request.method, request.baseURL + request.url, request.body, err)
        return this.err(err)
      }
    )
  }
    // unimplemented
  request(req) {
    return req
  }
  
  // unimplemented
  response(res) {
    return this.data(res.data)
  }
  
  // unimplemented
  data(data) {
    return data
  }
  
  // unimplemented
  err(err) {
    return err
  }
  
  // unimplemented
  onSuccess(data) {
  }
  
  // unimplemented
  onFail(code, message) {
  }
  
  // unimplemented
  onError(err) {
  }

  
}

export default Handle
