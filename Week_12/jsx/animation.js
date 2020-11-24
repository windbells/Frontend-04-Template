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

const TICK = Symbol('tick');
const TICK_HANDLER = Symbol('tick-handler');
const ANIMATIONS = Symbol('animations');

export class Timeline {
  constructor() {
    this[ANIMATIONS] = new Set();
  }
  start() {
    let startTime = Date.now();
    this[TICK] = () => {
      let t = Date.now() - startTime;
      for (let animation of this[ANIMATIONS]) {
        let t0 = t;
        if (animation.duration < t) {
          this[ANIMATIONS].delete(animation);
          t0 = animation.duration;
        }
        animation.receive(t0);
      }
      requestAnimationFrame(this[TICK]);
    };
    this[TICK]();
  }

  set rate(rate) {
    // 设置播放速率
  }
  get rate() {}
  pause() {}
  resume() {
    // 重新开始
  }
  reset() {}
  add(animation) {
    this[ANIMATIONS].add(animation);
  }
  remove(animation) {}
}

export class Animation {
  // 属性动画
  constructor(
    object,
    property,
    startValue,
    endValue,
    duration,
    timingFunction
  ) {
    this.object = object;
    this.property = property;
    this.startValue = startValue;
    this.endValue = endValue;
    this.duration = duration;
    this.timingFunction = timingFunction;
  }
  receive(time) {
    let range = this.endValue - this.startValue;
    this.object[this.property] =
      this.startValue + (range * time) / this.duration;
  }
}
