import { useTranslation } from 'react-i18next';
import { setCookie } from 'typescript-cookie';

// Define the available format options
type FormatOption =
  | 'capitalize'
  | 'exclamation'
  | 'interval'
  | 'lowercase'
  | 'question'
  | 'uppercase';

// Define the format options object type
type FormatOptionsObject = {
  capitalize?: boolean;
  exclamation?: boolean;
  interval?: boolean;
  lowercase?: boolean;
  question?: boolean;
  uppercase?: boolean;
};

export default function useI18n() {
  const { t, i18n } = useTranslation();

  const setLanguage = (lang: string) => {
    setCookie('lang', lang);
    i18n.changeLanguage(lang);
  };

  const getLanguage = () => i18n.language;

  const getAvailableLanguages = () => [
    { code: 'ca', name: 'Català', flag: 'flag:es-ct-4x3' },
    { code: 'es', name: 'Español', flag: 'flag:es-4x3' },
    { code: 'en', name: 'English', flag: 'flag:gb-4x3' },
  ];

  // Function overloads
  function format(text: string): string;
  function format(key: string, itemValue: string): string;
  function format(key: string, count: number): string; // Number overload for intervals
  function format(key: string, itemKey: string, count: number): string; // New overload for item + interval
  function format(keys: string[]): string; // Array overload
  function format(params: {
    key?: any | string | string[];
    options?: any;
    formatOptions?: FormatOption[] | FormatOptionsObject;
    text?: string;
  }): string;

  // Implementation
  function format(
    param:
      | string
      | string[]
      | {
          key?: any | string | string[];
          options?: any;
          formatOptions?: FormatOption[] | FormatOptionsObject;
          text?: string;
        },
    itemValue?: string | number,
    count?: number,
  ): string {
    // Case for three parameters: key, item, and count
    if (
      typeof param === 'string' &&
      typeof itemValue === 'string' &&
      typeof count === 'number'
    ) {
      return format({
        key: param,
        options: {
          item: format({
            key: itemValue,
            options: { count: count },
            formatOptions: ['interval'],
          }),
        },
      });
    }

    // Case for array of strings
    if (Array.isArray(param)) {
      return t('_capitalize', { val: t(param) });
    }

    // Case for string key and number value (interval)
    if (typeof param === 'string' && typeof itemValue === 'number') {
      return format({
        key: param,
        options: {
          count: itemValue,
        },
        formatOptions: ['interval', 'capitalize'],
      });
    }

    // Case for two string parameters
    if (typeof param === 'string' && typeof itemValue === 'string') {
      if (
        param.startsWith('states.item_') ||
        param.endsWith('_item') ||
        param.startsWith('tooltips.')
      ) {
        return format({
          key: param,
          options: {
            item: t(itemValue),
          },
        });
      }

      return format({
        key: param,
        options: {
          item: format(itemValue),
        },
      });
    }

    // Case 1: Simple string
    if (typeof param === 'string') {
      // Check if string ends with _interval
      if (param.endsWith('_interval')) {
        return t(`glossary:${param}`, {
          postProcess: 'interval',
        });
      }
      return t('_capitalize', { val: t(param) });
    }

    // Case 2: Object parameters (existing implementation)
    const {
      key,
      options = {},
      formatOptions: inputFormatOptions = ['capitalize'],
      text,
    } = param;

    // Handle array of keys in object parameter
    if (Array.isArray(key)) {
      return t('_capitalize', { val: t(key) });
    }

    // Convert array format to object if needed
    const formatOptions = Array.isArray(inputFormatOptions)
      ? inputFormatOptions.reduce(
          (acc, option) => ({ ...acc, [option]: true }),
          {} as FormatOptionsObject,
        )
      : inputFormatOptions;
    let result;

    // Handle interval specially
    if (formatOptions.interval) {
      result = t(`glossary:${key}_interval`, {
        ...options,
        postProcess: 'interval',
      });
    } else {
      // For non-interval, use normal translation or direct text
      result = key ? t(key, options) : text || '';
    }

    // Ensure only one case transformation is applied
    const caseTransformations = [
      { type: 'lowercase', enabled: formatOptions.lowercase },
      { type: 'uppercase', enabled: formatOptions.uppercase },
      { type: 'capitalize', enabled: formatOptions.capitalize },
    ];

    const activeCaseTransform = caseTransformations.find(
      (transform) => transform.enabled,
    );

    // Apply case transformation if one is enabled
    if (activeCaseTransform) {
      result = t(`_${activeCaseTransform.type}`, { val: result });
    }

    // Apply other transformations in specific order
    const otherTransformations = [
      { type: 'question', enabled: formatOptions.question },
      { type: 'exclamation', enabled: formatOptions.exclamation },
    ];

    for (const transform of otherTransformations) {
      if (transform.enabled) {
        result = t(`_${transform.type}`, { val: result });
      }
    }

    return result as string;
  }

  return {
    format,
    getAvailableLanguages,
    getLanguage,
    i18n,
    setLanguage,
    t,
  };
}
