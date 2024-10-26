import {ws} from "./webSocketHost.js";
import displayUsers from "../displayUsers.js";

export const userList = () => {
  ws.onmessage = event => {
    const data = JSON.parse(event.data);
    console.log("data :: ", data);

    if (data.type === "userList" && data.users) {
      displayUsers(data.users);
    }
  };
};
