# 请求服务

## server 对象

|属性|描述|
|-|-|
|config|配置方法对象|
|auth|授权操作对象|
|apiBuilder|api对象生成器|

## api 对象

|属性|描述|备注|
|-|-|-|
|url|服务url||
|server|服务类别|`auth` 权限服务<br>`maintain` 后台管理服务|
|method|请求方法|`get` `post` `put` `delete` `patch`|
|path|请求路径||
|type|请求方式|`request` 发起请求<br>`download` 下载<br>`upload` 上传|

## Fetch 对象

#### 属性
|属性|描述|备注|
|-|-|-|
|api|api对象||
|path|请求路径|加载`data`时，会将`[]`所包含键替换成对应值|
|url|请求全路径|完整路径|
#### 方法
```
/* 
 * 发起请求
 * 当请求方式是upload时，data需要包含以file为键，文件为值，uni项目该值为文件路径
 */ 
fetch(data)

/* 
 * 返回 Page 对象
 */ 
page(data, size = 10)
```

## Page 对象

#### 属性
|属性|描述|备注|
|-|-|-|
|fetch|fetch对象||
|data|请求参数|不需要包含分页相关|
|cursor|首次查询时间戳||
|size|分页每页数量|默认10|
|num|当前第几页|默认1|
|nums|总共页数|当第一次查询之后有值|
|total|数据总数|当第一次查询之后有值|
|isAll|是否拉取完|当第一次查询之后有值|

#### 方法
```
/* 
 * 返回第一页数据列表
 */ 
refresh()

/* 
 * 返回下一页数据列表
 */ 
more()

/* 
 * 返回第 num 页数据列表
 */
page(num)
```


## auth
管理授权相关数据
#### 方法
```
// 存储授权信息
setInfo(info)

// 清除授权信息
clear()

// 获取授权信息
headerInfo(path)

```

## apiBuilder

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
生成 Fetch 对象集合
```
// 返回一个生成 Fetch 对象集合的方法， extras 为扩展信息
builders(apis, extras) 
```

## config
配置请求结果处理
```
// 配置请求结果成功处理函数
onSuccess(data => {})

// 配置请求结果失败处理函数
onFail((code, message) => {})

// 配置请求失败处理函数
onError((err) => {})

// 配置是否需要重发请求
needRetry((err) => { return false })

// 配置重发请求触发时机
onRetry((err, retry) => { return retry() })
```

