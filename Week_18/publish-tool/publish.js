let http = require('http');
let fs = require('fs');
let archiver = require('archiver');
let child_process = require('child_process');
let queryString = require('queryString');

// 1. 打开https://github.com/login/oauth/authorize
child_process.exec(`open 'https://github.com/login/oauth/authorize?client_id=Iv1.73b27bf71ba9670b`);
// 3. 创建server，接收token，后点击发布
http.createServer(function(request, response) {
  let query = queryString.parse(request.url.match(/^\/auth\?([\s\S]+)$/)[1]);
  publish(query.token);
}).listen(8083);

function publish() {
    let request = http.request({
    hostname: '127.0.0.1',
    port: 8082,
    method: 'POST',
    path: `/publish?token=${token}`,
    headers: {
      // 流式传输内容类型
      'Content-Type': 'application-octer-stream',
      // 'Content-Length': status.size,
    }
  }, response => {
    console.log(response);
  });

  archive.directory('./sample/', false);
  archive.finalize();
  archive.pipe(request);
}

// let request = http.request({
//   hostname: '127.0.0.1',
//   port: 8082,
//   method: 'POST',
//   headers: {
//     // 流式传输内容类型
//     'Content-Type': 'application-octer-stream',
//     // 'Content-Length': status.size,
//   }
// }, response => {
//   console.log(response);
// });


// let file = fs.createReadStream('./sample.html');
// pipe能将一个可读的流导入到可写的流里面
// 单文件处理方式 第8课
// file.pipe(request);
// file.on('end', () => request.end())

// 6-7课
  // file.on('data', chunk => {
  //   // console.log(chunk.toString());
  //   request.write(chunk);
  // })

  // file.on('end', chunk => {
  //   console.log('read finished');
  //   request.end(chunk);
  // })

// 文件夹处理方式，第8课
// const archive = archiver('zip', {
//   zlib: { level: 9 }
// })

// archive.directory('./sample/', false);
// archive.finalize();
// // archive.pipe(fs.createWriteStream('tmp.zip')); // pipe到文件流里
// archive.pipe(request);