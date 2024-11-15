export const LOADING_EVENT = {
  show: str => {
    const LOAD_EL = document.querySelector(".loading");
    if (LOAD_EL) LOAD_EL.remove();

    const LOAD_WRAP_EL = document.createElement("div");
    const LOAD_INNER_EL = document.createElement("span");

    LOAD_WRAP_EL.classList.add("loading");
    LOAD_INNER_EL.innerHTML = "LOADING";
    if (str) LOAD_INNER_EL.innerHTML = str;

    LOAD_WRAP_EL.appendChild(LOAD_INNER_EL);
    document.body.appendChild(LOAD_WRAP_EL);
  },
  hide: () => {
    const LOAD_EL = document.querySelector(".loading");
    if (LOAD_EL) LOAD_EL.remove();
  },
};
