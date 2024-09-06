export const isMobile = () => {
  if (navigator.maxTouchPoints > 0) {
    return true;
  }
  return false;
};

export const ELEMENT_STATE = (..._elemObj) => {
  for (let selector of _elemObj) {
    let element = document.querySelector(selector);
    if (!element || !document.body.contains(element)) {
      return true;
    }
  }
  return false;
};

// element의 transform 값을 find
export function findTransform(_elem) {
  const style = window.getComputedStyle(_elem);
  const transform = style.transform;
  let translateX = 0;
  let translateY = 0;
  if (transform !== "none") {
    const values = transform.match(/matrix.*\((.+)\)/)[1].split(", ");
    translateX = parseFloat(values[4]);
    translateY = parseFloat(values[5]);
  }
  return {
    x: translateX,
    y: translateY,
  };
}
