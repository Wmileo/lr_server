import DtAuth from './DtAuth.js';
import DtHandle from './DtHandle.js';
import Server from '../base/Server.js'
import dt from '@dt/dt'

dt.server = new Server(DtHandle, DtAuth)
