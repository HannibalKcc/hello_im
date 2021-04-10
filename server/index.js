const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);

const saveFile = require('./src/saveFile.js');

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded

app.get('/', (req, res) => {
    res.send(`
      <h1>koa2 upload demo</h1>
      <form method="POST" action="/upload-file" enctype="multipart/form-data">
        <p>file upload</p>
        <span>picName:</span><input name="picName" type="text" /><br/>
        <input name="file" type="file" /><br/><br/>
        <button type="submit">submit</button>
      </form>
    `);
});

app.post('/upload-file', (req, res, next) => {
    saveFile({req});
});

// TODO 99-尝试使用其他端口
server.listen(3000, () => {
    console.log('listening on *:3000');
});

// TODO 0-客服登录、结束会话
// TODO 0-图片上传
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
