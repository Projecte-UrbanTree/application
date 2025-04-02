import i18n from 'i18next';
import intervalPlural from 'i18next-intervalplural-postprocessor';
import { initReactI18next } from 'react-i18next';
import { getCookie, setCookie } from 'typescript-cookie';

import ca_admin from './i18n/ca/admin.json';
import ca_common from './i18n/ca/common.json';
import ca_glossary from './i18n/ca/glossary.json';
import ca_icon from './i18n/ca/icon.json';
import ca_validation from './i18n/ca/validation.json';
import en_admin from './i18n/en/admin.json';
import en_common from './i18n/en/common.json';
import en_glossary from './i18n/en/glossary.json';
import en_icon from './i18n/en/icon.json';
import en_validation from './i18n/en/validation.json';
import es_admin from './i18n/es/admin.json';
import es_common from './i18n/es/common.json';
import es_glossary from './i18n/es/glossary.json';
import es_icon from './i18n/es/icon.json';
import es_validation from './i18n/es/validation.json';
import tr_admin from './i18n/tr/admin.json';
import tr_common from './i18n/tr/common.json';
import tr_glossary from './i18n/tr/glossary.json';
import tr_validation from './i18n/tr/validation.json';

export const defaultNS = 'common';

const resources = {
  ca: {
    admin: ca_admin,
    common: ca_common,
    glossary: ca_glossary,
    icon: ca_icon,
    validation: ca_validation,
  },
  es: {
    admin: es_admin,
    common: es_common,
    glossary: es_glossary,
    icon: es_icon,
    validation: es_validation,
  },
  en: {
    admin: en_admin,
    common: en_common,
    glossary: en_glossary,
    icon: en_icon,
    validation: en_validation,
  },
  tr: {
    admin: tr_admin,
    common: tr_common,
    glossary: tr_glossary,
    validation: tr_validation,
  },
};

if (!getCookie('lang')) {
  setCookie('lang', 'ca');
}

const lng = getCookie('lang');

i18n
  .use(intervalPlural)
  .use(initReactI18next)
  .init({
    lng,
    resources,
    defaultNS,
    // postProcess: ['interval'],
    interpolation: {
      escapeValue: true,
      // eslint-disable-next-line no-unused-vars
      format: (value, format, lng) => {
        if (format === 'uppercase') return value.toUpperCase();
        if (format === 'lowercase') return value.toLowerCase();
        if (format === 'capitalize')
          return `${value.substr(0, 1).toUpperCase()}${value.substr(1)}`;
        return value;
      },
    },
  });

export default i18n;
