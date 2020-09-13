学习笔记

关键三大能力 编程能力、架构能力、工程能力

学习方法 整理法，解决知识完备性的问题 从不同维度整理归纳关联的知识点

追溯法，解决知识准确性和深度的问题 了解知识点变迁历史，查看标准文档 w3.org developer.mozilla.org msdn.microsoft.com developer.apple.com

> 对象深拷贝方法
> JSON.parse(JSON.stringify(object)); // 无法拷贝原型链属性和方法

Object.create(object); // 继承自原对象 object

object2 = {...object1}; // 仅限其属性都为基本类型的情况
