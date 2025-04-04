import { useTranslation } from 'react-i18next';
import { setCookie } from 'typescript-cookie';

export function useI18n() {
  const { t, i18n } = useTranslation();

  const setLanguage = (lang: string) => {
    setCookie('lang', lang);
    i18n.changeLanguage(lang);
  };

  const getLanguage = () => {
    return i18n.language;
  };

  const getAvailableLanguages = () => {
    return [
      { code: 'ca', name: 'Català', flag: 'flag:es-ct-4x3' },
      { code: 'es', name: 'Español', flag: 'flag:es-4x3' },
      { code: 'en', name: 'English', flag: 'flag:gb-4x3' },
    ];
  };

  return { t, i18n, setLanguage, getLanguage, getAvailableLanguages };
}
