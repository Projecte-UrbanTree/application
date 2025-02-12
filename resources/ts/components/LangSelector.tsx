import { useI18n } from '@/hooks/useI18n';
import { Dropdown } from 'primereact/dropdown';
import { Icon } from '@iconify/react';

export default function LangSelector() {
  const { getAvailableLanguages, getLanguage, setLanguage } = useI18n();

  const languages = getAvailableLanguages().map((lang) => ({
    label: lang.name,
    value: lang.code,
    flag: lang.flag,
  }));

  const languageTemplate = (option: any) => {
    if (!option) return null;
    return (
      <div className="flex items-center">
        <Icon
          icon={option.flag}
          width="20"
          height="20"
          style={{ marginRight: '8px' }}
        />
        <span>{option.label}</span>
      </div>
    );
  };

  const selectedLanguageTemplate = (option: any) => {
    return languageTemplate(option);
  };

  return (
    <Dropdown
      value={getLanguage()}
      options={languages}
      onChange={(e) => setLanguage(e.value)}
      itemTemplate={languageTemplate}
      valueTemplate={selectedLanguageTemplate}
      className="w-40"
    />
  );
}
