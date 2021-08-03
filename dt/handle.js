import config from './config';
import auth from './auth';

let handleSuccess = (data, server) => {}
let handleFail = (code, message, server) => {}
let handleError = (err, server) => {}
let handleAuth = (server) => {
  return Promise.reject(new Error('暂无自动授权操作'))
}
let handleConfig = (server) => {
  config.finish()
  return Promise.resolve()
}

function handleData(data) {
  data.success = data.code == 200
  if (data.success) {
    handleSuccess(data)
    return data
  } else {
    handleFail(data.code, data.description)
    let err = new Error(data.description)
    err.code = data.code
    err.response = data
    return Promise.reject(err)
  }
}

function handleResponseRes(fly, res) {
  let request = res.request
  let data = res.data
  if (data.code == 401) {
    return handleAuth().then(() => {
      return fly.request(request.url, request.body, request)
    })
  } else {
    return handleData(data)
  }
}

function handleResponseErr(fly, err) {
  handleError(err)
  let request = err.request
  if (err.status == 401) {
    return handleAuth().then(() => {
      return fly.request(request.url, request.body, request)
    })
  }
}

function handlerequest(request) {
  request.headers = {
    ...auth.headerInfo(request.url),
  }
  return request
}

let setup = {
  onSuccess: (func) => {
    handleSuccess = func
  },
  onFail: (func) => {
    handleFail = func
  },
  onError: (func) => {
    handleError = func
  },
  onAuth: (func) => {
    handleAuth = func
  },
  onConfig: (func) => {
    handleConfig = func
  }
}

export default {
  handlerequest,
  handleResponseRes,
  handleResponseErr,
  handleData,

  handleSuccess: (data, server) => {
    handleSuccess(data, server)
  },
  handleFail: (code, message, server) => {
    handleFail(code, message, server)
  },
  handleError: (err, server) => {
    handleError(err, server)
  },
  handleAuth: (server) => {
    return handleAuth(server)
  },
  handleConfig: (server) => {
    return handleConfig(server)
  },

  setup
}
