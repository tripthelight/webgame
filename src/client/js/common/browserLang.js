// 현재 브라우저 언어를 가져옵니다.
const browserLang = navigator.language || navigator.userLanguage;

// 브라우저 언어 설정에 따라 html lang 속성을 변경합니다.
document.documentElement.lang = browserLang.split('-')[0] || 'en'; // 기본값은 'en' (영어)
