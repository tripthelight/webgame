import consoleLocalStorage from "./console/consoleLocalStorage.js";
import consoleSessionStorage from "./console/consoleSessionStorage.js";
import applicationLocalStorage from "./application/applicationLocalStorage.js";

export default function storageEvent() {
  consoleLocalStorage();
  consoleSessionStorage();
  applicationLocalStorage();
}
