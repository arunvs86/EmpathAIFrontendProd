import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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

const FAITH_KEYS = ['Christianity', 'Islam', 'Hinduism', 'Buddhism', 'Judaism', 'Interfaith'];

function buildFaithData(t) {
  return {
    Christianity: {
      banner: christianImg,
      cards: [
        { title: t('faith.christianity.c1Title'), icon: christianIcon, description: t('faith.christianity.c1Desc'), details: t('faith.christianity.c1Details'), image: christianPrayerImg },
        { title: t('faith.christianity.c2Title'), icon: christianIcon, description: t('faith.christianity.c2Desc'), details: t('faith.christianity.c2Details'), image: psalm23Img },
        { title: t('faith.christianity.c3Title'), icon: christianIcon, description: t('faith.christianity.c3Desc'), details: t('faith.christianity.c3Details'), image: candleImg },
        { title: t('faith.christianity.c4Title'), icon: christianIcon, description: t('faith.christianity.c4Desc'), details: t('faith.christianity.c4Details'), image: serviceImg }
      ]
    },
    Islam: {
      banner: islamImg,
      cards: [
        { title: t('faith.islam.c1Title'), icon: islamIcon, description: t('faith.islam.c1Desc'), details: t('faith.islam.c1Details'), image: duaImg },
        { title: t('faith.islam.c2Title'), icon: islamIcon, description: t('faith.islam.c2Desc'), details: t('faith.islam.c2Details'), image: fatihahImg },
        { title: t('faith.islam.c3Title'), icon: islamIcon, description: t('faith.islam.c3Desc'), details: t('faith.islam.c3Details'), image: graveImg },
        { title: t('faith.islam.c4Title'), icon: islamIcon, description: t('faith.islam.c4Desc'), details: t('faith.islam.c4Details'), image: charityImg }
      ]
    },
    Hinduism: {
      banner: hinduImg,
      cards: [
        { title: t('faith.hinduism.c1Title'), icon: hinduIcon, description: t('faith.hinduism.c1Desc'), details: t('faith.hinduism.c1Details'), image: shraddhaImg },
        { title: t('faith.hinduism.c2Title'), icon: hinduIcon, description: t('faith.hinduism.c2Desc'), details: t('faith.hinduism.c2Details'), image: mantraImg },
        { title: t('faith.hinduism.c3Title'), icon: hinduIcon, description: t('faith.hinduism.c3Desc'), details: t('faith.hinduism.c3Details'), image: lampImg }
      ]
    },
    Buddhism: {
      banner: buddhistImg,
      cards: [
        { title: t('faith.buddhism.c1Title'), icon: buddhistIcon, description: t('faith.buddhism.c1Desc'), details: t('faith.buddhism.c1Details'), image: mettaImg },
        { title: t('faith.buddhism.c2Title'), icon: buddhistIcon, description: t('faith.buddhism.c2Desc'), details: t('faith.buddhism.c2Details'), image: meritImg },
        { title: t('faith.buddhism.c3Title'), icon: buddhistIcon, description: t('faith.buddhism.c3Desc'), details: t('faith.buddhism.c3Details'), image: chantingImg }
      ]
    },
    Judaism: {
      banner: judaismImg,
      cards: [
        { title: t('faith.judaism.c1Title'), icon: judaismIcon, description: t('faith.judaism.c1Desc'), details: t('faith.judaism.c1Details'), image: kaddishImg },
        { title: t('faith.judaism.c2Title'), icon: judaismIcon, description: t('faith.judaism.c2Desc'), details: t('faith.judaism.c2Details'), image: shivaImg },
        { title: t('faith.judaism.c3Title'), icon: judaismIcon, description: t('faith.judaism.c3Desc'), details: t('faith.judaism.c3Details'), image: tzedakahImg }
      ]
    },
    Interfaith: {
      banner: interfaithImg,
      cards: [
        { title: t('faith.interfaith.c1Title'), icon: interfaithIcon, description: t('faith.interfaith.c1Desc'), details: t('faith.interfaith.c1Details'), image: candle2Img },
        { title: t('faith.interfaith.c2Title'), icon: interfaithIcon, description: t('faith.interfaith.c2Desc'), details: t('faith.interfaith.c2Details'), image: silenceImg },
        { title: t('faith.interfaith.c3Title'), icon: interfaithIcon, description: t('faith.interfaith.c3Desc'), details: t('faith.interfaith.c3Details'), image: jarImg }
      ]
    }
  };
}

export default function ReligiousPracticesPage() {
  const { t } = useTranslation();
  const [selectedFaith, setSelectedFaith] = useState('Christianity');
  const faithData = buildFaithData(t);
  const data = faithData[selectedFaith] || { banner: '', cards: [] };

  return (
    <div className="space-y-12 py-8 px-4 md:px-0 font-serif text-white">
      {/* Hero */}
      <section className="relative h-80 md:h-[32rem] rounded-2xl overflow-hidden">
        <img
          src={data.banner}
          alt="faith banner"
          className="w-full h-full object-contain"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-8">
          <p className="mt-2 text-lg md:text-xl">{t('faith.hero')}</p>
        </div>
      </section>

      {/* Filter */}
      <div className="max-w-3xl mx-auto flex justify-center">
        <select
          value={selectedFaith}
          onChange={e => setSelectedFaith(e.target.value)}
          className="bg-white/20 text-white px-4 py-2 rounded-full shadow-md focus:outline-none"
        >
          {FAITH_KEYS.map(faith => (
            <option key={faith} value={faith}>{t(`faith.labels.${faith}`)}</option>
          ))}
        </select>
      </div>

      {/* Cards */}
      <section className="max-w-5xl mx-auto grid gap-8 md:grid-cols-2">
        {data.cards.map((c, idx) => (
          <FaithCard key={idx} {...c} />
        ))}
      </section>
    </div>
  );
}

function FaithCard({ title, icon, description, details, image }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white/25 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden">
      <div className="relative h-48 w-full">
        <img src={image} alt="" className="w-full h-full object-contain bg-black" />
      </div>
      <div className="p-6 text-black">
        <div className="flex items-center gap-4 mb-3">
          <img src={icon} alt="icon" className="w-8 h-8" />
          <h3 className="text-xl font-semibold flex-1">{title}</h3>
          <button onClick={() => setOpen(o => !o)} className="text-grey-600 font-bold text-2xl">{open ? "-" : "+"}</button>
        </div>
        <p className="text-sm leading-relaxed mb-2">{description}</p>
        {open && <div className="mt-2 text-sm whitespace-pre-line">{details}</div>}
      </div>
    </div>
  );
}
