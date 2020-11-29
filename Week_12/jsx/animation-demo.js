import { Timeline, Animation } from './animation';
import { easeIn } from './ease';

let tl = new Timeline();
tl.start();
tl.add(
  new Animation(
    document.querySelector('#el').style,
    'transform',
    0,
    500,
    2 * 1000,
    0,
    easeIn,
    (v) => `translateX(${v}px)`
  )
);

document.querySelector('#el').style.transition = 'transform ease-in 2s';
document.querySelector('#el').style.transform = 'translateX(500px)';

document
  .querySelector('#pause-btn')
  .addEventListener('click', () => tl.pause());

document
  .querySelector('#resume-btn')
  .addEventListener('click', () => tl.resume());
