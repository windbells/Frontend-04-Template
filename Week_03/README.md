学习笔记

- KMP 模式匹配算法
  对应刷题 leecode 28
  理解帮助指南
  [阮一峰的 KMP 讲解](http://www.ruanyifeng.com/blog/2013/05/Knuth%E2%80%93Morris%E2%80%93Pratt_algorithm.html)
  [漫画版讲解](https://baijiahao.baidu.com/s?id=1659735837100760934&wfr=spider&for=pc)
- wildcard 算法
  abacabc*ad 前面的星号尽可能少匹配，最后一个星号尽可能多匹配 *+后面的字符串为一组，用 kmp 匹配
- Range 对象
  Range 对象代表页面上一段连续的区域，通过 Range 对象可以获取或者修改页面上任何区域的内容。也可以通过 Range 的方法进行复制和移动页面任何区域的元素。
  [Range 对象详情请看文档](https://www.jianshu.com/p/ad2f818cc3b0)

```
  // 禁止选中选项事件
      document.addEventListener('selectstart', (event) =>
        event.preventDefault()
      );
```

DOM 的 insert 等方法，默认会把已经在 dom 里的元素移除掉再插入到新的位置

备注：
每个文件夹里面的 course 目录下的文件是课程的小练习，xx_final.html 文件才是最终的效果文件
