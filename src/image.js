
let url = null

class Image {
  
  constructor(path) {
    if (path.indexOf('http://') == 0 || path.indexOf('https://') == 0) {
      this.url = path
    } else {
      this.url = url + path
    }
  }

  style(name) {
    return this.url + '?x-oss-process=style/' + name
  }
  
  width(width) {
    return this.url + `?x-oss-process=image/resize,w_${width},m_lfit`
  }
  
  size(width, height) {
    return this.url + `?x-oss-process=image/resize,h_${height},w_${width},m_fill`
  }
  
}

function setURL(u) {
  url = u
}

function path(path) {
  return new Image(path)
}

export default {
  path,
  setURL
}

