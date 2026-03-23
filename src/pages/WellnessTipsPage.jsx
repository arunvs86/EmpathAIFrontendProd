import React from 'react';
import { useTranslation } from 'react-i18next';
import wellnessBanner from '/assets/wellness_banner.jpg';
import movementImg from '/assets/gentle_movement.jpg';
import nutritionImg from '/assets/nourishing_foods.jpg';
import restImg from '/assets/rest_routine.jpg';
import connectImg from '/assets/social_connection.jpg';
import sleepImg from '/assets/sleep.jpg';

export default function WellnessTipsPage() {
  const { t } = useTranslation();

  const tips = [
    { title: t('wellness.t1Title'), img: movementImg, desc: t('wellness.t1Desc') },
    { title: t('wellness.t2Title'), img: restImg,     desc: t('wellness.t2Desc') },
    { title: t('wellness.t3Title'), img: nutritionImg, desc: t('wellness.t3Desc') },
    { title: t('wellness.t4Title'), img: connectImg,  desc: t('wellness.t4Desc') }
  ];

  return (
    <div className="space-y-16 py-12 px-4 md:px-0 font-serif text-white">
      {/* Hero */}
      <section className="relative w-full h-80 md:h-[32rem]">
        <img
          src={wellnessBanner}
          alt="Wellness self-care setup"
          className="w-full h-full object-cover rounded-2xl shadow-lg"
        />
        <div className="absolute inset-0 bg-black/30 rounded-2xl flex flex-col justify-end items-center p-6">
          <p className="text-lg md:text-xl leading-relaxed tracking-wide max-w-2xl text-white/90 text-center mb-4">
            {t('wellness.hero')}
          </p>
        </div>
      </section>

      <hr className="border-t border-white/30 my-12" />

      {/* Tips Grid */}
      <section className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {tips.map((tip, i) => (
          <div
            key={i}
            className="bg-white/25 backdrop-blur-md rounded-2xl p-8 hover:scale-[1.02] transition-transform duration-200"
          >
            <img
              src={tip.img}
              alt={tip.title}
              className="w-full max-h-64 object-contain rounded-lg shadow-md mb-6"
            />
            <h3 className="text-2xl mb-4 font-calligraphy text-white">{tip.title}</h3>
            <p className="text-lg leading-relaxed text-white">{tip.desc}</p>
          </div>
        ))}
      </section>

      <hr className="border-t border-white/30 my-12" />

      {/* Deep Dive Sections */}
      <section className="space-y-12 max-w-5xl mx-auto">
        <div className="bg-white/25 backdrop-blur-md rounded-2xl p-10 text-white leading-relaxed">
          <h3 className="text-3xl mb-4 font-calligraphy">{t('wellness.snackTitle')}</h3>
          <ul className="list-disc list-outside pl-6 space-y-3 text-lg">
            <li>{t('wellness.snack1')}</li>
            <li>{t('wellness.snack2')}</li>
            <li>{t('wellness.snack3')}</li>
          </ul>
        </div>
        <div className="bg-white/25 backdrop-blur-md rounded-2xl p-10 text-white leading-relaxed">
          <h3 className="text-3xl mb-4 font-calligraphy">{t('wellness.sleepTitle')}</h3>
          <p className="text-lg mb-4">
            {t('wellness.sleepDesc')}
          </p>
          <img
            src={sleepImg}
            alt="Rest routine"
            className="w-full max-h-64 object-contain rounded-lg shadow-md"
          />
        </div>
      </section>

      <hr className="border-t border-white/30 my-12" />
    </div>
  );
}
