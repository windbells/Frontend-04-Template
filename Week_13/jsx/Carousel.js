import { Component, STATE, ATTRIBUTE } from './framework';
import { enableGesture } from './gesture';
import { Timeline, Animation } from './animation';
import { ease } from './ease';
// 先import再export
export { STATE, ATTRIBUTE } from './framework';; // 以防有其他组件继承Carousel组件

export class Carousel extends Component {
  constructor() {
    super();

  }
  render () {
    this.root = document.createElement('div');
    this.root.classList.add('carousel');
    for (let record of this[ATTRIBUTE].src) {
      let child = document.createElement('div');
      child.style.backgroundImage = `url(${record.img})`;
      // child.style.display = 'none';
      this.root.appendChild(child);
    }

    enableGesture(this.root);
    let timeline = new Timeline();
    timeline.start();
    let handler = null;

    let children = this.root.children;
    this[STATE].position = 0;

    let t = 0; // 计算拖拽时的动画开始时间
    let ax = 0;

    this.root.addEventListener('start', (event) => {
      timeline.pause();
      clearInterval(handler);
      if (Date.now() - t < 1500) {
        let progress = (Date.now() - t) / 1500;
        ax = ease(progress) * 500 - 500;
      } else {
        ax = 0;
      }
    });

    this.root.addEventListener('tap', (event) => {
      this.triggerEvent('click', {
        data: this[ATTRIBUTE].src[this[STATE].position], // 图片数据
        position: this[STATE].position
      })
    });

    this.root.addEventListener('pan', (event) => {
      let x = event.clientX - event.startX - ax;

      // 计算当前在屏幕上的元素
      let current = this[STATE].position - ((x - x % 500) / 500);
      for (let offset of [-1, 0, 1]) {
        let pos = current + offset;
        pos = ((pos % children.length) + children.length) % children.length;
        children[pos].style.transition = 'none';
        children[pos].style.transform = `translateX(${-pos * 500 + offset * 500 + (x % 500)
          }px)`; // 从第二张开始的translate
      }
    });

    this.root.addEventListener('end', (event) => {
      // 重新打开时间线
      timeline.reset();
      timeline.start();
      handler = setInterval(nextPicture, 3 * 1000);
      if (event.isFlick) {
        console.log('event.verlo', event.velocity);
      }
      let x = event.clientX - event.startX - ax;
      // 计算当前在屏幕上的元素
      let current = this[STATE].position - ((x - x % 500) / 500);
      let direction = Math.round((x % 500) / 500);
      if (event.isFlick) {
        if ((x % 500 / 500) < 0) {
          direction = Math.ceil((x % 500) / 500);
        } else {
          direction = Math.floor((x % 500) / 500);
        }
      }
      for (let offset of [-1, 0, 1]) {
        let pos = current + offset;
        pos = ((pos % children.length) + children.length) % children.length;
        children[pos].style.transition = 'none';
        timeline.add(
          new Animation(
            children[pos].style,
            'transform',
            -pos * 500 + offset * 500 + (x % 500),
            -pos * 500 + offset * 500 + direction * 500,
            500,
            0,
            ease,
            v => `translateX(${v}px)`
          )
        );
      }
      this[STATE].position = this[STATE].position - ((x - x % 500) / 500) - direction;
      // 防止拖得太远变成了负数，变为正数
      this[STATE].position = (this[STATE].position % children.length + children.length) % children.length;
      this.triggerEvent('change', {position: this[STATE].position})
    });

    let nextPicture = () => {
      let children = this.root.children;
      let nextIndex = (this[STATE].position + 1) % children.length;
      let current = children[this[STATE].position];
      let next = children[nextIndex];
      // next.style.transition = 'none'; // 不显示动画
      // next.style.transform = `translateX(${500 - nextIndex * 500}px)`;
      t = Date.now();
      timeline.add(
        new Animation(
          current.style,
          'transform',
          -this[STATE].position * 500,
          -500 - this[STATE].position * 500,
          500,
          0,
          ease,
          v => `translateX(${v}px)`
        )
      );
      timeline.add(
        new Animation(
          next.style,
          'transform',
          500 - nextIndex * 500,
          - nextIndex * 500,
          500,
          0,
          ease,
          v => `translateX(${v}px)`
        )
      );
      this[STATE].position = nextIndex;
      this.triggerEvent('change', {position: this[STATE].position})

      // for (let child of children) {
      //   child.style.transform = `translateX(-${current * 100}%)`;
      // }
    };
    handler = setInterval(nextPicture, 3 * 1000);

    /** 

    // 增加鼠标事件
    this.root.addEventListener('mousedown', (event) => {
      console.log('mousedown');
      let startX = event.clientX;
      // startY = event.clientY; // 相对于浏览器渲染区域的坐标

      let move = (event) => {
        let children = this.root.children;
        let x = event.clientX - startX;

        // 计算当前在屏幕上的元素
        // let current = this[STATE].position - Math.round(x / 500);
        let current = this[STATE].position - (x - (x % 500)) / 500;
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
        //   child.style.transform = `translateX(${-this[STATE].position * 500 + x}px)`; // 从第二张开始的translate
        // }
      };
      let up = (event) => {
        let children = this.root.children;
        let x = event.clientX - startX;
        this[STATE].position = this[STATE].position - Math.round(x / 500); // 拖够了一半就显示后一个位置，否则为前一个位置
        // for (let child of children) {
        //   child.style.transition = '';
        //   child.style.transform = `translateX(${-this[STATE].position * 500}px)`;
        // }
        for (let offset of [
          0,
          -Math.sign(Math.round(x / 500) - x + 250 * Math.sign(x)),
        ]) {
          let pos = this[STATE].position + offset;
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
    */

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
  // mountTo(parent) {
  //   parent.appendChild(this.render());
  // }
}
