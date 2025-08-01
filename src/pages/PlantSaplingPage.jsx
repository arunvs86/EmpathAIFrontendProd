import React from 'react';
import saplingBanner from '/assets/sapling-banner.jpg';
import saplingGuide from '/assets/sapling_guide.jpg';
import ritualImg from '/assets/planting-ritual.jpg';
import careImg from '/assets/sapling_care.jpg';

export default function PlantSaplingPage() {
  const steps = [
    'Choose a native or symbolic tree species suited to your climate and space.',
    'Prepare the planting hole: twice as wide as the root ball, same depth.',
    'Gently loosen roots and position sapling upright in the center.',
    'Backfill soil, firm gently, and water deeply to settle the roots.',
    'Stake if needed, and mulch around the base to retain moisture.'
  ];

  return (
    // <div className="space-y-16 py-12 px-4 md:px-0 font-serif text-white">
    //   {/* Hero */}
    //   <section className="relative">
    //     <img
    //       src={saplingBanner}
    //       alt="Hands planting a sapling"
    //       className="w-full max-h-96 object-contain rounded-2xl shadow-lg"
    //     />
    //     <div className="absolute inset-0 bg-black/30 rounded-2xl flex flex-col items-center justify-center p-6">
    //       {/* <h1 className="text-4xl mb-50 md:text-5xl font-calligraphy leading-snug tracking-wide text-center">
    //         Planting Hope: A Memorial Sapling Guide
    //       </h1> */}
    //       <p className="mt-4 text-lg mt-20 md:text-xl leading-relaxed tracking-wide max-w-2xl text-center">
    //         Create a living tribute to a loved one and nurture growth, renewal, and remembrance.
    //       </p>
    //     </div>
    //   </section>

    <div className="space-y-16 py-12 px-4 md:px-0 font-serif text-white">
  {/* Hero */}
  <section className="relative w-full h-80 md:h-[32rem]">  
    <img
      src={saplingBanner}
      alt="Hands planting a sapling"
      className="w-full h-full object-cover rounded-2xl shadow-lg"
    />
    <div className="absolute inset-0 bg-black/30 rounded-2xl flex flex-col items-center justify-center p-6">
      {/* <h1 className="text-4xl md:text-5xl font-calligraphy text-white leading-snug tracking-wide text-center">
        Planting Hope: A Memorial Sapling Guide
      </h1> */}
      <p className="mt-40 font-bold text-lg md:text-xl leading-relaxed tracking-wide max-w-2xl text-center">
        Create a living tribute to a loved one.
      </p>
      <p className="mt-4 font-bold text-lg md:text-xl leading-relaxed tracking-wide max-w-2xl text-center">
        Nurture growth, remembrance and renewal.
      </p>
    </div>
  </section>

      <hr className="border-t border-white/30 my-12" />

      {/* Step-by-Step */}
      <section className="max-w-3xl mx-auto bg-white/25 backdrop-blur-md rounded-2xl p-10">
        <h2 className="text-3xl md:text-4xl mb-6 font-calligraphy text-white">
          Step-by-Step Guide
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
          <h3 className="text-2xl md:text-3xl mb-4 font-calligraphy">Ritual & Dedication</h3>
          <p>
            Honor your loved one by writing a dedication on a small plaque, tying a ribbon,
            or speaking a few words before planting. This mindful ritual deepens the
            emotional connection and seals your intention.
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
        <h3 className="text-3xl mb-4 font-calligraphy text-white">Aftercare & Growth Tracking</h3>
        <p className="mb-6 text-white text-lg leading-relaxed">
          Water your sapling deeply twice a week for the first six months, more during hot,
          dry spells. Apply mulch yearly, prune dead branches in winter, and record height
          and leaf development in a journal or photo log.
        </p>
        <img
          src={careImg}
          alt="Sapling care and watering"
          className="w-full rounded-lg shadow-md object-contain max-h-80"
        />
      </section>

      <hr className="border-t border-white/30 my-12" />

      {/* CTA */}
      {/* <section className="text-center">
        <button className="bg-green-500 hover:bg-green-600 text-white font-serif text-lg py-3 px-8 rounded-2xl shadow-lg tracking-wide transition-shadow duration-200 hover:shadow-2xl">
          Start Your Planting Journey
        </button>
      </section> */}
    </div>
  );
}
