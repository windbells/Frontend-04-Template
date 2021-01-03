let http = require('http');
let https = require('https');
let fs = require('fs');
let unzipper = require('unzipper');
let queryString = require('queryString');

// 2. auth路由：允许接收code，用code+client_id+client_secret换取token
function auth (request, response) {
  let query = queryString.parse(request.url.match(/^\/auth\?([\s\S]+)$/)[1]);
  getToken(query.code, function (info) {
    // response.write(JSON.stringify(info));
    response.write(`<a herf="http://localhost:8083/?token=${info.access_token}">publish</a>`)
    response.end();
  });
}
function getToken (code, callback) {
  let request = https.request({
    hostname: 'github.com',
    path: `/login/oauth/access_token?code=${code}&client_id=Iv1.73b27bf71ba9670b&client_secret=f0fa7ba5fdbc2811675fc430caf7d05ffa264f35`,
    port: 443,
    method: 'POST',
  }, function (response) {
    let body = '';
    response.on('data', chunk => {
      body += (chunk.toString())
    });
    response.on('end', chunk => {
      console.log(body);
      callback(queryString.parse(body));
    });
    console.log(response);
  });
  request.end();
}
// 4. publish路由：接收发布
function publish (request, response) {
  let query = queryString.parse(request.url.match(/^\/publish\?([\s\S]+)$/)[1]);
  getUser(query.token, info => {
    if (info.login === 'nanacn') {
      // 覆盖式发布
      request.pipe(unzipper.Extract({ path: '../server/public/' }));
      request.on('end', function() {
        response.end('success');
      })
    }
  });

}

function getUser (token, callback) {
  let request = https.request({
    hostname: 'api.github.com',
    path: `/user`,
    port: 443,
    method: 'GET',
    headers: {
      Authorization: `token ${token}`,
      'User-Agent': 'toy-publish-nana',
    }
  }, function (response) {
    let body = '';
    response.on('data', chunk => {
      body += (chunk.toString())
    });
    response.on('end', chunk => {
      console.log(body);
      callback(JSON.parse(body))
    });
  });
  request.end();
}

http.createServer(function (request, response) {
  console.log('---');
  if (request.url.match(/^\/auth\?/)) {
    console.log('--授权--');
    return auth(request, response);
  }

  if (request.url.match(/^\/publish\?/)) {
    return publish(request, response);
  }

  // let outFile =  fs.createWriteStream('../server/public/tmp.zip');
  // request.pipe(outFile);

  // 覆盖式发布
  // request.pipe(unzipper.Extract({ path: '../server/public/' }))

  // 第7课
  // request.on('data', chunk => {
  //   // console.log(chunk);
  //   outFile.write(chunk);
  // })
  // request.on('end', () => {
  //   outFile.end();
  //   response.end('Success');
  // })
}).listen(8082);