const express = require('express');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

const saveFile = require('./src/saveFile.js');

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
        io.emit(
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

// TODO 99-尝试使用其他端口
server.listen(3000, () => {
    console.log('listening on *:3000');
});

// TODO 0-结束会话
// TODO 99-已读
// TODO 1-服务端使用 TS
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('msgFromC', (msgObj) => {
        io.emit(
            'msgFromS',
            {
                ...msgObj,
                // 时间戳在服务端添加
                time: Date.now(),
            },
        );
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});
