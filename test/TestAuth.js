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
    return false
  }
}
export default TestAuth
