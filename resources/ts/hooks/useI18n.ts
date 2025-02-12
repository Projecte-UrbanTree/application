import { useTranslation } from "react-i18next";

export function useI18n() {
    const { t, i18n } = useTranslation();

    const setLanguage = (lang: string) => {
        localStorage.setItem('lang', lang);
        i18n.changeLanguage(lang);
    };

    const getLanguage = () => {
        return i18n.language;
    }

    const getAvailableLanguages = () => {
        return [
            { code: 'en', name: 'English', flag: '🇺🇸' },
            { code: 'es', name: 'Español', flag: '🇪🇸' },
        ]
    }

    return { t, i18n, setLanguage, getLanguage, getAvailableLanguages };
}
