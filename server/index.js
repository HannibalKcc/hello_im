const express = require('express');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

const saveFile = require('./src/saveFile.js');
const fakeAiRespond = require('./src/fakeAiRespond.js');
const findPortEnable = require('./src/findPortEnable.js');
const socketWithCache = require('./src/socketWithCache.js').socketWithCache;
const cacheList = require('./src/socketWithCache.js').cacheList;

// 暴露静态文件夹
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'upload-files')));

// for parsing application/json
app.use(express.json());
// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/dist/index.html');
});

app.post('/upload-file', (req, res, next) => {
    saveFile({req}).then(result => {
        socketWithCache(
            io,
            'msgFromS',
            {
                msg: result.fileName,
                msgType: 'imgMsg',
                userType: result.userType,
                // 时间戳在服务端添加
                time: Date.now(),
            },
        );
        res.json({status: 'success'});
    }).catch((e) => {
        console.log('/upload-file error', e);
        next();
    });
});

io.on('connection', (socket) => {
    console.log('user connected');

    // 发送缓存信息
    cacheList.forEach(item => {
        // 不显示自己的上下线信息
        if (item.msgObj.msgType === 'systemMsg'
            && item.msgObj.userType === socket.handshake.query.userType) {
        } else {
            socket.emit(
                item.eventName,
                item.msgObj,
            );
        }
    });

    // 登入，通知对方
    socketWithCache(
        socket.broadcast,
        'msgFromS',
        {
            msg: `${socket.handshake.query.userType === 'customer' ? '客户' : '客服'}已在线`,
            userType: socket.handshake.query.userType,
            msgType: 'systemMsg',
            time: Date.now(),
        },
    );

    socket.on('msgFromC', (msgObj) => {
        socketWithCache(
            io,
            'msgFromS',
            {
                ...msgObj,
                // 时间戳在服务端添加
                time: Date.now(),
            },
        );

        // 客户端消息关键词回复
        if (msgObj.userType === 'customer') {
            const aiRes = fakeAiRespond(msgObj.msg);
            if (!['', null, undefined].includes(aiRes)) {
                socketWithCache(
                    io,
                    'msgFromS',
                    {
                        ...msgObj,
                        msg: aiRes,
                        msgType: 'commonMsg',
                        userType: 'customerService',
                        // 时间戳在服务端添加
                        time: Date.now(),
                    },
                );
            }
        }
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');

        socketWithCache(
            socket.broadcast,
            'msgFromS',
            {
                msg: `${socket.handshake.query.userType === 'customer' ? '客户' : '客服'}已离线`,
                userType: socket.handshake.query.userType,
                msgType: 'systemMsg',
                time: Date.now(),
            },
        );
    });
});

findPortEnable(3000).then(port => {
    server.listen(port, () => {
        console.log(`listening on *:${port}`);
    });
});
