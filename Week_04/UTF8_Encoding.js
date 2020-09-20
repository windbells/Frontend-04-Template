// 写一段 JS 的函数，把一个 string 它代表的字节给它转换出来，用 UTF8 对 string 进行遍码。

// 将字符串格式化为UTF8编码的字节
function UTF8_Encoding(str, isGetBytes) {
  // 下面为单个字符的大小占用几个字节。单个unicode字符编码之后的最大长度为6个字节。
  // •1个字节：Unicode码为0 - 127
  // •2个字节：Unicode码为128 - 2047
  // •3个字节：Unicode码为2048 - 0xFFFF
  // •4个字节：Unicode码为65536 - 0x1FFFFF
  // •5个字节：Unicode码为0x200000 - 0x3FFFFFF
  // •6个字节：Unicode码为0x4000000 - 0x7FFFFFFF
  const back = [];
  let byteSize = 0;
  for (let i = 0; i < str.length; i += 1) {
    function UTF8_Encoding(str, isGetBytes) {
      // 下面为单个字符的大小占用几个字节。单个unicode字符编码之后的最大长度为6个字节。
      // •1个字节：Unicode码为0 - 127
      // •2个字节：Unicode码为128 - 2047
      // •3个字节：Unicode码为2048 - 0xFFFF
      // •4个字节：Unicode码为65536 - 0x1FFFFF
      // •5个字节：Unicode码为0x200000 - 0x3FFFFFF
      // •6个字节：Unicode码为0x4000000 - 0x7FFFFFFF
      const back = [];
      let byteSize = 0;
      for (let i = 0; i < str.length; i += 1) {
        // 查找出每个字符的UTF16的码点
        const code = str.charCodeAt(i);
        // 占用一个字节
        if (0x00 <= code && code <= 0x7f) {
          byteSize += 1;
          back.push(code);
        } else if (0x80 <= code && code <= 0x7ff) {
          // 两个字节
          byteSize += 2;
          back.push(192 | (31 & (code >> 6)));
          back.push(128 | (63 & code));
        } else if (
          // 三个字节
          (0x800 <= code && code <= 0xd7ff) ||
          (0xe000 <= code && code <= 0xffff)
        ) {
          byteSize += 3;
          back.push(224 | (15 & (code >> 2)));
          back.push(128 | (63 & (code >> 6)));
          back.push(128 | (63 & code));
        }
      }
      for (let i = 0; i < back.length; i += 1) {
        back[i] &= 0xff;
      }
      if (isGetBytes) {
        return back;
      }
      if (byteSize <= 0xff) {
        return [0, byteSize].concat(back);
      } else {
        return [byteSize >> 8, byteSize & 0xff].concat(back);
      }
    }
    // 前两位表示后面utf8字节的长度。因为长度为3，所以前两个字节为`0，3`
    // 内容为`228, 184, 173`转成16进制就是`0xE4 0xB8 0xAD`
    console.log(UTF8_Encoding('中'));
    const code = str.charCodeAt(i);
    if (0x00 <= code && code <= 0x7f) {
      byteSize += 1;
      back.push(code);
    } else if (0x80 <= code && code <= 0x7ff) {
      byteSize += 2;
      back.push(192 | (31 & (code >> 6)));
      back.push(128 | (63 & code));
    } else if (
      (0x800 <= code && code <= 0xd7ff) ||
      (0xe000 <= code && code <= 0xffff)
    ) {
      byteSize += 3;
      back.push(224 | (15 & (code >> 2)));
      back.push(128 | (63 & (code >> 6)));
      back.push(128 | (63 & code));
    }
  }
  for (let i = 0; i < back.length; i += 1) {
    back[i] &= 0xff;
  }
  if (isGetBytes) {
    return back;
  }
  if (byteSize <= 0xff) {
    return [0, byteSize].concat(back);
  } else {
    return [byteSize >> 8, byteSize & 0xff].concat(back);
  }
}
// 前两位表示后面utf8字节的长度。因为长度为3，所以前两个字节为`0，3`
// 内容为`228, 184, 173`转成16进制就是`0xE4 0xB8 0xAD`
console.log(UTF8_Encoding('中'));

// 读取UTF8编码的字节，并转为Unicode的字符串
function readUTF(arr) {
  if (typeof arr === 'string') {
    return arr;
  }
  let UTF = '',
    arrList = Object.create(arr);
  for (let i = 0; i < arrList.length; i += 1) {
    const one = arrList[i].toString(2),
      v = one.match(/^1+?(?=0)/);
    if (v && one.length === 8) {
      const bytesLength = v[0].length;
      let store = arrList[i].toString(2).slice(7 - bytesLength);
      for (let st = 1; st < bytesLength; st += 1) {
        store += arrList[st + i].toString(2).slice(2);
      }
      UTF += String.fromCharCode(parseInt(store, 2));
      i += bytesLength - 1;
    } else {
      UTF += String.fromCharCode(arrList[i]);
    }
  }
  return UTF;
}

console.log(readUTF([0, 3, 228, 184, 173])); // '中'
// 输出nodejs的buffer
const buffer = new Buffer('中');
console.log('buffer.length=====', buffer.length);
console.log('buffer=====', buffer);
