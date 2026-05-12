import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';

// Faith icons
import christianIcon from '/assets/icons/christianity.svg';
import islamIcon from '/assets/icons/islam.svg';
import hinduIcon from '/assets/icons/hinduism.svg';
import buddhistIcon from '/assets/icons/buddhism.svg';
import judaismIcon from '/assets/icons/judaism.svg';
import interfaithIcon from '/assets/icons/interfaith.svg';

// Faith-specific hero images
import christianImg from '/assets/religion/christian.jpg';
import islamImg from '/assets/religion/islam.jpg';
import hinduImg from '/assets/religion/hindu.jpg';
import buddhistImg from '/assets/religion/buddhist.jpg';
import judaismImg from '/assets/religion/judaism.jpg';
import interfaithImg from '/assets/religion/interfaith.jpg';

// Faith-specific card images
import christianPrayerImg from '/assets/religion/christian_prayer.jpg';
import psalm23Img from '/assets/religion/psalm23.jpg';
import candleImg from '/assets/religion/candle.jpg';
import serviceImg from '/assets/religion/service.jpg';
import duaImg from '/assets/religion/dua.jpg';
import fatihahImg from '/assets/religion/fatihah.jpg';
import graveImg from '/assets/religion/grave.jpg';
import charityImg from '/assets/religion/charity.jpg';
import shraddhaImg from '/assets/religion/shraddha.jpg';
import mantraImg from '/assets/religion/mantra.jpg';
import lampImg from '/assets/religion/lamp.jpg';
import mettaImg from '/assets/religion/metta.jpg';
import meritImg from '/assets/religion/merit.jpg';
import chantingImg from '/assets/religion/chanting.jpg';
import kaddishImg from '/assets/religion/kaddish.jpg';
import shivaImg from '/assets/religion/shiva.jpg';
import tzedakahImg from '/assets/religion/tzedakah.jpg';
import candle2Img from '/assets/religion/candle2.jpg';
import silenceImg from '/assets/religion/silence.jpg';
import jarImg from '/assets/religion/jar.jpg';

const FAITHS = [
  { key: 'Christianity', icon: christianIcon, banner: christianImg, color: 'from-amber-900/80 to-amber-700/60' },
  { key: 'Islam',        icon: islamIcon,     banner: islamImg,     color: 'from-emerald-900/80 to-emerald-700/60' },
  { key: 'Hinduism',     icon: hinduIcon,     banner: hinduImg,     color: 'from-orange-900/80 to-orange-700/60' },
  { key: 'Buddhism',     icon: buddhistIcon,  banner: buddhistImg,  color: 'from-yellow-900/80 to-yellow-700/60' },
  { key: 'Judaism',      icon: judaismIcon,   banner: judaismImg,   color: 'from-blue-900/80 to-blue-700/60' },
  { key: 'Interfaith',   icon: interfaithIcon,banner: interfaithImg,color: 'from-purple-900/80 to-purple-700/60' },
];

function buildFaithData(t) {
  return {
    Christianity: {
      cards: [
        { title: t('faith.christianity.c1Title'), icon: christianIcon, description: t('faith.christianity.c1Desc'), details: t('faith.christianity.c1Details'), image: christianPrayerImg },
        { title: t('faith.christianity.c2Title'), icon: christianIcon, description: t('faith.christianity.c2Desc'), details: t('faith.christianity.c2Details'), image: psalm23Img },
        { title: t('faith.christianity.c3Title'), icon: christianIcon, description: t('faith.christianity.c3Desc'), details: t('faith.christianity.c3Details'), image: candleImg },
        { title: t('faith.christianity.c4Title'), icon: christianIcon, description: t('faith.christianity.c4Desc'), details: t('faith.christianity.c4Details'), image: serviceImg },
      ],
    },
    Islam: {
      cards: [
        { title: t('faith.islam.c1Title'), icon: islamIcon, description: t('faith.islam.c1Desc'), details: t('faith.islam.c1Details'), image: duaImg },
        { title: t('faith.islam.c2Title'), icon: islamIcon, description: t('faith.islam.c2Desc'), details: t('faith.islam.c2Details'), image: fatihahImg },
        { title: t('faith.islam.c3Title'), icon: islamIcon, description: t('faith.islam.c3Desc'), details: t('faith.islam.c3Details'), image: graveImg },
        { title: t('faith.islam.c4Title'), icon: islamIcon, description: t('faith.islam.c4Desc'), details: t('faith.islam.c4Details'), image: charityImg },
      ],
    },
    Hinduism: {
      cards: [
        { title: t('faith.hinduism.c1Title'), icon: hinduIcon, description: t('faith.hinduism.c1Desc'), details: t('faith.hinduism.c1Details'), image: shraddhaImg },
        { title: t('faith.hinduism.c2Title'), icon: hinduIcon, description: t('faith.hinduism.c2Desc'), details: t('faith.hinduism.c2Details'), image: mantraImg },
        { title: t('faith.hinduism.c3Title'), icon: hinduIcon, description: t('faith.hinduism.c3Desc'), details: t('faith.hinduism.c3Details'), image: lampImg },
      ],
    },
    Buddhism: {
      cards: [
        { title: t('faith.buddhism.c1Title'), icon: buddhistIcon, description: t('faith.buddhism.c1Desc'), details: t('faith.buddhism.c1Details'), image: mettaImg },
        { title: t('faith.buddhism.c2Title'), icon: buddhistIcon, description: t('faith.buddhism.c2Desc'), details: t('faith.buddhism.c2Details'), image: meritImg },
        { title: t('faith.buddhism.c3Title'), icon: buddhistIcon, description: t('faith.buddhism.c3Desc'), details: t('faith.buddhism.c3Details'), image: chantingImg },
      ],
    },
    Judaism: {
      cards: [
        { title: t('faith.judaism.c1Title'), icon: judaismIcon, description: t('faith.judaism.c1Desc'), details: t('faith.judaism.c1Details'), image: kaddishImg },
        { title: t('faith.judaism.c2Title'), icon: judaismIcon, description: t('faith.judaism.c2Desc'), details: t('faith.judaism.c2Details'), image: shivaImg },
        { title: t('faith.judaism.c3Title'), icon: judaismIcon, description: t('faith.judaism.c3Desc'), details: t('faith.judaism.c3Details'), image: tzedakahImg },
      ],
    },
    Interfaith: {
      cards: [
        { title: t('faith.interfaith.c1Title'), icon: interfaithIcon, description: t('faith.interfaith.c1Desc'), details: t('faith.interfaith.c1Details'), image: candle2Img },
        { title: t('faith.interfaith.c2Title'), icon: interfaithIcon, description: t('faith.interfaith.c2Desc'), details: t('faith.interfaith.c2Details'), image: silenceImg },
        { title: t('faith.interfaith.c3Title'), icon: interfaithIcon, description: t('faith.interfaith.c3Desc'), details: t('faith.interfaith.c3Details'), image: jarImg },
      ],
    },
  };
}

