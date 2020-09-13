学习笔记

- 用一维数组表示 n*n 的二维数组，index = i * n + j

- 鼠标事件
  mousedown 鼠标按下事件
  mouseup 鼠标回弹事件 event.which 1-左键 2-滚轮 3-右键
  mousemove 鼠标移动事件
  contextmenu 右键菜单事件

- 数组方法
  shift 删除第一个元素，返回该元素的值
  unshift 在数组头部插入一个或多个元素，返回新数组长度
  push 在数组末尾插入一个或多个元素，返回新数组长度
  pop 删除最后一个元素，返回该元素的值
  **队列 push + shift pop + unshift**
  **栈 push + pop shift + unshift**
- 正则表达式
  如果 exec() 找到了匹配的文本，则返回一个结果数组。否则，返回 null。此数组的第 0 个元素是与正则表达式相匹配的文本，第 1 个元素是与 RegExpObject 的第 1 个子表达式相匹配的文本（如果有的话），第 2 个元素是与 RegExpObject 的第 2 个子表达式相匹配的文本（如果有的话），以此类推。
  ()圆括号表示捕获 exec 方法 当正则表达式使用 "g" 标志时，可以多次执行 exec 方法来查找同一个字符串中的成功匹配
  [exec](https://www.w3school.com.cn/js/jsref_exec_regexp.asp)

备注：
每个文件夹里面的 course 目录下的文件是课程的小练习，xx_final.html 文件才是最终的效果文件
