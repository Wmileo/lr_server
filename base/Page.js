

class Page {

  constructor(fetch, data, size = 10) {
    this.fetch = fetch // 请求
    this.data = data // 查询参数
    this.size = size // 每页数量
    this.total = 0 // 总共数量
    this.num = 1 // 当前第几页
    this.nums = 0 // 总共页数
    this.cursor = null // 首次查询时间戳
    this.isAll = false // 是否拉取完
  }
  
  handleList(func) {
    this.handle = func
  }

  refresh() { // 刷新列表
    this.cursor = Math.floor(new Date().getTime() / 1000)
    return this.page(1)
  }

  more() { // 加载更多
    if (this.isAll) {
      return Promise.resolve([])
    }
    return this.page(this.num + 1)
  }

  page(num) { // 第几页
    let data = Object.assign(this.data, {
      page: num,
      pageSize: this.size,
      cursor: this.cursor
    })
    return this.fetch.fetch(data).then(res => {
      this.total = res.data ? res.data.total : 0
      this.nums = Math.ceil(this.total / this.size)
      this.num = num
      this.isAll = this.nums == this.num
      let list = (res.data && res.data.dataList) ? res.data.dataList : []
      if (this.handle) {
        list = this.handle(list)
      }
      return list
    })
  }

}

export default Page