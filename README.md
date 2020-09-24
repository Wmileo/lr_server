# 请求服务

## api 对象

|属性|描述|备注|
|-|-|-|
|url|服务url||
|server|服务类别|`auth` 权限服务<br>`maintain` 后台管理服务|
|method|请求方法|`get` `post`|
|path|请求路径||
|type|请求方式|`request` 发起请求<br>`download` 下载<br>`upload` 上传|

## Fetch 对象

#### 属性
|属性|描述|备注|
|-|-|-|
|api|api对象||
|path|请求路径|加载`data`时，会将`[]`所包含键替换成对应值|
#### 方法
```
/* 发起请求
 * 当请求方式是upload时，data需要包含以file为键，文件为值，uni项目该值为文件路径
 */ 
fetch(data)
```

## 便捷工具
#### apiBuilder
用于快速生成 api 基础对象（只包含`method`，`path`，`type`）
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
生成 Fetch 对象
```
// 返回一个生成 Fetch 对象的方法
build(api) 
```


