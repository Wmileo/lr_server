class Server {
  constructor(opt) {
    this.Api = opt.Api
    this.Handle = opt.Handle
    this.Fetch = opt.Fetch
  }

  setDelegate(delegate) {
    this.fetch = new this.Fetch(new this.Handle(delegate))
  }

  api(path) {
    let api = new this.Api(path)
    api.setFetcher(this.fetch)
    return api
  }

  get(path) {
    return this.api(path)
  }

  post(path) {
    return this.api(path).bindMethod('post')
  }

  put(path) {
    return this.api(path).bindMethod('put')
  }

  delete(path) {
    return this.api(path).bindMethod('delete')
  }

  patch(path) {
    return this.api(path).bindMethod('patch')
  }

  download(path, method = 'post') {
    return this.api(path).bindMethod(method).bindType('download')
  }

  upload(path, method = 'post') {
    return this.api(path).bindMethod(method).bindType('upload')
  }
}

export default Server
