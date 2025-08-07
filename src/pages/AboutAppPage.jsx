import React from 'react';

export default function AboutAppPage() {
  return (
    <div className="space-y-16 py-12 px-4 md:px-0 font-serif text-white">
      {/* Hero Section */}
      <section className="relative w-full h-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-10 flex flex-col items-center justify-center text-center">
          <p className="font-bold text-lg md:text-xl leading-relaxed tracking-wide max-w-3xl">
            EmpathAI is a safe space to process grief and emotional pain.
          </p>
          <p className="mt-4 font-bold text-lg md:text-xl leading-relaxed tracking-wide max-w-3xl">
            Built on responsible AI and backed by expert-led research.
          </p>
        </div>
      </section>

      <hr className="border-t border-white/30 my-12" />

      {/* About the App */}
      <section className="max-w-4xl mx-auto bg-white/15 backdrop-blur-md rounded-2xl p-10">
        <h2 className="text-3xl md:text-4xl mb-6 font-calligraphy text-white">
          About EmpathAI
        </h2>
        <p className="text-white text-lg leading-relaxed">
          <strong>EmpathAI</strong> is a research-driven wellbeing platform designed to support individuals through grief, emotional distress, and mental health challenges using responsible AI, peer support, and reflective tools.
        </p>
        <p className="text-white text-lg leading-relaxed mt-4">
          Built under the guidance of <strong>Professor Elvira Pérez Vallejos</strong>, a global leader in digital mental health and AI ethics at the <strong>University of Nottingham</strong>, EmpathAI bridges cutting-edge technology with compassionate care. Professor Pérez Vallejos brings decades of interdisciplinary expertise in AI ethics, mental health, and co-produced research—ensuring that EmpathAI is built with users' dignity, privacy, and emotional wellbeing at its core.
        </p>
      </section>

      <hr className="border-t border-white/30 my-12" />

      {/* Features */}
      <section className="max-w-4xl mx-auto bg-white/15 backdrop-blur-md rounded-2xl p-10 space-y-6">
        <h3 className="text-2xl md:text-3xl mb-4 font-calligraphy text-white">What EmpathAI Offers</h3>

        <div>
          <strong> Empathetic AI Chatbot</strong>
          <p>
            Our AI-powered chatbot provides gentle, grounded support during difficult times like bereavement, anxiety, or emotional overwhelm. It responds with empathy, never judgement.
          </p>
        </div>

        <div>
          <strong> Reflective Journaling</strong>
          <p>
            Write about your thoughts, memories, and emotions in a safe, private space. Journaling can be a powerful tool for grief processing and emotional clarity.
          </p>
        </div>

        <div>
          <strong> Habit & Mood Tracking</strong>
          <p>
            Track habits and emotional patterns to better understand your wellbeing over time. Gentle prompts help you stay aware and in tune with your daily rhythm.
          </p>
        </div>

        <div>
          <strong> Writing Letters to your loved ones</strong>
          <p>
            Express love, longing, or unresolved feelings through guided letter-writing rituals. A deeply healing way to reconnect and release.
          </p>
        </div>

        <div>
          <strong>🧘 Mindful Meditation</strong>
          <p>
            Ground yourself with short meditations designed for grief, calm, or emotional overwhelm. Learn to pause, breathe, and gently come back to the present.
          </p>
        </div>

        <div>
          <strong> Sapling Planting & Dedication</strong>
          <p>
            A gentle guide to planting a memorial tree or sapling in honor of a loved one. Create a living tribute and ritual that nurtures remembrance and growth.
          </p>
        </div>

        <div>
          <strong> Wellness Tips</strong>
          <p>
            Small, science-backed suggestions to support mental and emotional health—whether you're just surviving the day or looking to rebuild slowly.
          </p>
        </div>
      </section>

      <hr className="border-t border-white/30 my-12" />

      {/* Research Leadership */}
      <section className="max-w-4xl mx-auto bg-white/15 backdrop-blur-md rounded-2xl p-10">
        <h3 className="text-2xl md:text-3xl mb-4 font-calligraphy text-white">Research Leadership</h3>
        <p className="text-white text-lg leading-relaxed">
          EmpathAI is a project led by <strong>Professor Elvira Pérez Vallejos</strong>, Professor of Mental Health and Digital Technology — jointly appointed by the School of Computer Science and the School of Medicine at the University of Nottingham.
        </p>
        <p className="text-white text-lg leading-relaxed mt-4">
          Professor Pérez Vallejos is internationally recognised for her work on AI Ethics, and was recently named among the <em>100 Brilliant Women in AI Ethics (2025)</em>. She leads over £100M in interdisciplinary research, supported by UKRI, NIHR, and other major research bodies. Her work ensures EmpathAI reflects the highest standards in <strong>privacy, ethical AI, co-production, and digital mental health innovation</strong>.
        </p>
      </section>

      <hr className="border-t border-white/30 my-12" />

      {/* Privacy & Data */}
      <section className="max-w-4xl mx-auto bg-white/15 backdrop-blur-md rounded-2xl p-10">
        <h3 className="text-2xl md:text-3xl mb-4 font-calligraphy text-white">Privacy & Data Protection</h3>
        <p className="text-white text-lg leading-relaxed">
          Your data is treated with the highest standards of care and security.
        </p>
        <ul className="list-disc list-inside text-white text-lg leading-relaxed mt-4 space-y-2">
          <li>All messages sent to the chatbot and between users are stored in encrypted form.</li>
          <li>Data is securely stored on servers within the <strong>University of Nottingham</strong>.</li>
          <li>We do not sell, share, or monetise your personal data. Ever.</li>
        </ul>
      </section>

      <hr className="border-t border-white/30 my-12" />

      {/* Why It Matters */}
      <section className="max-w-3xl mx-auto bg-white/15 backdrop-blur-md rounded-2xl p-10 text-center text-white">
        <h3 className="text-2xl md:text-3xl font-calligraphy mb-4">Why It Matters</h3>
        <p className="text-lg leading-relaxed">
          EmpathAI is more than just a tech tool—it’s a compassionate companion during life’s most vulnerable moments. Guided by leading experts in <strong>Responsible AI</strong>, our mission is to deliver <strong>emotionally intelligent support</strong> that is <strong>safe</strong>, <strong>inclusive</strong>, and <strong>grounded in real-world ethics</strong>.
        </p>
        <p className="text-lg leading-relaxed mt-4">
          EmpathAI is part of a broader vision to ethically integrate AI into sensitive domains like <em>grief support, end-of-life care, and mental health</em>—ensuring that innovation never comes at the expense of humanity.
        </p>
        <p className="text-lg italic mt-6">
          🕊️ Empathy is not a feature. It’s our foundation.
        </p>
      </section>
    </div>
  );
}
