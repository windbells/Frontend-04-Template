学习笔记

- 产生式（BNF）
  字符串也表示终结符
  ![作业](https://upload-images.jianshu.io/upload_images/11922232-30f97b86b539f568.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
- 基本类型
  1）Null 表示有值但为空，undefined 表示没有赋值过，一般都不会把 undefined 赋值给某个值；Null 是关键字，undefined 是全局变量

```
 function funAbountUndefined() {
  const undefined = 1;
  console.log(undefined); // 1
}

function funAbountNull() {
  const null = 1;
  console.log(null); // 此时eslint会直接提示SyntaxError: Unexpected token 'null'。因为null是关键字，不能直接作为变量名
}
```

最简洁又安全的方法得到 undefined---使用 void 关键字进行一次运算

```
void 0;
```

void 运算符是一个关键字，它的后面不管跟什么，都会变成 undefined 这个值
2）Symbol 专门用于表示 Object 属性名
3）Number
小数点.2 和 0.都是合法的，只要.前后有数字即可
1e3 表示 1000
![小数点表示](https://upload-images.jianshu.io/upload_images/11922232-a2d429127f5f49f8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
要用 0 .toString()或者 0..toString()表示
因为 0.会被当做 0
![0.toString()](https://upload-images.jianshu.io/upload_images/11922232-653dffd7f927b34c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
4）字符串
![正则表达式-转义字符](https://upload-images.jianshu.io/upload_images/11922232-584be4d10a536a75.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
\x 反斜杠 x 16 进制 编解码
\u unicode 编码

```
\u之后跟4位十六进制数。取值范围：\u0000 到 \uffff
\x之后跟2位十六进制数。取值范围：\x00 到 \xff
\x5f 等于 \u005f;
```

5）Object
1）对象的三个组成部分：标识、状态、行为
“归类”、“分类”
“归类”，可以有多继承关系，像 C++
“分类”，单继承，并且会有一个基类 Object，像 Java
2）对象是属性的集合，每个对象都有一个 prototype
3）Symbol 创建了之后，只能通过变量去引用它，能实现属性访问权限控制
4）属性
![属性](https://upload-images.jianshu.io/upload_images/11922232-6b29a10b5d4e0112.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
5）API
![API](https://upload-images.jianshu.io/upload_images/11922232-19b432c899dca087.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

- 作业
  ![优秀作业](https://upload-images.jianshu.io/upload_images/11922232-b3ea512ab07d8047.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
