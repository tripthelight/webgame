const language = navigator.language || navigator.userLanguage;
export const countryCode = language.split("-")[1];
