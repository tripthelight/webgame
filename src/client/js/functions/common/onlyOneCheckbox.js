export default function onlyOneCheckbox(_className) {
  const CHECKBOX_WRAP = document.querySelector(_className);
  if (!CHECKBOX_WRAP) return;

  const CHECKBOX_LIST = CHECKBOX_WRAP.querySelectorAll("input[type='checkbox']");
  if (!CHECKBOX_LIST) return;

  // 각 checkbox에 클릭 이벤트 리스너 추가
  CHECKBOX_LIST.forEach(_checkbox => {
    _checkbox.addEventListener("click", function () {
      // 현재 클릭된 checkbox가 체크된 경우
      if (this.checked) {
        // 다른 모든 checkbox를 체크 해제
        CHECKBOX_LIST.forEach(cb => {
          if (cb !== this) {
            cb.checked = false;
          }
        });
      }
    });
  });
}
