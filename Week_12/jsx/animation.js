/*
实现动画的三种方式
// 1、帧动画
setInterval(() => {}, 16);

let tick = () => {
  // 2、setTimeout(tick, 16);
  // 3 、
  const handler = requestAnimationFrame(tick, 16); // 浏览器执行下一帧的时候，执行这个代码，跟浏览器的帧率相关
  cancelAnimationFrame(handler); // 取消requestAnimationFrame，避免资源浪费
};
*/

import { linear } from './ease.js';

const TICK = Symbol('tick');
const TICK_HANDLER = Symbol('tick-handler');
const ANIMATIONS = Symbol('animations');
const START_TIME = Symbol('start-time');
const PAUSE_START = Symbol('pause-start');
const PAUSE_TIME = Symbol('pause-time');

export class Timeline {
  constructor() {
    this.state = 'inited';
    this[ANIMATIONS] = new Set();
    this[START_TIME] = new Map();
  }

  start() {
    if (this.state !== 'inited') {
      return;
    }
    this.state = 'started'; 
    const startTime = Date.now();
    this[PAUSE_TIME] = 0;
    this[TICK] = () => {
      let now = Date.now();
      for (const animation of this[ANIMATIONS]) {
        let t;
        if (this[START_TIME].get(animation) < startTime) {
          t = now - startTime - this[PAUSE_TIME] - animation.delay;
        } else {
          t = now - this[START_TIME].get(animation) - this[PAUSE_TIME] - animation.delay;
        }
        if (animation.duration < t) {
          this[ANIMATIONS].delete(animation);
          t = animation.duration;
        }
        if (t > 0) {
          animation.receiveTime(t);
        }
      }
      this[TICK_HANDLER] = requestAnimationFrame(this[TICK]);
    }
    this[TICK]();
  }

  set rate(rate) {
    // 设置播放速率
  }
  get rate() {}
  pause() {
   if (this.state !== 'started') {
      return;
    }
    this.state = 'paused';
    // 记录暂停开始和结束的时间
    this[PAUSE_START] = Date.now();
    cancelAnimationFrame(this[TICK_HANDLER]);
  }
  resume() {
    // 重新开始
    if (this.state !== 'paused') {
      return;
    }
    this.state = 'started';
    this[PAUSE_TIME] += Date.now() - this[PAUSE_START]; // 得到暂停时间
    this[TICK]();
  }
  reset() {
    this.pause();
    this[ANIMATIONS] = new Set();
    this[START_TIME] = new Map();
    this[TICK_HANDLER] = null;
    this[PAUSE_TIME] = 0;
    this[PAUSE_START] = 0;
    this.state = 'inited';
  }
  add(animation, startTime) {
    if (arguments.length < 2) {
      startTime = Date.now();
    }
    this[ANIMATIONS].add(animation);
    this[START_TIME].set(animation, startTime);
  }
  remove(animation) {}
}

export class Animation {
  // 属性动画
  constructor(object, property, startValue, endValue, duration, delay, timingFunction, template) {
    this.object = object;
    this.property = property;
    this.startValue = startValue;
    this.endValue = endValue;
    this.duration = duration;
    this.delay = delay;
    this.timingFunction = timingFunction || (v => v);
    this.template = template || (v => v);
  }
  receiveTime(time) {
    let range = this.endValue - this.startValue;
    // timingFunction是关于0-1的time返回0-1的progress的函数
    let progress = this.timingFunction(time / this.duration);
    this.object[this.property] = this.template(
      this.startValue + range * progress
    );
  }
}
