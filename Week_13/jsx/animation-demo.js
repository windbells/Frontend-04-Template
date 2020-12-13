// import { createElement, Component } from './framework';
// import { Carousel } from './carousel';
import { Timeline, Animation } from './animation.js';
import { ease } from './ease.js';


let tl = new Timeline();
tl.start();
tl.add(new Animation(document.querySelector('#el').style, 'transform', 0, 500, 4000, 2000, ease, v => `translate(${v}px)`));

document.querySelector('#pause-btn').addEventListener('click', () => tl.pause());

document.querySelector('#resume-btn').addEventListener('click', () => tl.resume());

document.querySelector('#reset-btn').addEventListener('click', () => tl.reset());
