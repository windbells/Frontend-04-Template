// 要点：计算元素位置
/** CSS优先级
 * [0,                            0,    0,     0]
 * inline(写在style里面的属性)    id   class   tagName
 * 1000                          100   10       1
 */
let currentToken = null;
let currentAttribute = null;
let currentTextNode = null;
let stack = [{ type: 'document', children: [] }];
const EOF = Symbol('EOF');
const css = require('css');
const layout = require('./layout4_4.js');

// 把CSS规则暂存到一个数组里面
let rules = [];
function addCSSRules(text) {
  const ast = css.parse(text);
  // console.log(JSON.stringify(ast, null, '    '));
  rules.push(...ast.stylesheet.rules);
}

// 计算优先级
function specificity(selector) {
  const p = [0, 0, 0, 0];
  const selectorParts = selector.split(' ');
  for (const part of selectorParts) {
    if (part.charAt(0) === '#') {
      p[1] += 1;
    } else if (part.charAt === '.') {
      p[2] += 1;
    } else {
      p[3] += 1;
    }
  }
  return p;
}

function compare(sp1, sp2) {
  if (sp1[0] - sp2[0]) {
    return sp1[0] - sp2[0];
  }
  if (sp1[1] - sp2[1]) {
    return sp1[1] - sp2[1];
  }
  if (sp1[2] - sp2[2]) {
    return sp1[2] - sp2[2];
  }
  return sp1[3] - sp2[3];
}

function match(element, selector) {
  // element.attributes判断是否是文本节点
  if (!selector || !element.attributes) {
    return false;
  }
  // id选择器
  if (selector.charAt(0) === '#') {
    const attr = element.attributes.filter((attr) => attr.name === 'id')[0];
    if (attr && attr.value === selector.replace('#', '')) {
      return true;
    }
  } else if (selector.charAt(0) === '.') {
    // 类选择器
    const attr = element.attributes.filter((attr) => attr.name === 'class')[0];
    if (attr && attr.value === selector.replace('.', '')) {
      return true;
    }
  } else {
    // 元素选择器
    if (element.tagName === selector) {
      return true;
    }
  }
  return false;
}

function computeCSS(element) {
  // slice不传参数的时候，默认就是把整个数组复制一遍（不影响原数组）
  const elements = stack.slice().reverse();
  if (!element.computedStyle) {
    element.computedStyle = {};
  }
  for (let rule of rules) {
    const selectorParts = rule.selectors[0].split(' ').reverse();
    if (!match(element, selectorParts[0])) {
      continue;
    }
    let matched = false;
    let j = 1; // 当前选择器的位置
    // i表示当前元素的位置
    for (let i = 0; i < elements.length; i += 1) {
      if (match(elements[i], selectorParts[j])) {
        j++;
      }
    }
    if (j >= selectorParts.length) {
      matched = true;
    }
    if (matched) {
      const sp = specificity(rule.selectors[0]);
      const computedStyle = element.computedStyle;
      for (const declaration of rule.declarations) {
        if (!computedStyle[declaration.property]) {
          computedStyle[declaration.property] = {};
        }
        if (!computedStyle[declaration.property].specificity) {
          computedStyle[declaration.property].value = declaration.value;
          computedStyle[declaration.property].specificity = sp;
        } else if (
          compare(computedStyle[declaration.property].specificity, sp) < 0
        ) {
          // computedStyle[declaration.property].value = declaration.value;
          // computedStyle[declaration.property].specificity = sp;
          for (const k = 0; k < 4; k += 1) {
            computedStyle[declaration.property][declaration.value][k] += sp[k];
          }
        }
      }
      // console.log(element.computedStyle);
    }
  }
}

function emit(token) {
  // 取出栈顶
  let top = stack[stack.length - 1];
  if (token.type === 'startTag') {
    let element = {
      type: 'element',
      children: [],
      attributes: [],
    };

    element.tagName = token.tagName;

    for (let p in token) {
      if (p !== 'type' && p !== 'tagName') {
        element.attributes.push({
          name: p,
          value: token[p],
        });
      }
    }
    // 在startTag入栈的时候，计算CSS规则
    computeCSS(element);
    // layout(element);

    top.children.push(element);
    element.parent = top;

    if (!token.isSelfClosing) {
      stack.push(element);
    }
    currentTextNode = null;
  } else if (token.type === 'endTag') {
    if (top.tagName !== token.tagName) {
      debugger;
      throw new Error("Tag start end doesn't match");
    } else {
      // 遇到style标签，执行添加到CSS规则的操作
      if (top.tagName === 'style') {
        addCSSRules(top.children[0].content);
      }
      stack.pop(); // 配对成功
      layout(top);
    }
    currentTextNode = null;
  } else if (token.type === 'text') {
    if (currentTextNode === null) {
      currentTextNode = {
        type: 'text',
        content: '',
      };
      top.children.push(currentTextNode);
    }
    currentTextNode.content += token.content;
  }
}

