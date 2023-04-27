import Auth from '../src/handle/Auth.js'

class TestAuth extends Auth {
  constructor() {
    super('test')
  }

  header(api) {
    return {
      token: 'token'
    }
  }

  need(api) {
    return api.path.indexOf('/auth/') >= 0
  }
}
export default TestAuth
