import onlyOneCheckbox from '../../functions/common/onlyOneCheckbox.js';

export default function displayUsers() {
  const CLIENT_ID = localStorage.getItem('clientId');
  if (!CLIENT_ID) return;
  const USER_LIST = sessionStorage.getItem('userList');
  if (!USER_LIST) return;

  const userListEl = document.querySelector('.user-list');
  if (!userListEl) return;

  const USER_LIST_ARR = JSON.parse(USER_LIST);
  const currentClientIds = Array.from(userListEl.querySelectorAll('input[type="checkbox"]')).map((input) => input.id);

  // USER_LIST_ARR에 있는 항목 중 자신을 제외하고 새로 추가할 항목 찾기
  USER_LIST_ARR.forEach((_user) => {
    if (_user.clientId !== CLIENT_ID) {
      const existingLi = userListEl.querySelector(`input[id="${_user.clientId}"]`);

      if (existingLi) {
        // 이미 존재하는 항목의 userId 업데이트
        const label = existingLi.nextElementSibling;
        if (label && label.innerHTML !== _user.userId) {
          label.innerHTML = _user.userId;
        }
      } else {
        // 새 항목 추가
        const li = document.createElement('li');

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.id = _user.clientId;

        const label = document.createElement('label');
        label.setAttribute('for', _user.clientId);
        label.innerHTML = _user.userId;

        li.appendChild(input);
        li.appendChild(label);
        userListEl.appendChild(li);
      }
    }
  });

  // DOM에 있는 항목 중 USER_LIST_ARR에 없거나, 자신인 항목 제거
  currentClientIds.forEach((_clientId) => {
    if (!USER_LIST_ARR.some((_user) => _user.clientId === _clientId && _user.clientId !== CLIENT_ID)) {
      const liToRemove = userListEl.querySelector(`input[id="${_clientId}"]`).closest('li');
      userListEl.removeChild(liToRemove);
    }
  });

  // 유저리스트 checkbox 중 하나만 체크
  onlyOneCheckbox('.main .user-list');
}
