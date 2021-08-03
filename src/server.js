
let servers = {}

function set(name, server) {
  servers[name] = server
}

function get(name = 'dt') {
  return servers[name]
}

export default {
  get,
  set
}
