import Auth from '../src/handle/Auth.js'

class TestAuth extends Auth {
  constructor() {
    super('test')
  }

  header(path, need) {
    return {
      token: 'token'
    }
  }

  need(path) {
    return path.indexOf('/auth/') >= 0
  }
}
export default TestAuth
