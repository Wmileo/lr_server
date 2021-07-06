
let isConfig = false

function needConfig(need) {
  return !isConfig && need
}

function finish() {
  isConfig = true
}

export default {
  needConfig,
  finish
}
