import auth from './auth.js';
import config from './config.js';
import handle from './handle.js';
import serverMgr from '../index.js'

serverMgr.set('jz', {
  auth,
  config,
  handle
})
