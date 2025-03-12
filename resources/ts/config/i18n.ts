import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ca from './i18n/ca.json';
import en from './i18n/en.json';
import es from './i18n/es.json';
import tr from './i18n/tr.json';

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
    tr: {
        translation: tr,
    },
};

if (!getCookie('lang')) {
    setCookie('lang', 'ca');
}

const lng = getCookie('lang');

i18n.use(initReactI18next).init({
    resources,
    lng,
    interpolation: {
        escapeValue: true,
    },
});

export default i18n;
