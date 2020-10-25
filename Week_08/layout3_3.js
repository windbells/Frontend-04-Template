// 改动：计算主轴，根据flex相关的属性计算每一行的尺寸
// 计算主轴方向
// 找出所有flex元素
// 将主轴方向的剩余尺寸按比例分配给这些元素
// 若剩余空间为负数，所有的flex元素为0，等比压缩剩余元素
function getStyle(element) {
  if (!element.style) {
    element.style = {};
  }
  for (let prop in element.computedStyle) {
    const p = element.computedStyle.value;
    element.style[prop] = element.computedStyle[prop].value;
    if (element.style[prop].toString().match(/px$/)) {
      element.style[prop] = parseInt(element.style[prop]);
    }
    if (element.style[prop].toString().match(/^[0-9\.]+$/)) {
      element.style[prop] = parseInt(element.style[prop]);
    }
  }
  return element.style;
}

function layout(element) {
  if (!element.computedStyle) {
    return;
  }
  const elementStyle = getStyle(element);
  if (elementStyle.display !== 'flex') {
    return;
  }
  const items = element.children.filter((e) => e.type === 'element');
  items.sort(function (a, b) {
    return (a.order || 0) - (b.order || 0);
  });
  const style = elementStyle;
  ['width', 'height'].forEach((size) => {
    if (style[size] === 'auto' || style[size] === '') {
      style[size] = null;
    }
  });

  if (!style.flexDirection || style.flexDirection === 'auto') {
    style.flexDirection = 'row';
  }
  if (!style.alignItems || style.alignItems === 'auto') {
    style.alignItems = 'stretch';
  }
  if (!style.justifyContent || style.justifyContent === 'auto') {
    style.justifyContent = 'flex-start';
  }
  if (!style.flexWrap || style.flexWrap === 'auto') {
    style.flexWrap = 'nowrap';
  }
  if (!style.alignContent || style.alignContent === 'auto') {
    style.alignContent = 'stretch';
  }
  let mainSize,
    mainStart,
    mainEnd,
    mainSign,
    mainBase,
    crossSize,
    crossStart,
    crossEnd,
    crossSign,
    crossBase;
  if (style.flexDirection === 'row') {
    mainSize = 'width'; // 主轴尺寸
    mainStart = 'left';
    mainEnd = 'right';
    mainSign = +1; // 属性排列用到，+1或者-1
    mainBase = 0; // 从左往右开始或者从右往左开始

    crossSize = 'height';
    crossStart = 'top';
    crossEnd = 'bottom';
  }
  if (style.flexDirection === 'row-reverse') {
    mainSize = 'width';
    mainStart = 'right';
    mainEnd = 'left';
    mainSign = -1;
    mainBase = style.width; // 从最右边开始

    crossSize = 'height';
    crossStart = 'top';
    crossEnd = 'bottom';
  }
  if (style.flexDirection === 'column') {
    mainSize = 'height';
    mainStart = 'top';
    mainEnd = 'bottom';
    mainSign = +1;
    mainBase = 0; // 从最右边开始column

    crossSize = 'width';
    crossStart = 'left';
    crossEnd = 'right';
  }
  if (style.flexDirection === 'column-reverse') {
    mainSize = 'height';
    mainStart = 'bottom';
    mainEnd = 'top';
    mainSign = -1;
    mainBase = style.height; // 从最右边开始

    crossSize = 'width';
    crossStart = 'left';
    crossEnd = 'right';
  }
  if (style.flexWrap === 'wrap-reverse') {
    [crossStart, crossEnd] = [crossEnd, crossStart];
    crossSign = -1;
  } else {
    crossBase = 0;
    crossSign = 1;
  }

  let isAutoMainSize = false;
  // 父元素没有设置主轴属性
  if (!style[mainSize]) {
    elementStyle[mainSize] = 0;
    for (const i = 0; i < items.length; i += 1) {
      const item = items[i];
      if (itemStyle[mainSize] !== null || itemStyle[mainSize] !== void 0) {
        elementStyle[mainSize] = elementStyle[mainSize] + itemStyle[mainSize];
      }
    }
    isAutoMainSize = true;
  }

  const flexLine = [];
  const flexLines = [flexLine];
  const mainSpace = elementStyle[mainSize]; // 剩余空间
  const crossSpace = 0;
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    const itemStyle = getStyle(item);
    if (item[mainSize] === null) {
      itemStyle[mainSize] = 0;
    }

    if (itemStyle.flex) {
      flexLine.push(item);
    } else if (style.flexWrap === 'nowrap' && isAutoMainSize) {
      mainSpace -= itemStyle[mainSize];
      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== void 0) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
      }
      flexLine.push(item);
    } else {
      if (itemStyle[mainSize] > style[mainSize]) {
        itemStyle[mainSize] = style[mainSize];
      }
      if (mainSpace < itemStyle[mainSize]) {
        // 剩余的空间不足以容纳每个元素
        flexLine.mainSpace = mainSpace; // 算出实际剩余尺寸和占的尺寸
        flexLine.crossSpace = crossSpace;

        flexLine = [item];
        flexLines.push(flexLine);
        mainSpace = style[mainSize];
        crossSpace = 0;
      } else {
        flexLine.push(item);
      }
      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== void 0) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
      }
      mainSpace -= itemStyle[mainSize];
    }
  }
  flexLine.mainSpace = mainSpace;
  console.log(items);
  if (style.flexWrap === 'nowrap' || isAutoMainSize) {
    flexLine.crossSpace =
      style[crossSize] !== undefined ? style[crossSize] : crossSpace;
  } else {
    flexLine.crossSpace = crossSpace;
  }
  if (mainSpace < 0) {
    // 等比压缩，单行逻辑
    const scale = style[mainSize] / (style[mainSize] - mainSpace);
    const currentMain = mainBase;
    for (const i = 0; i < items.length; i += 1) {
      const item = items[i];
      const itemStyle = getStyle(item);
      if (itemStyle.flex) {
        itemStyle[mainSize] = 0;
      }
      itemStyle[mainSize] = itemStyle[mainSize] * scale;
      itemStyle[mainStart] = currentMain; // 当前排到哪了
      itemStyle[mainEnd] =
        itemStyle[mainStart] + mainSign * itemStyle[mainSize];
      currentMain = itemStyle[mainEnd];
    }
  } else {
    flexLines.forEach(function (items) {
      const mainSpace = items.mainSpace;
      const flexTotal = 0;
      for (const i = 0; i < items.length; i += 1) {
        const item = items[i];
        const itemStyle = getStyle(item);
        if (itemStyle.flex !== null && itemStyle.flex !== void 0) {
          flexTotal += itemStyle.flex;
          continue;
        }
      }

      if (flexTotal > 0) {
        const currentMain = mainBase;
        for (const i = 0; i < items.length; i += 1) {
          const item = items[i];
          const itemStyle = getStyle[item];
          if (itemStyle.flex) {
            // 等比划分
            itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex;
          }
          itemStyle[mainStart] = currentMain;
          itemStyle[mainEnd] =
            itemStyle[mainStart] * mainSign * itemStyle[mainSize];
          currentMain = itemStyle[mainEnd];
        }
      } else {
        if (style.justifyContent === 'flex-start') {
          const currentMain = mainBase;
          const step = 0;
        }
        if (style.justifyContent === 'flex-end') {
          const currentMain = mainSpace * mainSign + mainBase;
          const step = 0;
        }
        if (style.justifyContent === 'center') {
          const currentMain = (mainSpace / 2) * mainSign + mainBase;
          const step = 0;
        }
        if (style.justifyContent === 'space-between') {
          const currentMain = mainBase;
          const step = (mainSpace / (items.length - 1)) * mainSign;
        }
        if (style.justifyContent === 'space-around') {
          const step = (mainSpace / items.length) * mainSign;
          const currentMain = step / 2 + mainBase;
        }
        for (const i = 0; i < items.length; i += 1) {
          const item = items[i];
          itemStyle[mainStart] = currentMain;
          itemStyle[mainEnd] =
            itemStyle[mainStart] + mainSign * itemStyle[mainSize];
          currentMain = itemStyle[mainEnd] + step;
        }
      }
    });
  }
}

module.exports = layout;
