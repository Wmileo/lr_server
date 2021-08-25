import Api from '../base/Api.js';
import dt from '@dt/dt';

class DtApi extends Api {
  constructor(fetch) {
    super(fetch)
    this.url = dt.env.dtUrl
  }
}

export default DtApi