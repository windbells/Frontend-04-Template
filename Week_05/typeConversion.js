function StringToNumber(str) {
  return +str;
}

function NumberToString(num, base) {
  // const reg = {
  //   binaryString: /^0b([0-1]+$)/,
  //   octonaryString: /^0o(0-7)+$/,
  //   decimalString: /^[+-]?(\d*(e\d*)?$)/,
  //   hexadecimalString: /^0x(0-7A-F)+$)/,
  // };
  const number = +num;
  if (typeof number !== 'number' || isNaN(number)) {
    return NaN;
  }
  if (base) {
    return number.toString(base);
  }
  return number.toString();
}

console.log(NumberToString(255, 16));
