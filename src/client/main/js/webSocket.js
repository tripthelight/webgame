import onlyOneCheckbox from "../../functions/common/onlyOneCheckbox.js";

export const ws = new WebSocket("ws://localhost:8080");

export const webSocket = () => {
  ws.onmessage = event => {
    const data = JSON.parse(event.data);
    console.log("data :: ", data);

    if (data.type === "userList" && data.users) {
      displayUsers(data.users);
    }
  };

  function displayUsers(users) {
    const userList = document.querySelector(".user-list");
    userList.innerHTML = ""; // 기존 사용자 목록 제거
    users.forEach((user, index) => {
      const userItem = document.createElement("li");
      const userItemCheckbox = document.createElement("input");
      const userId = "USER-" + index;
      userItemCheckbox.type = "checkbox";
      userItemCheckbox.name = "USER_LIST";
      userItemCheckbox.id = userId;

      const userItemLabel = document.createElement("label");
      userItemLabel.setAttribute("for", userId);

      userItemLabel.innerHTML = user;

      userItem.appendChild(userItemCheckbox);
      userItem.appendChild(userItemLabel);
      userList.appendChild(userItem);
    });

    // 유저리스트 checkbox 중 하나만 체크
    onlyOneCheckbox(".main .user-list");
  }
};
