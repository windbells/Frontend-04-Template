import { Component } from './framework';

export class Carousel extends Component {
  constructor() {
    super();
    this.attributes = Object.create(null);
  }
  setAttribute(name, value) {
    this.attributes[name] = value;
  }
  render() {
    console.log(this.attributes.src);
    this.root = document.createElement('div');
    this.root.classList.add('carousel');
    for (let record of this.attributes.src) {
      let child = document.createElement('div');
      child.style.backgroundImage = `url(${record})`;
      // child.style.display = 'none';
      this.root.appendChild(child);
    }
    let position = 0;

    // 增加鼠标事件
    this.root.addEventListener('mousedown', (event) => {
      console.log('mousedown');
      let startX = event.clientX;
      // startY = event.clientY; // 相对于浏览器渲染区域的坐标

      let move = (event) => {
        let children = this.root.children;
        let x = event.clientX - startX;

        // 计算当前在屏幕上的元素
        // let current = position - Math.round(x / 500);
        let current = position - (x - (x % 500)) / 500;
        for (let offset of [-1, 0, 1]) {
          let pos = current + offset;
          pos = (pos + children.length) % children.length;
          let child = children[pos];
          child.style.transition = 'none';
          child.style.transform = `translateX(${
            -pos * 500 + offset * 500 + (x % 500)
          }px)`; // 从第二张开始的translate
        }
        // for (let child of children) {
        //   child.style.transition = 'none';
        //   child.style.transform = `translateX(${-position * 500 + x}px)`; // 从第二张开始的translate
        // }
      };
      let up = (event) => {
        let children = this.root.children;
        let x = event.clientX - startX;
        position = position - Math.round(x / 500); // 拖够了一半就显示后一个位置，否则为前一个位置
        // for (let child of children) {
        //   child.style.transition = '';
        //   child.style.transform = `translateX(${-position * 500}px)`;
        // }
        for (let offset of [
          0,
          -Math.sign(Math.round(x / 500) - x + 250 * Math.sign(x)),
        ]) {
          let pos = position + offset;
          pos = (pos + children.length) % children.length;
          let child = children[pos];
          child.style.transition = '';
          child.style.transform = `translateX(${-pos * 500 + offset * 500}px)`; // 从第二张开始的translate
        }
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);
      };
      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    });

    // 自动轮播
    // let currentIndex = 0;
    // setInterval(() => {
    //   currentIndex += 1;
    //   // currentIndex = currentIndex % children.length;
    //   let children = this.root.children;
    //   let nextIndex = currentIndex % children.length;
    //   let current = children[currentIndex];
    //   let next = children[nextIndex];
    //   next.style.transition = 'none'; // 不显示动画
    //   next.style.transform = `translateX(${100 - nextIndex * 100}%)`;

    //   setTimeout(() => {
    //     next.style.transition = '';
    //     current.style.transform = `translateX(${-100 - currentIndex * 100}%)`;
    //     next.style.transform = `translateX(${-nextIndex * 100}%)`;

    //     currentIndex = nextIndex;
    //   }, 16); // 16毫秒为浏览器一帧的时间

    //   // for (let child of children) {
    //   //   child.style.transform = `translateX(-${current * 100}%)`;
    //   // }
    // }, 3 * 1000);

    return this.root;
  }
  mountTo(parent) {
    parent.appendChild(this.render());
  }
}
