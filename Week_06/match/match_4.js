// 在一个字符串中，找到字符“ab”
function matchAB(string) {
  let foundA = false;
  for (let c of string) {
    if (c === 'a') {
      foundA = true;
    } else if (foundA && c === 'b') {
      return true;
    } else {
      foundA = false;
    }
  }
  return false;
}

console.log(matchAB('I ab hhhh'));
console.log(matchAB("I'm hhhh"));
