class Image {
  
  constructor(url) {
    this.url = url
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