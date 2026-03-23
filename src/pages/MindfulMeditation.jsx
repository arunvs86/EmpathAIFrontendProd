import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import bannerImg from '/assets/meditation.jpg';
import benefitsImg from '/assets/meditation-benefits.jpg';
import anchorImg from '/assets/anchor-breath.jpg';
import bodyScanImg from '/assets/body_scan.jpg';
import walkingImg from '/assets/walking_meditation.jpg';

// Circular progress Timer component
function Timer({ duration = 180 }) {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState(duration);
  const [running, setRunning] = useState(false);
  const requestRef = useRef();
  const radius = 54;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    if (!running) return;
    let prev = performance.now();
    const step = now => {
      const deltaSecs = Math.floor((now - prev) / 1000);
      if (deltaSecs > 0) {
        setTimeLeft(prevT => Math.max(prevT - deltaSecs, 0));
        prev = now;
      }
      if (timeLeft > 0) requestRef.current = requestAnimationFrame(step);
      else { setRunning(false); cancelAnimationFrame(requestRef.current); }
    };
    requestRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(requestRef.current);
  }, [running]);

  const progress = timeLeft / duration;
  const dashOffset = circumference * (1 - progress);
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex justify-center">
      <div className="relative w-36 h-36">
        <svg className="transform -rotate-90" width={120} height={120}>
          <circle cx={60} cy={60} r={radius} stroke="rgba(255,255,255,0.3)" strokeWidth={4} fill="none" />
          <circle cx={60} cy={60} r={radius} stroke="white" strokeWidth={4} fill="none"
            strokeDasharray={circumference} strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 0.5s linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white font-serif">
          <div className="text-2xl mr-6 font-mono leading-none">{minutes}:{seconds.toString().padStart(2, '0')}</div>
          <div className="mt-2 mr-6 flex space-x-2">
            {!running && timeLeft > 0 && (
              <button className="px-3 py-1 bg-green-500 hover:bg-green-600 rounded-full text-sm" onClick={() => setRunning(true)}>&#9654;&#65038;</button>
            )}
            {running && (
              <button className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 rounded-full text-sm" onClick={() => setRunning(false)}>&#10074;&#10074;</button>
            )}
          </div>
          {timeLeft === 0 && <div className="mt-2 mb-2 text-red-400 text-center text-sm">{t('meditation.timesUp')}</div>}
        </div>
      </div>
    </div>
  );
}

export default function MindfulMeditationPage() {
  const { t } = useTranslation();

  const practices = [
    {
      title: t('meditation.p1Title'),
      img: anchorImg,
      desc: [
        t('meditation.p1Step1'),
        t('meditation.p1Step2'),
        t('meditation.p1Step3'),
        t('meditation.p1Step4')
      ],
      duration: 180
    },
    {
      title: t('meditation.p2Title'),
      img: bodyScanImg,
      desc: [
        t('meditation.p2Step1'),
        t('meditation.p2Step2'),
        t('meditation.p2Step3'),
        t('meditation.p2Step4')
      ],
      duration: 300
    },
    {
      title: t('meditation.p3Title'),
      img: walkingImg,
      desc: [
        t('meditation.p3Step1'),
        t('meditation.p3Step2'),
        t('meditation.p3Step3'),
        t('meditation.p3Step4')
      ],
      duration: 240
    }
  ];

  return (
    <div className="space-y-16 py-12 px-4 md:px-0 font-serif">

      <section className="relative w-full h-80 md:h-[32rem]">
        <img
          src={bannerImg}
          alt="Meditation in nature"
          className="w-full h-full object-cover rounded-2xl shadow-lg"
        />
        <div className="absolute inset-0 bg-black/30 rounded-2xl flex flex-col justify-end items-center p-6">
          <p className="text-lg font-bold md:text-xl leading-relaxed tracking-wide text-white/90 max-w-2xl text-center mb-4">
            {t('meditation.hero')}
          </p>
        </div>
      </section>

      <hr className="border-t border-white/30 my-12" />

      {/* Benefits Section */}
      <section className="max-w-4xl mx-auto bg-white/25 rounded-2xl shadow-lg backdrop-blur-md p-10 text-white hover:border border-amber-300">
        <h2 className="text-3xl md:text-4xl mb-6 leading-snug font-calligraphy">{t('meditation.benefitsTitle')}</h2>
        <div className="flex flex-col md:flex-row md:items-start md:gap-8">
          <ul className="flex-1 list-disc list-outside pl-6 space-y-3 leading-relaxed text-lg">
            <li>{t('meditation.benefit1')}</li>
            <li>{t('meditation.benefit2')}</li>
            <li>{t('meditation.benefit3')}</li>
            <li>{t('meditation.benefit4')}</li>
          </ul>
          <img
            src={benefitsImg}
            alt="Meditation benefits illustration"
            className="flex-1 w-full max-h-96 object-contain rounded-lg shadow-md mt-6 md:mt-0"
          />
        </div>
        <p className="mt-6 text-lg leading-relaxed">
          {t('meditation.benefitsDesc')}
        </p>
      </section>

      <hr className="border-t border-white/30 my-12" />

      {/* Practices List */}
      <section className="space-y-16 max-w-3xl mx-auto">
        {practices.map((p, idx) => (
          <div key={idx} className="bg-white/25 backdrop-blur-md rounded-2xl p-10 text-white hover:scale-[1.02] transition-transform duration-200">
            <h3 className="text-2xl md:text-3xl mb-4 leading-snug font-calligraphy">{p.title}</h3>
            <img src={p.img} alt={p.title} className="w-full max-h-96 object-contain rounded-lg mb-6 shadow" />
            <ol className="list-decimal list-inside space-y-2 mb-6 text-lg">
              {p.desc.map((step, i) => <li key={i}>{step}</li>)}
            </ol>
            <Timer duration={p.duration} />
          </div>
        ))}
      </section>

      <hr className="border-t border-white/30 my-12" />

      {/* Additional Resources */}
      <section className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 font-serif">
        <div className="bg-white/25 backdrop-blur-md rounded-2xl p-8 text-white leading-relaxed">
          <h3 className="text-2xl md:text-3xl mb-4 font-calligraphy">{t('meditation.scriptTitle')}</h3>
          <p className="text-lg">
            {t('meditation.scriptText')}
          </p>
        </div>
        <div className="bg-white/25 backdrop-blur-md rounded-2xl p-8 text-white leading-relaxed">
          <h3 className="text-2xl md:text-3xl mb-4 font-calligraphy">{t('meditation.journalTitle')}</h3>
          <ol className="list-decimal list-inside space-y-3 text-lg">
            <li>{t('meditation.journal1')}</li>
            <li>{t('meditation.journal2')}</li>
            <li>{t('meditation.journal3')}</li>
          </ol>
        </div>
      </section>

      <hr className="border-t border-white/30 my-12" />
    </div>
  );
}
