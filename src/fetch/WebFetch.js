import DefaultFetch from './DefaultFetch.js'
import Fly from 'flyio/dist/npm/fly.js'

class WebFetch extends DefaultFetch {
  constructor(handle) {
    super(handle)
  }

  setupFly() {
    this.fly = new Fly()
    super.setupFly()
  }
}

export default WebFetch
