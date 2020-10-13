console.log('==============以下是JS预处理机制相关的代码================');
var a = 2;
void (function () {
  a = 1;
  return;
  var a;
})();
console.log(a);

var a = 2;
void (function () {
  a = 1;
  return;
  const a;
})();
console.log(a);

console.log('==============结束================');

console.log('==============以下是JS作用域机制相关的代码================');
// var的作用域是它所在的函数体
var a = 2;
void function() {
  a = 1;
  {
    var a ;
  }
}();
console.log(a);

// const的作用域就在它所在的花括号
var a = 2;
void function() {
  a = 1;
  {
    const a ;
  }
}();
console.log(a);
