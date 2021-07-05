
let servers = {}

function set(name, server) {
  servers[name] = server
}

function get(name) {
  return servers[name]
}

export default {
  get,
  set
}
