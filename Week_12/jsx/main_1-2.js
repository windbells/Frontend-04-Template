// for (let i of [1, 2, 3]) {
//   console.log(i);
// }

function createElement(elementType, attributes, ...children) {
  // let element = document.createElement(type);

  let element;
  if (typeof element === 'string') {
    // element = document.createElement(elementType);
    element = new ElementWrapper(type);
  } else {
    element = new Div();
  }
  for (let name in attributes) {
    element.setAttribute(name, attributes[name]);
  }
  for (let child of children) {
    if (typeof child === 'string') {
      // child = document.createTextNode(child);
      child = new TextWrapper(child);
    }
    element.appendChild(child);
  }
  return element;
}

// let a = (
//   <div id="a">
//     <span>a</span>
//     <span>b</span>
//     <span>c</span>
//   </div>
// );

// let a = <div id="a">Hello World</div>;

class Div {
  constructor() {
    this.root = document.createElement('div');
  }
  setAttribute(name, value) {
    this.root.setAttribute(name, value);
  }
  appendChild(child) {
    // this.root.appendChild(child);
    child.mountTo(this.root);
  }
  mountTo(parent) {
    parent.appendChild(this.root);
  }
}

class ElementWrapper {
  constructor(type) {
    this.root = document.createElement(type);
  }
  setAttribute(name, value) {
    this.root.setAttribute(name, value);
  }
  appendChild(child) {
    // this.root.appendChild(child);
    child.mountTo(this.root);
  }
  mountTo(parent) {
    parent.appendChild(this.root);
  }
}

class TextWrapper {
  constructor(content) {
    this.root = document.createTextNode(content);
  }
  setAttribute(name, value) {
    this.root.setAttribute(name, value);
  }
  appendChild(child) {
    // this.root.appendChild(child);
    child.mountTo(this.root);
  }
  mountTo(parent) {
    parent.appendChild(this.root);
  }
}

let a = (
  <div id="a">
    <span>a</span>
    <span>b</span>
    <span>c</span>
  </div>
);
// document.body.appendChild(a);

a.mountTo(document.body);
