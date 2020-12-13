import { Component, STATE, ATTRIBUTE, createElement } from './framework';
import { enableGesture } from './gesture';
// 先import再export
export { STATE, ATTRIBUTE } from './framework';; // 以防有其他组件继承Carousel组件

export class Button extends Component {
  constructor() {
    super();
  }
  render() {
    this.childContainer = <span />;
    this.root = (<div>{this.childContainer}</div>).render();
    return this.root;
  }
  appendChild(child) {
    if (!this.childContainer) {
      this.render();
    }
    this.childContainer.appendChild(child);
  }
}