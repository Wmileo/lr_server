
let list = []
let isConfig = false

let passList = {
  push: (path) => {
    if (list.indexOf(path) == -1) {
      list.push(path)
    }
  }
}

function needConfig(path) {
  if (list.length > 0) {
    if (path) {
      return !isConfig && list.indexOf(path) == -1
    } else {
      return !isConfig
    }
  }
  return false
}

export default {
  passList,
  needConfig
}