function data(c) {
  // 判断是不是标签的开始（开始标签、结束标签、自闭合标签）
  if (c === '<') {
    return tagOpen;
  } else if (c === EOF) {
    emit({
      type: 'EOF',
    });
    return;
  } else {
    emit({
      type: 'text',
      content: c,
    });
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
    currentToken = {
      type: 'startTag',
      tagName: '',
    };
    return tagName(c);
  } else {
    emit({
      type: 'text',
      content: c,
    });
    return;
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
    // 字母追加到tagName
    currentToken.tagName += c;
    return tagName;
  } else if (c === '>') {
    // 说明是普通的开始标签
    emit(currentToken);
    return data;
  } else {
    currentToken.tagName += c;
    return tagName;
  }
}

function endTagOpen(c) {
  if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'endTag',
      tagName: '',
    };
    return tagName(c);
  } else if (c === '>') {
    // 结束标签紧跟着>，报错
  } else if (c === EOF) {
    // 结束标签紧跟着EOF，报错
  } else {
  }
}

function beforeAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c === '/' || c === '>' || c === EOF) {
    return afterAttributeName(c);
  } else if (c === '=') {
    // return beforeAttributeName;
  } else {
    currentAttribute = {
      name: '',
      value: '',
    };
    return attributeName(c);
  }
}

// function afterAttributeName(c) {
//   if (c.match(/^[\t\n\f ]$/)) {
//     return afterAttributeName;
//   } else if (c === '/' || c === '>') {
//     return selfClosingStartTag;
//   } else if (c === EOF) {
//     return data;
//   } else if (c === '=') {
//     return beforeAttributeValue;
//   } else {
//     return afterAttributeName;
//   }
// }

function afterAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return afterAttributeName;
  } else if (c === '/') {
    return selfClosingStartTag;
  } else if (c === '=') {
    return beforeAttributeValue;
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c === EOF) {
    // return data;
  } else {
    currentToken[currentAttribute.name] = currentAttribute.value;
    currentAttribute = {
      name: '',
      value: '',
    };
    return attributeName(c);
  }
}

// 属性值分为单引号、双引号和无引号三种写法
function attributeName(c) {
  // <div class="a" ></div>
  if (c.match(/^[\t\n\f ]$/) || c === '/' || c === '>' || c === EOF) {
    return afterAttributeName(c);
  } else if (c === '=') {
    // 对应value
    return beforeAttributeValue;
  } else if (c === '\u0000') {
  } else if (c === '"' || c === "'" || c === '<') {
  } else {
    currentAttribute.name += c;
    return attributeName;
  }
}

function beforeAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/) || c === '/' || c === '>' || c === EOF) {
    return beforeAttributeValue;
  } else if (c === '"') {
    return doubleQuotedAttributeValue;
  } else if (c === "'") {
    return singleQuotedAttributeValue;
  } else if (c === '>') {
  } else {
    return UnquotedAttributeValue(c);
  }
}

// 只找双引号结束
function doubleQuotedAttributeValue(c) {
  if (c === '"') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (c === '\u0000') {
  } else if (c === EOF) {
  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}

// function afterQuotedAttributeValue(c) {
//   if (c.match(/^[\t\n\f ]$/)) {
//     return beforeAttributeName;
//   } else if (c === '/') {
//     return selfClosingStartTag;
//   } else if (c === '>') {
//     currentToken[currentAttribute.name] = currentAttribute.value;
//     emit(currentToken);
//     return data;
//   } else if (c === EOF) {
//   } else {
//     currentAttribute.value += c;
//     return doubleQuotedAttributeValue;
//   }
// }

// 只找单引号结束
function singleQuotedAttributeValue(c) {
  if (c === "'") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (c === '\u0000') {
  } else if (c === EOF) {
  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}

function afterQuotedAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c === '/') {
    return selfClosingStartTag;
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentAttribute);
    return data;
  } else if (c === EOF) {
  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}

function UnquotedAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    // currentToken：标签
    currentToken[currentAttribute.name] = currentAttribute.value;
    return beforeAttributeName;
  } else if (c === '/') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return selfClosingStartTag;
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c === '\u0000') {
  } else if (c === '"' || c === "'" || c === '<' || c === '=' || c === '`') {
  } else if (c === EOF) {
  } else {
    currentAttribute.value += c;
    return UnquotedAttributeValue;
  }
}

function selfClosingStartTag(c) {
  if (c === '>') {
    currentToken.isSelfClosing = true;
    emit(currentToken);
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
  return stack[0];
};
