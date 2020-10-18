const EOF = Symbol('EOF');

function data(c) {
  // 判断是不是标签的开始（开始标签、结束标签、自闭合标签）
  if (c === '<') {
    return tagOpen;
  } else if (c === EOF) {
    return;
  } else {
    // 文本节点
    return data;
  }
}

function tagOpen(c) {
  // 判断是不是结束标签
  if (c === '/') {
    return endTagOpen;
  } else if (c.match(/^[a-zA-Z]$/)) {
    // 开始标签或者自闭合标签
    return tagName(c);
  } else {
    return;
  }
}

function endTagOpen(c) {
  if (c.match(/^[a-zA-Z]$/)) {
    return tagName(c);
  } else if (c === '>') {
    // 结束标签紧跟着>，报错
  } else if (c === EOF) {
    // 结束标签紧跟着EOF，报错
  } else {
  }
}

function tagName(c) {
  // tagName以空白符结束
  // tab/换行符/禁止符/空白符
  if (c.match(/^[\t\n\f ]$/)) {
    // 例如<span class=""></span>，空白符之后跟着就是属性名
    return beforeAttributeName;
  } else if (c === '/') {
    return selfClosingStartTag;
  } else if (c.match(/^[a-zA-Z]$/)) {
    return tagName;
  } else if (c === '>') {
    // 说明是普通的开始标签
    return data;
  } else {
    return tagName;
  }
}

function beforeAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c === '>') {
    return data;
  } else if (c === '=') {
    return beforeAttributeName;
  } else {
    return beforeAttributeName;
  }
}

function selfClosingStartTag(c) {
  if (c === '>') {
    return data;
  } else if (c === 'EOF') {
  } else {
  }
}

module.exports.parseHTML = function parseHTML(html) {
  let state = data;
  for (let c of html) {
    state = state(c);
  }
  state = state(EOF);
};
