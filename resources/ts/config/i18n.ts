import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ca from './i18n/ca.json';
import es from './i18n/es.json';
import en from './i18n/en.json';

const resources = {
  ca: {
    translation: ca
    },
  es: {
    translation: es
  },
  en: {
    translation: en
  },
};

if(localStorage.getItem('lang') === null) {
  localStorage.setItem('lang', 'ca');
}

const localStorageLang = localStorage.getItem('lang') || 'ca';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorageLang,
    interpolation: {
      escapeValue: true
    }
  });

  export default i18n;
