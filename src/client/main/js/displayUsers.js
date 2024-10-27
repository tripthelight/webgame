import onlyOneCheckbox from '../../functions/common/onlyOneCheckbox.js';

export default function displayUsers(_users) {
  const userList = document.querySelector('.user-list');
  if (!userList) return;

  const CLIENT_ID = window.localStorage.getItem('clientId');
  if (!CLIENT_ID) return;

  userList.innerHTML = ''; // 기존 사용자 목록 제거
  _users.forEach((_user, _index) => {
    if (CLIENT_ID !== _user.clientId) {
      const userItem = document.createElement('li');
      const userItemCheckbox = document.createElement('input');
      const userId = 'USER-' + _index;
      userItemCheckbox.type = 'checkbox';
      userItemCheckbox.name = 'USER_LIST';
      userItemCheckbox.id = userId;

      const userItemLabel = document.createElement('label');
      userItemLabel.setAttribute('for', userId);

      userItemLabel.innerHTML = _user.userId;

      userItem.appendChild(userItemCheckbox);
      userItem.appendChild(userItemLabel);
      userList.appendChild(userItem);
    }
  });

  // 유저리스트 checkbox 중 하나만 체크
  onlyOneCheckbox('.main .user-list');
}
