import React from 'react';
import { useTranslation } from 'react-i18next';

export default function AboutAppPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-16 py-12 px-4 md:px-0 font-serif text-white">
      {/* Hero Section */}
      <section className="relative w-full h-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-10 flex flex-col items-center justify-center text-center">
          <p className="font-bold text-lg md:text-xl leading-relaxed tracking-wide max-w-3xl">
          {t('about.hero1')}          </p>
          <p className="mt-4 font-bold text-lg md:text-xl leading-relaxed tracking-wide max-w-3xl">
          {t('about.hero2')}          </p>
        </div>
      </section>

      <hr className="border-t border-white/30 my-12" />

      {/* About the App */}
      <section className="max-w-4xl mx-auto bg-white/15 backdrop-blur-md rounded-2xl p-10">
        <h2 className="text-3xl md:text-4xl mb-6 font-calligraphy text-white">
        {t('about.aboutTitle')}      </h2>
        <p className="text-white text-lg leading-relaxed">
        {t('about.aboutP1')}         </p>
        <p className="text-white text-lg leading-relaxed mt-4">
        {t('about.aboutP2')}         </p>
      </section>

      <hr className="border-t border-white/30 my-12" />

      {/* Features */}
      <section className="max-w-4xl mx-auto bg-white/15 backdrop-blur-md rounded-2xl p-10 space-y-6">
        <h3 className="text-2xl md:text-3xl mb-4 font-calligraphy text-white">{t('about.featuresTitle')}</h3>

        <div>
          <strong> {t('about.feature1Title')}</strong>
          <p>
          {t('about.feature1Desc')}
                    </p>
        </div>

        <div>
          <strong>  
                     {t('about.feature2Title')}
          </strong>
          <p>
          {t('about.feature2Desc')}          </p>
        </div>

        <div>
          <strong>  {t('about.feature3Title')}</strong>
          <p>
          {t('about.feature3Desc')}           </p>
        </div>

        <div>
          <strong> {t('about.feature4Title')}</strong>
          <p>
          {t('about.feature4Desc')}            </p>
        </div>

        <div>
          <strong>🧘 {t('about.feature5Title')}</strong>
          <p>
          {t('about.feature5Desc')}            </p>
        </div>

        <div>
          <strong> {t('about.feature6Title')}</strong>
          <p>
          {t('about.feature6Desc')}           </p>
        </div>

        <div>
          <strong>{t('about.feature7Title')}</strong>
          <p>
          {t('about.feature7Desc')}             </p>
        </div>
      </section>

      <hr className="border-t border-white/30 my-12" />

      {/* Research Leadership */}
      <section className="max-w-4xl mx-auto bg-white/15 backdrop-blur-md rounded-2xl p-10">
        <h3 className="text-2xl md:text-3xl mb-4 font-calligraphy text-white"> {t('about.researchTitle')}   </h3>
        <p className="text-white text-lg leading-relaxed">
        {t('about.researchP1')}        </p>
        <p className="text-white text-lg leading-relaxed mt-4">
        {t('about.researchP2')}         </p>
      </section>

      <hr className="border-t border-white/30 my-12" />

      {/* Privacy & Data */}
      <section className="max-w-4xl mx-auto bg-white/15 backdrop-blur-md rounded-2xl p-10">
        <h3 className="text-2xl md:text-3xl mb-4 font-calligraphy text-white">{t('about.privacyTitle')} </h3>
        <p className="text-white text-lg leading-relaxed">
        {t('about.privacyIntro')}        </p>
        <ul className="list-disc list-inside text-white text-lg leading-relaxed mt-4 space-y-2">
          <li>{t('about.privacyItem1')}</li>
          <li>{t('about.privacyItem2')}</li>
          <li>{t('about.privacyItem3')}</li>
        </ul>
      </section>

      <hr className="border-t border-white/30 my-12" />

      {/* Why It Matters */}
      <section className="max-w-3xl mx-auto bg-white/15 backdrop-blur-md rounded-2xl p-10 text-center text-white">
        <h3 className="text-2xl md:text-3xl font-calligraphy mb-4">{t('about.whyTitle')}</h3>
        <p className="text-lg leading-relaxed">
        {t('about.whyP1')}        </p>
        <p className="text-lg leading-relaxed mt-4">
        {t('about.whyP2')}           </p>
        <p className="text-lg italic mt-6">
        {t('about.whyQuote')}           </p>
      </section>
    </div>
  );
}
