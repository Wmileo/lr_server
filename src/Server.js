import DefaultApi from './Api.js'
import DefaultHandle from './handle/Handle.js'
import DefaultDelegate from './Delegate.js'

class Server {
  constructor(Fetch, Handle) {
    if (!Fetch) {
      console.error('Server 参数未正常配置')
    }
    this.Api = DefaultApi
    this.Handle = Handle ?? DefaultHandle
    this.Fetch = Fetch
  }

  setup(Delegate) {
    this.handle = new this.Handle(new Delegate())
    this.fetch = new this.Fetch(this.handle)
  }

  api(path) {
    if (!this.fetch) {
      this.handle = new this.Handle(new DefaultDelegate())
      this.fetch = new this.Fetch(this.handle)
    }
    let api = new this.Api(path)
    this.fetch.bindApi(api)
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
