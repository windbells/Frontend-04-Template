const net = require('net');
class Request {
  constructor(options) {
    this.method = options.method || 'GET';
    this.host = options.host;
    this.port = options.port || '/';
    this.body = options.body || {};
    this.headers = options.headers || {};
    if (!this.headers['Content-Type']) {
      this.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    if (this.headers['Content-Type'] === 'application/json') {
      this.bodyText = JSON.stringify(this.body);
    } else if (
      this.headers['Content-Type'] === 'application/x-www-form-urlencoded'
    ) {
      this.bodyText = Object.keys(this.body)
        .map((key) => `${key}=${encodeURIComponent(this.body[key])}`)
        .join('&');
    }
    // Content-Length传的不对的话，这个HTTP请求会是非法的请求
    this.headers['Content-Length'] = this.bodyText.length;
  }

  send() {
    return new Promise((resolve, reject) => {
      const parser = new ResponseParser();
      resolve('');
    });
  }
}

// 逐步接收response文本并处理
class ResponseParser {
  constructor() {}
  receive(string) {
    for (let i = 0; i < string; i += 1) {
      this.receiveChar(string.charAt(i));
    }
  }
  // 状态机
  receiveChar(char) {}
}

void (async function () {
  let request = new Request({
    method: 'POST', // HTTP
    host: '127.0.0.1', // IP层
    port: '8088', // TCP层
    path: '/', // HTTP
    headers: {
      ['X-Foo2']: 'customed',
    },
    body: {
      name: 'kina',
    },
  });

  let response = await request.send();
  console.log('==========', response);
})();
