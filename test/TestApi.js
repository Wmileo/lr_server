import Api from '../src/Api.js'

class TestApi extends Api {
  constructor(path) {
    super(path)

    this.url = 'https://www.baidu.com'
    this.globalData = {
      globalData: 'globalData'
    }
    this.globalHeaders = {
      globalHeaders: 'globalHeaders'
    }
  }
}
export default TestApi
