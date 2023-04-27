import DefaultFetch from './DefaultFetch.js'
import Fly from 'flyio/src/node/index.js'

class NodeFetch extends DefaultFetch {
  constructor(handle) {
    super(handle)
  }

  setupFly() {
    this.fly = new Fly()
    super.setupFly()
  }
}

export default NodeFetch
