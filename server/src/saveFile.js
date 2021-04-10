const inspect = require('util').inspect;
const fs = require('fs');
const path = require('path');

const Busboy = require('busboy');

/**
 * 服务端保存文件
 * @param  {fileName} 文件名
 * @return {promise<bool>>} 异步返回保存结果
 */
function saveFile({req}) {
    return new Promise((resolve, reject) => {

        let busboy = new Busboy({headers: req.headers});

        busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
            let fileName = Math.random().toString(16).substr(2) + path.extname(filename);
            let savePath = path.join(__dirname, '..', 'upload-files', fileName);

            // 文件保存到制定路径
            file.pipe(fs.createWriteStream(savePath));

            // 文件写入事件结束
            file.on('end', function() {
                console.log('文件上传成功！');
                resolve(true);
            });
        });

        // 解析表单中其他字段信息
        busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
            console.log('表单字段数据 [' + fieldname + ']: value: ' + inspect(val));
            // result.formData[fieldname] = inspect(val);
        });

        // 解析结束事件
        busboy.on('finish', function() {
            console.log('文件上结束');
            resolve(true);
        });

        // 解析错误事件
        busboy.on('error', function(err) {
            console.log('文件上出错');
            reject(false);
        });

        req.pipe(busboy);
    });
}

module.exports = saveFile;
