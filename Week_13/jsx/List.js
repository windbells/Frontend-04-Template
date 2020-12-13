import { Component, STATE, ATTRIBUTE, createElement } from './framework';
import { enableGesture } from './gesture';
// 先import再export
export { STATE, ATTRIBUTE } from './framework';; // 以防有其他组件继承Carousel组件

export class List extends Component {
  constructor() {
    super();
  }
  render() {
    this.children =  this[ATTRIBUTE].data.map(this.template);
    this.root = (<div>{this.children}</div>).render();
    return this.root;
  }
  appendChild(child) {
   this.template = (child);
  }
}