export default function ReligiousPracticesPage() {
  const { t } = useTranslation();
  const [selectedFaith, setSelectedFaith] = useState(null);
  const faithData = buildFaithData(t);

  // ── Level 2: selected religion detail view ──────────────────────────────
  if (selectedFaith) {
    const faith = FAITHS.find(f => f.key === selectedFaith);
    const data  = faithData[selectedFaith];
    return (
      <div className="space-y-10 py-8 px-4 md:px-0 font-serif text-white">
        {/* Back button */}
        <button
          onClick={() => setSelectedFaith(null)}
          className="flex items-center gap-2 text-amber-300 hover:text-amber-200 transition font-semibold text-base"
        >
          <ArrowLeft className="w-5 h-5" />
          {t('faith.backToAll') || 'All Traditions'}
        </button>

        {/* Banner */}
        <section className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-xl">
          <img src={faith.banner} alt={selectedFaith} className="w-full h-full object-cover" />
          <div className={`absolute inset-0 bg-gradient-to-t ${faith.color} flex flex-col justify-end p-8`}>
            <div className="flex items-center gap-4">
              <img src={faith.icon} alt="" className="w-12 h-12 drop-shadow-lg" />
              <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                {t(`faith.labels.${selectedFaith}`)}
              </h2>
            </div>
            <p className="mt-2 text-lg text-white/90">{t('faith.hero')}</p>
          </div>
        </section>

        {/* Practice cards */}
        <section className="grid gap-8 md:grid-cols-2">
          {data.cards.map((c, idx) => (
            <FaithCard key={idx} {...c} />
          ))}
        </section>
      </div>
    );
  }

  // ── Level 1: religion selection grid ───────────────────────────────────
  return (
    <div className="space-y-10 py-8 px-4 md:px-0 font-serif text-white">
      {/* Page header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold">{t('faith.pageTitle') || 'Spiritual Support'}</h1>
        <p className="text-white/80 text-lg">{t('faith.pageSubtitle') || 'Choose your faith tradition to explore practices, prayers, and guidance.'}</p>
      </div>

      {/* Religion cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {FAITHS.map(({ key, icon, banner, color }) => (
          <button
            key={key}
            onClick={() => setSelectedFaith(key)}
            className="relative h-52 rounded-2xl overflow-hidden shadow-lg group focus:outline-none focus:ring-4 focus:ring-amber-400/60 transition-transform hover:-translate-y-1 hover:shadow-2xl"
          >
            {/* Background image */}
            <img
              src={banner}
              alt={key}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t ${color} group-hover:opacity-90 transition-opacity duration-300`} />
            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4">
              <img src={icon} alt="" className="w-14 h-14 drop-shadow-lg" />
              <span className="text-white text-xl font-bold drop-shadow-md tracking-wide">
                {t(`faith.labels.${key}`)}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function FaithCard({ title, icon, description, details, image }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white/25 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden">
      <div className="relative h-48 w-full">
        <img src={image} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="p-6 text-black">
        <div className="flex items-center gap-4 mb-3">
          <img src={icon} alt="icon" className="w-8 h-8" />
          <h3 className="text-xl font-semibold flex-1">{title}</h3>
          <button
            onClick={() => setOpen(o => !o)}
            className="text-gray-600 font-bold text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/10 transition"
          >
            {open ? '−' : '+'}
          </button>
        </div>
        <p className="text-sm leading-relaxed mb-2">{description}</p>
        {open && <div className="mt-2 text-sm whitespace-pre-line leading-relaxed">{details}</div>}
      </div>
    </div>
  );
}
