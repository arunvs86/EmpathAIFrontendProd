import React, { useState, useEffect, useRef } from 'react';
import bannerImg from '/assets/meditation.jpg';
import benefitsImg from '/assets/meditation-benefits.jpg';
import anchorImg from '/assets/anchor-breath.jpg';
import bodyScanImg from '/assets/body_scan.jpg';
import walkingImg from '/assets/walking_meditation.jpg';

// Circular progress Timer component
function Timer({ duration = 180 }) {
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
              <button className="px-3 py-1 bg-green-500 hover:bg-green-600 rounded-full text-sm" onClick={() => setRunning(true)}>▶︎</button>
            )}
            {running && (
              <button className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 rounded-full text-sm" onClick={() => setRunning(false)}>❚❚</button>
            )}
          </div>
          {timeLeft === 0 && <div className="mt-2 mb-2 text-red-400 text-center text-sm">Time’s up!</div>}
        </div>
      </div>
    </div>
  );
}

export default function MindfulMeditationPage() {
  const practices = [
    { title: 'Anchor Breath', img: anchorImg, desc: [
        'Sit comfortably with spine straight, feet flat on the floor.',
        'Place one hand on your belly, the other on your chest.',
        'Inhale through your nose for 4 counts, feeling the diaphragm expand.',
        'Exhale through pursed lips for 6 counts, releasing tension.'
      ], duration: 180
    },
    { title: 'Body Scan', img: bodyScanImg, desc: [
        'Lie down or sit with eyes closed in a quiet space.',
        'Bring attention to your toes, notice sensations or tension.',
        'Gradually move awareness upward: feet → legs → hips → back → shoulders → arms → neck → head.',
        'Breathe into areas of tension and release with each exhale.'
      ], duration: 300
    },
    { title: 'Walking Meditation', img: walkingImg, desc: [
        'Find a flat, safe path where you can walk uninterrupted.',
        'Begin walking slowly, feeling the lift, movement, and placement of each foot.',
        'Coordinate your natural breath with your steps (e.g., 3 steps inhale, 3 steps exhale).',
        'Maintain soft gaze and relaxed posture.'
      ], duration: 240
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
      Cultivate calm and clarity during moments of loss with guided, restorative practices.
    </p>
  </div>
</section>

      <hr className="border-t border-white/30 my-12" />

      {/* Benefits Section */}
      <section className="max-w-4xl mx-auto bg-white/25 rounded-2xl shadow-lg backdrop-blur-md p-10 text-white hover:border border-amber-300">
        <h2 className="text-3xl md:text-4xl mb-6 leading-snug font-calligraphy">Why Breathe Mindfully?</h2>
        <div className="flex flex-col md:flex-row md:items-start md:gap-8">
  <ul className="flex-1 list-disc list-outside pl-6 space-y-3 leading-relaxed text-lg">
    <li>Reduces anxiety by engaging the parasympathetic system.</li>
    <li>Helps regulate intense emotions and cravings.</li>
    <li>Enhances focus, making daily tasks feel more manageable.</li>
    <li>Creates a gentle anchor in the present moment.</li>
  </ul>
  <img
    src={benefitsImg}
    alt="Meditation benefits illustration"
    className="flex-1 w-full max-h-96 object-contain rounded-lg shadow-md mt-6 md:mt-0"
/>
</div>
        <p className="mt-6 text-lg leading-relaxed">
          Each breath is an opportunity to ground yourself, to notice and release what no longer serves you. Over time, this practice builds resilience and compassionate awareness you can carry into everyday life.
        </p>
      </section>

      <hr className="border-t border-white/30 my-12" />

      {/* Practices List */}
      <section className="space-y-16 max-w-3xl mx-auto ">
        {practices.map((p, idx) => (
          <div key={idx} className="bg-white/25 backdrop-blur-md rounded-2xl p-10 text-white hover:scale-[1.02] transition-transform duration-200 ">
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
          <h3 className="text-2xl md:text-3xl mb-4 font-calligraphy">Guided Meditation Script</h3>
          <p className="text-lg">
            “Close your eyes and take three deep, intentional breaths. As you inhale, envision drawing in peace; as you exhale, release tension and stress. Gently return your focus to the rise and fall of your breath whenever your mind wanders.”
          </p>
        </div>
        <div className="bg-white/25 backdrop-blur-md rounded-2xl p-8 text-white leading-relaxed">
          <h3 className="text-2xl md:text-3xl mb-4 font-calligraphy">Reflection Journal Prompt</h3>
          <ol className="list-decimal list-inside space-y-3 text-lg">
            <li>What sensations did you notice during practice?</li>
            <li>How did your emotions shift from start to finish?</li>
            <li>What thoughts arose, and what did they teach you?</li>
          </ol>
        </div>
      </section>

      <hr className="border-t border-white/30 my-12" />

      {/* CTA Button */}
      {/* <section className="text-center">
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-serif text-lg py-3 px-8 rounded-2xl shadow-lg tracking-wide transition-shadow duration-200 hover:shadow-2xl">
          Begin Your Practice
        </button>
      </section> */}
    </div>
  );
}
