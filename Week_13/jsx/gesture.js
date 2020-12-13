// let element = document.documentElement; // 代表HTML元素


let handler;
let startX;
let startY;
let isPan = false;
let isTap = true;
let isPress = false;


// export function dispatch (type, properties) {
//   let event = new Event(type);
//   for (let name in properties) {
//     event[name] = properties[name];
//   }
//   event.dispatchEvent(event);
//   console.log(event);
// }

export class Dispatcher  {
  constructor(element) {
    this.element = element;
  }
  dispatch (type, properties) {
    let event = new Event(type);
    for (let name in properties) {
      event[name] = properties[name];
    }
    this.element.dispatchEvent(event);
    // console.log(event);
  }
}

export class Listener {
  constructor(element, recognizer) {
    let isListeningMouse = false;
    let contexts = new Map();
    element.addEventListener('mousedown', (event) => {
      let context = Object.create(null); // 避免Object原型链上面的其他属性污染
      contexts.set('mouse' + (1 << event.button), context); // 表示按下了哪个键，左键0， 右键2，中键1
      recognizer.start(event, context);
      let mousemove = (event) => {
        // event.buttons 表示有哪些键被按下了
        let button = 1;
        while (button <= event.buttons) {
          // 1 2 4 8 16 32
          if (button & event.buttons) {
            // 鼠标的中键和右键的key和button刚好相反
            // order of buttons & button property is not same
            let key;
            if (button === 2) {
              key = 4;
            }
            else if (button === 4) {
              key = 2;
            }
            else {
              key = button;
            }
            let context = contexts.get('mouse' + key);
            recognizer.move(event, context);
          }
          button = button << 1;
        }
      };

      let mouseup = (event) => {
        let context = contexts.get('mouse' + (1 << event.button));
        recognizer.end(event, context);
        contexts.delete('mouse' + (1 << event.button));
        if (event.buttons === 0) {
          document.removeEventListener('mousemove', mousemove);
          document.removeEventListener('mouseup', mouseup);
          isListeningMouse = false;
        }
      };
      if (!isListeningMouse) {
        document.addEventListener('mousemove', mousemove);
        document.addEventListener('mouseup', mouseup);
        isListeningMouse = true;
      }
    });

    element.addEventListener('touchstart', (event) => {
      //  一定会触发move，touch和move的位置会在同一个
      for (let touch of event.changedTouches) {
        let context = Object.create(null);
        contexts.set(touch.identifier, context);
        recognizer.start(touch, context);
      }
    });
    element.addEventListener('touchmove', (event) => {
      for (let touch of event.changedTouches) {
        let context = contexts.get(touch.identifier);
        recognizer.move(touch, context);
      }
    });
    element.addEventListener('touchend', (event) => {
      for (let touch of event.changedTouches) {
        let context = contexts.get(touch.identifier);
        recognizer.end(touch, context);
        contexts.delete(touch.identifier);
      }
    });
    element.addEventListener('touchcancel', (event) => {
      for (let touch of event.changedTouches) {
        let context = contexts.get(touch.identifier);
        recognizer.cancel(touch, context);
        contexts.delete(touch.identifier);
      }
    });
  }
}

export class Recognizer {
  constructor(dispatcher) {
    this.dispatcher = dispatcher;
  }
  start (point, context) {
    context.startX = point.clientX;
    context.startY = point.clientY;
    this.dispatcher.dispatch('start', {
      clientX: point.clientX,
      clientY: point.clientY,
    });
    context.points = [{
      t: Date.now(),
      x: point.clientX,
      y: point.clientY,
    }];
    context.isTap = true;
    context.isPan = false;
    context.isPress = false;
    context.handler = setTimeout(() => {
      context.isTap = false;
      context.isPan = false;
      context.isPress = true;
      context.handler = null;
      // console.log('press');
      this.dispatcher.dispatch('press', {});
    }, 500);
  };
  move (point, context) {
    let dx = point.clientX - context.startX;
    let dy = point.clientY - context.startY;
    if (!context.isPan && dx ** 2 + dy ** 2 > 100) {
      //  移动的距离大于10px
      context.isTap = false;
      context.isPan = true;
      context.isPress = false;
      context.isVertical = Math.sqrt(dx) < Math.sqrt(dy);
      // console.log('panstart');
      this.dispatcher.dispatch('panstart', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical, // 区分上下滑还是左右滑
      });
      clearTimeout(context.handler);
    }
    if (context.isPan) {
      // console.log(dx, dy);
      // console.log('pan');
      this.dispatcher.dispatch('pan', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical, // 区分上下滑还是左右滑
      });
    }
    context.points = context.points.filter(point => Date.now() - point.t < 500)
    context.points.push({
      t: Date.now(),
      x: point.clientX,
      y: point.clientY,
    })
  };
  end (point, context) {
    if (context.isTap) {
      // 既没有定时的触发，也没有发生运动
      // console.log('tap');
      this.dispatcher.dispatch('tap', {});
      clearTimeout(context.handler);
    }

    if (context.isPress) {
      // console.log('pressend');
      this.dispatch.dispatch('pressend', {})
    }
    context.points = context.points.filter(point => Date.now() - point.t < 500);
    let d;
    let v;
    if (!context.points.length) {
      v = 0;
    } else {
      d = Math.sqrt((point.clientX - context.points[0].x) ** 2 + (point.clientY - context.points[0].y) ** 2);
      v = d / (Date.now() - context.points[0].t);
    }
    if (v > 1.5) {
      // console.log('flick');
      context.isFlick = true;
      this.dispatcher.dispatch('flick', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical, // 区分上下滑还是左右滑
        isFlick: context.isFlick,
        velocity: v,
      });
    } else {
      context.isFlick = false;
    }
    if (context.isPan) {
      // console.log('panend');
      this.dispatcher.dispatch('panend', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical, // 区分上下滑还是左右滑
        isFlick: context.isFlick,
        velocity: v,
      });
    }
    this.dispatcher.dispatch('end', {
      startX: context.startX,
      startY: context.startY,
      clientX: point.clientX,
      clientY: point.clientY,
      isVertical: context.isVertical, // 区分上下滑还是左右滑
      isFlick: context.isFlick,
      velocity: v,
    });

    // console.log("速度", v);
  };
  cancel (point, context) {
    clearTimeout(context.handler);
    this.dispatcher.dispatch('cancel', {});
  };
}

export function enableGesture (element) {
  new Listener(element, new Recognizer(new Dispatcher(element)));
}