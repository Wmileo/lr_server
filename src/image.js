class Image {
  
  static baseUrl = ''
  static setBaseUrl(url) {
    Image.baseUrl = url
  }
  
  constructor(path) {
    // let url = path.indexOf('/') == 0 ? baseUrl + path : path
    this.url = path
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

export default Image