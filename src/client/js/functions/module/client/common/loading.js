// LOADING
export default {
  show: () => {
    if (!document.querySelector(".loading")) {
      let loadingEl = document.createElement("div");
      let innerEl = document.createElement("span");
      innerEl.innerText = "LOADING";
      loadingEl.classList.add("loading");
      loadingEl.appendChild(innerEl);
      document.body.appendChild(loadingEl);
    }
  },
  hide: () => {
    if (document.querySelector(".loading")) {
      document.querySelector(".loading").remove();
    }
  },
};
