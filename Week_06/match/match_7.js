function match(string) {
  let state = start;
  for (let c of string) {
    state = state(c);
  }
  return state === end;
}

function start(c) {
  if (c === 'a') {
    return foundA;
  }
  return start;
}

function end() {
  return end;
}

// 状态函数
function foundA(c) {
  if (c === 'b') {
    return foundB;
  }
  return start(c);
}

function foundB(c) {
  if (c === 'c') {
    return foundC;
  }
  return start(c);
}

function foundC(c) {
  if (c === 'a') {
    return foundA2;
  }
  return start(c);
}

function foundA2(c) {
  if (c === 'b') {
    return foundB2;
  }
  return start(c);
}

function foundB2(c) {
  if (c === 'x') {
    // 结束状态，标志着已经找到了
    return end;
  }
  // 回到前面的foundB，abc?
  return foundB(c);
}

console.log(match('I mababcabcabxdefgroot'));
