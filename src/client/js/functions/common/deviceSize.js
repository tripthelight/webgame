export default () => {
  document.body.classList.remove("landscape");
  document.body.classList.remove("portrait");
  const WW = window.innerWidth;
  const WH = window.innerHeight;
  if (WW >= WH) document.body.classList.add("landscape");
  if (WW < WH) document.body.classList.add("portrait");
};
