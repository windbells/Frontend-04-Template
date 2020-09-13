function kmp(source, pattern) {
  // 计算table
  const table = new Array(pattern.length).fill(0);
  // 匹配
  {
    // i是自重复串开始的位置。j是当前已重复元素的个数（不匹配的时候，下一个匹配串开始的位置）
    let i = 1,
      j = 0;
    // 求next数组，数组元素保存的是被匹配元素上一次匹配的位置
    while (i < pattern.length) {
      // 匹配，指针向前移动
      if (pattern[i] === pattern[j]) {
        ++i, ++j;
        // table[i]的重复字数等于j
        table[i] = j;
      } else {
        // 不匹配
        if (j > 0) {
          j = table[j];
        } else {
          ++i;
        }
      }
    }
  }

  // console.log(table);
  // 比较两个元素，并进行移动
  {
    let i = 0,
      j = 0;
    while (i < source.length) {
      // 匹配，指针向前移动
      if (source[i] === pattern[j]) {
        ++i, ++j;
      } else {
        // 不匹配
        if (j > 0) {
          j = table[j];
        } else {
          ++i;
        }
      }
      if (j === pattern.length) {
        return true;
      }
    }
    return false;
  }
}

// kmp('', 'abcdabce');
// kmp('', 'aabaaac');
// console.log(kmp('helxlo', 'll'));
console.log(kmp('abc', 'abc'));
