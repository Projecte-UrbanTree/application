import { useI18n } from '@/hooks/useI18n';
import { Dropdown } from 'primereact/dropdown';

export default function LangSelector() {
  const { getAvailableLanguages, getLanguage, setLanguage } = useI18n();

  const languages = getAvailableLanguages().map((lang) => ({
    label: `${lang.flag} ${lang.name}`,
    value: lang.code,
  }));

  return (
    <Dropdown
      value={getLanguage()}
      options={languages}
      onChange={(e) => setLanguage(e.value)}
      optionLabel="label"
      placeholder="Select Language"
      className="w-40"
    />
  );
}
