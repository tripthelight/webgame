/**
 * EXPORT
 */
// FIND CONTAINER
export const findContainer = () => {
  const CONTAINER_EL = document.getElementById('container');
  if (CONTAINER_EL) {
    return CONTAINER_EL;
  } else {
    return false;
  }
};

// GET STYLE > standard style
export const getStyle = (oElm, strCssRule) => {
  let strValue = '';
  if (document.defaultView && document.defaultView.getComputedStyle) {
    // strValue = document.defaultView.getComputedStyle(oElm, "").getPropertyValue(strCssRule);
    strValue = document.defaultView.getComputedStyle(oElm, '').getPropertyValue(strCssRule).replace('px', '');
  } else if (oElm.currentStyle) {
    strCssRule = strCssRule.replace(/\-(\w)/g, function (strMatch, p1) {
      return p1.toUpperCase();
    });
    // strValue = oElm.currentStyle[strCssRule];
    strValue = oElm.currentStyle[strCssRule].replace('px', '');
  }
  return Number(strValue);
};

// GET STYLE > transform style
export const getTranslateXY = (element) => {
  const style = window.getComputedStyle(element);
  const matrix = new DOMMatrixReadOnly(style.transform);
  return {
    translateX: matrix.m41,
    translateY: matrix.m42,
  };
};

// REMOVE HTML ELEMENT
export const removeElem = (elem) => {
  const TRIM_ARR = elem.trim();
  const ELEM_ARR = TRIM_ARR.split(',');
  for (let i = 0; i < ELEM_ARR.length; i++) {
    if (document.querySelector(ELEM_ARR[i])) {
      document.querySelector(ELEM_ARR[i]).remove();
    }
  }
};

export const findIndexElem = (target, elem) => {
  let ulEl = Array.from(target.closest('.' + elem.className).children);
  return ulEl.indexOf(target);
};

export const findIndex = (target) => {
  let ulEl = Array.from(target.closest('ul').children);
  return ulEl.indexOf(target);
};
