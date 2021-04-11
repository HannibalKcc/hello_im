const inspect = require('util').inspect;
const fs = require('fs');
const path = require('path');

const Busboy = require('busboy');

/**
 * 服务端保存文件
 * @param  {fileName} 文件名
 * @return {promise<result>} 异步返回保存结果
 */
function saveFile({req}) {
    return new Promise((resolve, reject) => {
        const result = {
            status: 'success', // fail
            userType: '',
            fileName: '',
        };
        const busboy = new Busboy({headers: req.headers});

        busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
            // TODO 1-防止随机数冲突
            let fileName = Math.random().toString(16).substr(2) + path.extname(filename);
            let savePath = path.join(__dirname, '..', 'upload-files', fileName);

            // 文件保存到指定路径
            file.pipe(fs.createWriteStream(savePath));

            // 文件写入事件结束
            file.on('end', function() {
                console.log('文件上传成功！');
                result.fileName = fileName;
            });
        });

        // 解析表单中其他字段信息
        busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
            console.log('表单字段数据 [' + fieldname + ']: value: ' + inspect(val));
            if ('userType' === fieldname) {
                result.userType = inspect(val);
            }
        });

        // 解析结束事件
        busboy.on('finish', function() {
            console.log('文件上结束');
            resolve(result);
        });

        // 解析错误事件
        busboy.on('error', function(err) {
            console.log('文件上出错');
            result.status = 'fail';
            reject(result);
        });

        req.pipe(busboy);
    });
}

module.exports = saveFile;
