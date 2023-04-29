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

  needAuth(res, isError) {
    return false
  }

  needRefresh(res, isError) {
    return false
  }
}
export default TestAuth
