# hello_im

# 启动

```shell
 cd ./server
 npm i
 npm run server
```

服务端是热更新的，要更新客户端，请在客户端文件夹 `npm run build`

# TODO list

## 核心功能

- [x] `msgObj` 基本模型设计
- [x] 客户端配合假数据基本样式
- [x] 关键字智能回复
- [x] 客户端图片上传，客户端图片接收
- [x] 服务端图片接受并保存
- [x] 完善客服上线提醒

## 边缘功能

- [x] 客户端打包文件以供服务端使用，修改 `publicPath`
- [x] 生产环境不使用假数据
- [x] 样式优化（对话框、图片上传）
- [x] 客户端客户用户对话框提供关键字选型
- [x] 服务端启动时，端口可用性检查
- [x] 删除依赖，按照 MD 的启动方式运行正常
- [x] 服务端消息缓存，下发
- [x] 服务端使用 TS
- [ ] 服务端使用 class 生成 msgObj
- [x] 防XSS，目前客户端没有使用 v-html 的地方，暂时不启用
- [x] 唯一客户、唯一客服
- [ ] https://webpack.js.org/guides/development/#using-webpack-dev-middleware 考虑让开发环境下，客户端服务端同时热更新
- [ ] msg option 允许进一步智能回复
