import React from 'react';
import { useTranslation } from 'react-i18next';
import saplingBanner from '/assets/sapling-banner.jpg';
import saplingGuide from '/assets/sapling_guide.jpg';
import ritualImg from '/assets/planting-ritual.jpg';
import careImg from '/assets/sapling_care.jpg';

export default function PlantSaplingPage() {
  const { t } = useTranslation();

  const steps = [
    t('sapling.step1'),
    t('sapling.step2'),
    t('sapling.step3'),
    t('sapling.step4'),
    t('sapling.step5')
  ];

  return (
    <div className="space-y-16 py-12 px-4 md:px-0 font-serif text-white">
      {/* Hero */}
      <section className="relative w-full h-80 md:h-[32rem]">
        <img
          src={saplingBanner}
          alt="Hands planting a sapling"
          className="w-full h-full object-cover rounded-2xl shadow-lg"
        />
        <div className="absolute inset-0 bg-black/30 rounded-2xl flex flex-col items-center justify-center p-6">
          <p className="mt-40 font-bold text-lg md:text-xl leading-relaxed tracking-wide max-w-2xl text-center">
            {t('sapling.hero1')}
          </p>
          <p className="mt-4 font-bold text-lg md:text-xl leading-relaxed tracking-wide max-w-2xl text-center">
            {t('sapling.hero2')}
          </p>
        </div>
      </section>

      <hr className="border-t border-white/30 my-12" />

      {/* Step-by-Step */}
      <section className="max-w-3xl mx-auto bg-white/25 backdrop-blur-md rounded-2xl p-10">
        <h2 className="text-3xl md:text-4xl mb-6 font-calligraphy text-white">
          {t('sapling.stepsTitle')}
        </h2>
        <img
          src={saplingGuide}
          alt="Sapling planting diagram"
          className="w-full rounded-lg shadow-md mb-6 object-contain max-h-80"
        />
        <ol className="list-decimal list-inside space-y-4 text-lg text-white">
          {steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </section>

      <hr className="border-t border-white/30 my-12" />

      {/* Ritual & Dedication */}
      <section className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
        <div className="bg-white/25 backdrop-blur-md rounded-2xl p-8 text-white leading-relaxed">
          <h3 className="text-2xl md:text-3xl mb-4 font-calligraphy">{t('sapling.ritualTitle')}</h3>
          <p>
            {t('sapling.ritualDesc')}
          </p>
        </div>
        <img
          src={ritualImg}
          alt="Memorial ribbon tied around tree"
          className="w-full rounded-lg shadow-md object-contain max-h-80"
        />
      </section>

      <hr className="border-t border-white/30 my-12" />

      {/* Aftercare & Growth */}
      <section className="max-w-5xl mx-auto bg-white/25 backdrop-blur-md rounded-2xl p-10">
        <h3 className="text-3xl mb-4 font-calligraphy text-white">{t('sapling.aftercareTitle')}</h3>
        <p className="mb-6 text-white text-lg leading-relaxed">
          {t('sapling.aftercareDesc')}
        </p>
        <img
          src={careImg}
          alt="Sapling care and watering"
          className="w-full rounded-lg shadow-md object-contain max-h-80"
        />
      </section>

      <hr className="border-t border-white/30 my-12" />
    </div>
  );
}
