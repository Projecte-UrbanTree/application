import React from 'react';
import { useTranslation } from 'react-i18next';

const License: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="mt-4 ml-4">
      <h1 className="text-3xl font-bold mb-4 text-gray-700">
        {t('admin.pages.license.title')}
      </h1>
      
      <p className="text-lg text-gray-600">
        {t('admin.pages.license.description')}
        <br />
        {t('admin.pages.license.moreInfo')}{' '}
        <a 
          className="underline hover:text-gray-900"
          href={t('admin.pages.license.link_url')} 
          target="_blank"
          rel="noreferrer"
        >
          {t('admin.pages.license.link_text')}
        </a>
        , {t('admin.pages.license.below_text')}
      </p>

      <div className="bg-gray-100 p-8 rounded-md text-sm text-gray-700 mt-4">
        <h2 className="text-xl font-bold mb-2">
          {t('admin.pages.license.fullText.title')}
        </h2>
        <p className="mb-4">{t('admin.pages.license.fullText.copyright')}</p>

        <section className="mb-6">
          <p className="whitespace-pre-line">
            {t('admin.pages.license.fullText.preface')}
          </p>
        </section>

        {/* Sections */}
        {['definitions', 'scope', 'source_code', 'copyright', 'obligations', 'authorship', 'warranty', 
          'liability', 'additional', 'acceptance', 'information', 'termination', 'miscellaneous', 
          'jurisdiction', 'applicable_law'].map((section) => (
          <section key={section} className="mb-6">
            <h3 className="font-semibold mb-2">
              {t(`admin.pages.license.fullText.sections.${section}.title`)}
            </h3>
            <p className="whitespace-pre-line">
              {t(`admin.pages.license.fullText.sections.${section}.content`)}
            </p>
          </section>
        ))}

        {/* Appendix */}
        <section className="mt-8">
          <h3 className="text-xl font-semibold mb-3">
            {t('admin.pages.license.fullText.appendix.title')}
          </h3>
          <p className="mb-2">
            {t('admin.pages.license.fullText.appendix.content')}
          </p>
          <p className="mb-2 whitespace-pre-line">
            {t('admin.pages.license.fullText.appendix.licenses')}
          </p>
        </section>
      </div>
    </div>
  );
};

export default License;