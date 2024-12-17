export default (_delay) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve();
    }, _delay);
  });
};
