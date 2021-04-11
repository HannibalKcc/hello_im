// 利用变量缓存，入有需要通过数据库或文件持久化
const cacheList = [];

function socketWithCache(socket, eventName, msgObj) {
    if ([socket, eventName, msgObj].some(item => [null, undefined].includes(item))) {
        throw '参数 socket, eventName, msgObj 必填！';
    }
    socket.emit(eventName, msgObj);
    cacheList.push({socket, eventName, msgObj});
}

module.exports = {
    socketWithCache,
    cacheList,
};