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
