class Human {
  constructor(name, painValue) {
    this.name = name;
    this.painValue = painValue;
  }
  hurt(damage) {
    console.log('被咬了');
    this.painValue -= damage;
  }
}

// 对象的行为必须是改变对象状态的
class Dog {
  constructor(name) {
    this.attck = 10;
    this.name = name;
  }
  bite() {
    console.log('小狗咬人');
    return this.attck;
  }
}

const dog = new Dog();
const human = new Human();
human.hurt(dog.bite());
