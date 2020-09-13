// Wildcard字符串有两种通用匹配符，* 和 ？
function find(source, pattern) {
  let startCount = 0;
  for (let i = 0; i < pattern.length; i += 1) {
    if (pattern[i] === '*') {
      startCount++;
    }
  }
  // 字符串没有*，逐字严格匹配
  if (startCount === 0) {
    for (let i = 0; i < pattern.length; i += 1) {
      if (pattern[i] !== source[i] && pattern[i] !== '?') {
        return false;
      }
    }
    return;
  }

  // 处理第一个*之前的部分
  let i = 0; // pattern的位置
  let lastIndex = 0; // 表示原字符串source的位置
  for (i = 0; pattern[i] !== '*'; i += 1) {
    if (pattern[i] !== source[i] && pattern[i] !== '?') {
      return false;
    }
  }
  lastIndex = i;

  // 循环从第二个到倒数第一个*
  for (let p = 0; p < startCount - 1; p += 1) {
    i++;
    let subPattern = '';
    while (pattern[i] !== '*') {
      subPattern += pattern[i];
      i++;
    }
    // 将？改成匹配任意字符串
    let reg = new RegExp(subPattern.replace(/\?/g, '[\\s\\S]'), 'g');
    reg.lastIndex = lastIndex; // 正则的lastIndex决定了从exec()的哪个位置开始
    console.log(reg.exec(source));
    // 没有匹配到
    if (!reg.exec(source)) {
      return false;
    }
    lastIndex = reg.lastIndex;
  }

  // 处理最后一个*，从source的尾巴开始
  for (
    let j = 0;
    j <= source.length - lastIndex && pattern[pattern.length - j] !== '*';
    j += 1
  ) {
    if (
      pattern[pattern.length - j] !== source[source.length - j] &&
      pattern[pattern.length - j] !== '?'
    ) {
      return false;
    }
  }
  return true;
}

// find('abcabcabxaac', 'a*b*bx*c');
console.log('结果是：', find('abcabcabxaac', 'a*b?*bx*c'));
