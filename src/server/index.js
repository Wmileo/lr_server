
let servers = {}

function set(name, server) {
  servers[name] = server
}

function get(name = 'xq') {
  if (name == 'app') {
    name = 'xq'
  }
  return servers[name]
}

export default {
  get,
  set
}
