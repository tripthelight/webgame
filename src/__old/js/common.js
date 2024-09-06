import { level1 } from "./level1/level1.js";

document.onreadystatechange = () => {
  let state = document.readyState;
  if (state === "interactive") {
  } else if (state === "complete") {
    level1();
  }
};
