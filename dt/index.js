import auth from './auth.js';
import config from './config.js';
import handle from './handle.js';
import serverMgr from '../src/server.js'

serverMgr.set('dt', {
  auth,
  config,
  handle
})
