const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// TODO 99-尝试使用其他端口
server.listen(3000, () => {
    console.log('listening on *:3000');
});

// TODO 0-客服登录、结束会话
// TODO 0-图片上传
// TODO 99-已读
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});
