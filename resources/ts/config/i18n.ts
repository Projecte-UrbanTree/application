import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ca from './i18n/ca.json';
import es from './i18n/es.json';
import en from './i18n/en.json';

import { getCookie, setCookie } from 'typescript-cookie';

const resources = {
  ca: {
    translation: ca,
  },
  es: {
    translation: es,
  },
  en: {
    translation: en,
  },
};

if(!getCookie('lang')) {
  setCookie('lang', 'ca');
}

const lang = getCookie('lang');

i18n.use(initReactI18next).init({
  resources,
  lng: lang,
  interpolation: {
    escapeValue: true,
  },
});

export default i18n;
