import Api from '../base/Api.js';
import dt from '@dt/dt';

class DtApi extends Api {
  constructor(fetch) {
    super(fetch)
    this.url = dt.env.dtUrl
  }
  
  setData(data, opt) {
    super.setData(data, opt)
    let obj = {
      appId: dt.env.id,
      appName: dt.env.name,
      appVersion: dt.env.version,
    }
    this.headers = {
      ...obj,
      ...this.headers
    }
    Object.assign(this.data, {
      ...obj
    })
  }
}

export default DtApi