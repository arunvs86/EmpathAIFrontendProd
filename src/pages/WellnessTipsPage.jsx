import React from 'react';
import wellnessBanner from '/assets/wellness_banner.jpg';
import movementImg from '/assets/gentle_movement.jpg';
import nutritionImg from '/assets/nourishing_foods.jpg';
import restImg from '/assets/rest_routine.jpg';
import connectImg from '/assets/social_connection.jpg';
import sleepImg from '/assets/sleep.jpg'
export default function WellnessTipsPage() {
  const tips = [
    {
      title: 'Gentle Movement',
      img: movementImg,
      desc:
        'Try simple stretches or yoga poses that honor your body’s pace. A 10-minute gentle flow can ease tension and boost mood.'
    },
    {
        title: 'Rest & Routine',
        img: restImg,
        desc:
          'Establish a wind-down ritual: dim lights, herbal tea, and a short journaling session. Even 20 minutes can improve sleep quality.'
      },
    {
      title: 'Nourishing Foods',
      img: nutritionImg,
      desc:
        'Blend a smoothie with bananas, spinach, and almonds. Prepare a warm broth or soup rich in vegetables to comfort body and mind.'
    },
    
    {
      title: 'Social Connection',
      img: connectImg,
      desc:
        'Reach out to a friend or support group. Share a walk, a meal, or a phone call—small gestures build emotional support.'
    }
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
    {/* <h1 className="text-4xl md:text-5xl font-calligraphy leading-snug tracking-wide text-center mb-2">
      Wellness Tips for Tough Days
    </h1> */}
    <p className="text-lg md:text-xl leading-relaxed tracking-wide max-w-2xl text-white/90 text-center mb-4">
      Simple, gentle practices to nourish your body and mind.
    </p>
  </div>
</section>

      <hr className="border-t border-white/30 my-12" />

      {/* Tips Grid */}
      <section className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {tips.map((t, i) => (
          <div
            key={i}
            className="bg-white/25 backdrop-blur-md rounded-2xl p-8 hover:scale-[1.02] transition-transform duration-200"
          >
            <img
              src={t.img}
              alt={t.title}
              className="w-full max-h-64 object-contain rounded-lg shadow-md mb-6"
            />
            <h3 className="text-2xl mb-4 font-calligraphy text-white">{t.title}</h3>
            <p className="text-lg leading-relaxed text-white">{t.desc}</p>
          </div>
        ))}
      </section>

      <hr className="border-t border-white/30 my-12" />

      {/* Deep Dive Sections */}
      <section className="space-y-12 max-w-5xl mx-auto">
        <div className="bg-white/25 backdrop-blur-md rounded-2xl p-10 text-white leading-relaxed">
          <h3 className="text-3xl mb-4 font-calligraphy">Nourishing Snack Recipes</h3>
          <ul className="list-disc list-outside pl-6 space-y-3 text-lg">
            <li>Oatmeal bowl with berries, honey, and flax seeds.</li>
            <li>Avocado toast topped with cherry tomatoes and olive oil.</li>
            <li>Warm turmeric milk with almond butter and cinnamon.</li>
          </ul>
        </div>
        <div className="bg-white/25 backdrop-blur-md rounded-2xl p-10 text-white leading-relaxed">
          <h3 className="text-3xl mb-4 font-calligraphy">Sleep & Rest Strategies</h3>
          <p className="text-lg mb-4">
            Create a consistent bedtime: dim lights, avoid screens 30 minutes before sleep,
            and try 4-7-8 breathing to relax the nervous system.
          </p>
          <img
            src={sleepImg}
            alt="Rest routine"
            className="w-full max-h-64 object-contain rounded-lg shadow-md"
          />
        </div>
      </section>

      <hr className="border-t border-white/30 my-12" />

      {/* CTA */}
      {/* <section className="text-center">
        <button className="bg-pink-500 hover:bg-pink-600 text-white font-serif text-lg py-3 px-8 rounded-2xl shadow-lg tracking-wide transition-shadow duration-200 hover:shadow-2xl">
          Download Self-Care Checklist
        </button>
      </section> */}
    </div>
  );
}
