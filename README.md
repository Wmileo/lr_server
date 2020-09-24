# 请求服务

## api属性

|属性|描述|备注|
|-|-|-|
|url|服务url||
|server|服务类别|`auth` 权限服务<br>`maintain` 后台管理服务|
|method|请求方法|`get` `post`|
|path|请求路径||
|type|请求方式|`request` 发起请求<br>`download` 下载<br>`upload` 上传|


## 便捷工具
#### apiBuilder
用于快速生成api基础对象（只包含`method`，`path`，`type`）
```
// 普通get请求 {method: 'get', path, type: 'request'}
get(path) 

// 普通post请求 {method: 'post', path, type: 'request'}
post(path) 

// 下载请求 {method, path, type: 'download'}
download(path, method = 'post') 

// 上传请求 {method, path, type: 'upload'}
upload(path, method = 'post') 
```
