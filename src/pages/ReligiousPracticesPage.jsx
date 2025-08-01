// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// // Faith icons
// import christianIcon from '/assets/icons/christianity.svg';
// import islamIcon from '/assets/icons/islam.svg';
// import hinduIcon from '/assets/icons/hinduism.svg';
// import buddhistIcon from '/assets/icons/buddhism.svg';
// import judaismIcon from '/assets/icons/judaism.svg';
// import interfaithIcon from '/assets/icons/interfaith.svg';

// // Faith-specific hero images
// import christianImg from '/assets/religion/christian.jpg';
// import islamImg from '/assets/religion/islam.jpg';
// import hinduImg from '/assets/religion/hindu.jpg';
// import buddhistImg from '/assets/religion/buddhist.jpg';
// import judaismImg from '/assets/religion/judaism.jpg';
// import interfaithImg from '/assets/religion/interfaith.jpg';

// // Content data
// const faithData = {
//   Christianity: {
//     banner: christianImg,
//     cards: [
//       {
//         title: 'Belief in Eternal Life',
//         icon: christianIcon,
//         description: 'Christians believe death is a passage to eternal life with God.',
//         details: `According to John 11:25–26:\n"I am the resurrection and the life. He who believes in me will live, even though he dies."\nReflect on this promise in prayer, trusting in the hope beyond sorrow.`,
//         // image: '/assets/religion/christian_prayer.jpg'
//       },
//       {
//         title: 'Psalm 23 Reading',
//         icon: christianIcon,
//         description: 'Psalm 23 reassures God’s guidance through life’s darkest valleys.',
//         details: `"The Lord is my shepherd; I shall not want..."\nRecite each line slowly, visualizing green pastures and still waters to soothe your heart.`,
//         // image: '/assets/religion/psalm23.jpg'
//       },
//       {
//         title: 'Memorial Candle Ritual',
//         icon: christianIcon,
//         description: 'Light a candle to symbolize the light of Christ overcoming darkness.',
//         details: `Choose a quiet evening. Light a candle and whisper a prayer for your loved one.\nSit in silence, letting the flame remind you of eternal hope.`,
//         // image: '/assets/religion/candle.jpg'
//       },
//       {
//         title: 'Community Memorial Service',
//         icon: christianIcon,
//         description: 'Gather with others to share prayers, scripture, and memories.',
//         details: `Attend or organize a small service: read favorite passages, sing hymns, and offer testimonies.\nCommunity solidarity brings comfort and mutual support.`,
//         // image: '/assets/religion/service.jpg'
//       }
//     ]
//   },
//   Islam: {
//     banner: islamImg,
//     cards: [
//       {
//         title: 'Dua for the Deceased',
//         icon: islamIcon,
//         description: 'A concise prayer seeking Allah’s mercy on the departed.',
//         details: `Recite:\nAllahummaghfirli warhamhu wa'afihi wa'fu 'anhu.\nFocus on sincerity, imagining the soul finding peace.`,
//         // image: '/assets/religion/dua.jpg'
//       },
//       {
//         title: 'Sura Al-Fatihah Reflection',
//         icon: islamIcon,
//         description: 'The opening chapter offers comfort and guidance.',
//         details: `Read slowly: "In the name of Allah, the Most Gracious..."\nPonder each attribute of mercy as a balm for grief.`,
//         // image: '/assets/religion/fatihah.jpg'
//       },
//       {
//         title: 'Visiting the Grave',
//         icon: islamIcon,
//         description: 'Pay respects and pray for the deceased’s forgiveness.',
//         details: `Stand respectfully at the grave, raise hands in dua, and say prayers requesting pardon and peace.`,
//         // image: '/assets/religion/grave.jpg'
//       },
//       {
//         title: 'Charitable Acts in Memory',
//         icon: islamIcon,
//         description: 'Give charity (sadaqah) for the benefit of the departed.',
//         details: `Donate food, water, or support a cause.\nIntend the reward be shared with the loved one’s soul.`,
//         // image: '/assets/religion/charity.jpg'
//       }
//     ]
//   },
//   Hinduism: {
//     banner: hinduImg,
//     cards: [
//       {
//         title: 'Shraddha Ceremony',
//         icon: hinduIcon,
//         description: 'Honoring ancestors through offerings and rituals.',
//         details: `Offer rice, black sesame, and water while chanting your ancestor’s name.\nThis connects you to the lineage and fosters healing.`,
//         // image: '/assets/religion/shraddha.jpg'
//       },
//       {
//         title: 'Mahamrityunjaya Mantra',
//         icon: hinduIcon,
//         description: 'A powerful chant for healing and liberation.',
//         details: `Chant: "Om Tryambakam Yajamahe..."\nRepeat 108 times, focusing on each syllable to calm the mind.`,
//         // image: '/assets/religion/mantra.jpg'
//       },
//       {
//         title: 'Oil Lamp Offering (Deepam)',
//         icon: hinduIcon,
//         description: 'Lighting a lamp signifies removing darkness with light.',
//         details: `Light an oil lamp in a safe place.\nReflect on inner light guiding you through grief.`,
//         // image: '/assets/religion/lamp.jpg'
//       }
//     ]
//   },
//   Buddhism: {
//     banner: buddhistImg,
//     cards: [
//       {
//         title: 'Metta Meditation',
//         icon: buddhistIcon,
//         description: 'Cultivate loving-kindness for yourself and others.',
//         details: `Silently repeat: "May I be safe. May I be peaceful..."\nExtend these wishes to all beings, including your loved one.`,
//         // image: '/assets/religion/metta.jpg'
//       },
//       {
//         title: 'Merit-Making Acts',
//         icon: buddhistIcon,
//         description: 'Perform good deeds to honor the departed’s memory.',
//         details: `Donate to temples or volunteer.\nDedicate your positive actions as merit for their peaceful rebirth.`,
//         // image: '/assets/religion/merit.jpg'
//       },
//       {
//         title: 'Chanting & Silence',
//         icon: buddhistIcon,
//         description: 'Use chanting and silent reflection together.',
//         details: `Chant a short sutra, then sit in silence for several minutes.\nNotice thoughts without attachment.`,
//         // image: '/assets/religion/chanting.jpg'
//       }
//     ]
//   },
//   Judaism: {
//     banner: judaismImg,
//     cards: [
//       {
//         title: 'Mourner’s Kaddish',
//         icon: judaismIcon,
//         description: 'A prayer exalting the divine amidst loss.',
//         details: `Recite in the congregation or privately: introduction, affirmation of holiness, and communal hope.`,
//         // image: '/assets/religion/kaddish.jpg'
//       },
//       {
//         title: 'Shiva Practices',
//         icon: judaismIcon,
//         description: 'Seven days of mourning with community support.',
//         details: `Invite close family/friends to share stories.\nSit on low stools, cover mirrors, focus on remembrance.`,
//         // image: '/assets/religion/shiva.jpg'
//       },
//       {
//         title: 'Charity (Tzedakah)',
//         icon: judaismIcon,
//         description: 'Give to charity in memory of the departed.',
//         details: `Donate to a cause they valued.\nThis act of justice honors their legacy.`,
//         // image: '/assets/religion/tzedakah.jpg'
//       }
//     ]
//   },
//   Interfaith: {
//     banner: interfaithImg,
//     cards: [
//       {
//         title: 'Candle Lighting',
//         icon: interfaithIcon,
//         description: 'A universal symbol of hope and remembrance.',
//         details: `Light a candle in quiet reflection.\nSpeak your loved one’s name and hold a moment of silence.`,
//         // image: '/assets/religion/candle2.jpg'
//       },
//       {
//         title: 'Moment of Silence',
//         icon: interfaithIcon,
//         description: 'Pause to be fully present with your grief.',
//         details: `Set a timer for 5 minutes.\nSit comfortably, breathe deeply, and observe your emotions.`,
//         // image: '/assets/religion/silence.jpg'
//       },
//       {
//         title: 'Memory Jar',
//         icon: interfaithIcon,
//         description: 'Write memories on paper and place them in a jar.',
//         details: `Encourage family/friends to add notes.\nRead them later to celebrate their life.`,
//         // image: '/assets/religion/jar.jpg'
//       }
//     ]
//   }
// };

// export default function ReligiousPracticesPage() {
//   const [selectedFaith, setSelectedFaith] = useState('Christianity');
//   const navigate = useNavigate();
//   const data = faithData[selectedFaith] || { banner: '', cards: [] };

//   return (
//     <div className="space-y-12 py-8 px-4 md:px-0 font-serif text-white">
//       {/* Hero */}
//       <section className="relative h-80 md:h-[32rem] rounded-2xl overflow-hidden">
//         <img
//           src={data.banner}
//           alt=""
//           className="w-full h-full object-cover"
//         />
//         <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-8">
//           <h1 className="text-4xl md:text-5xl font-calligraphy">Finding Comfort Through Faith</h1>
//           <p className="mt-2 text-lg md:text-xl">Explore rituals and beliefs across religions to support you in grief.</p>
//         </div>
//       </section>

//       {/* Filter */}
//       <div className="max-w-3xl mx-auto flex justify-center">
//         <select
//           value={selectedFaith}
//           onChange={e => setSelectedFaith(e.target.value)}
//           className="bg-white/20 text-white px-4 py-2 rounded-full shadow-md focus:outline-none"
//         >
//           {Object.keys(faithData).map(faith => (
//             <option key={faith} value={faith}>{faith}</option>
//           ))}
//         </select>
//       </div>

//       {/* Cards */}
//       <section className="max-w-5xl mx-auto grid gap-8 md:grid-cols-2">
//         {data.cards.map((c, idx) => (
//           <FaithCard key={idx} {...c} />
//         ))}
//       </section>

//       {/* Resources */}
//       <section className="max-w-4xl mx-auto space-y-4">
//         <h2 className="text-2xl font-calligraphy">Additional Resources</h2>
//         <ul className="list-disc list-inside space-y-2">
//           <li><a href="/assets/prayers.pdf" className="underline">Download Prayers & Readings (PDF)</a></li>
//           <li><button onClick={() => navigate('/contacts/chaplain')} className="underline">Contact a Chaplain</button></li>
//           <li><a href="/faith-groups-uk" className="underline">Find Local Faith Groups in the UK</a></li>
//         </ul>
//       </section>
//     </div>
//   );
// }

// function FaithCard({ title, icon, description, details, image }) {
//   const [open, setOpen] = useState(false);
//   return (
//     <div className="bg-white/25 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden">
//       <img src={image} alt="" className="w-full h-40 object-cover" />
//       <div className="p-6 text-black">
//         <div className="flex items-center gap-4 mb-3">
//           <img src={icon} alt="" className="w-8 h-8" />
//           <h3 className="text-xl font-semibold flex-1">{title}</h3>
//           <button onClick={() => setOpen(o => !o)} className="text-emerald-600 font-bold text-2xl">{open ? '−' : '+'}</button>
//         </div>
//         <p className="text-sm leading-relaxed mb-2">{description}</p>
//         {open && <div className="mt-2 text-sm whitespace-pre-line">{details}</div>}
//       </div>
//     </div>
//   );
// }


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

// Content data
const faithData = {
  Christianity: {
    banner: christianImg,
    cards: [
      {
        title: 'Belief in Eternal Life',
        icon: christianIcon,
        description: 'Christians believe death is a passage to eternal life with God.',
        details: `According to John 11:25–26:\n"I am the resurrection and the life. He who believes in me will live, even though he dies."\nReflect on this promise in prayer, trusting in the hope beyond sorrow.`,
        image: christianPrayerImg
      },
      {
        title: 'Psalm 23 Reading',
        icon: christianIcon,
        description: 'Psalm 23 reassures God’s guidance through life’s darkest valleys.',
        details: `"The Lord is my shepherd; I shall not want..."\nRecite each line slowly, visualizing green pastures and still waters to soothe your heart.`,
        image: psalm23Img
      },
      {
        title: 'Memorial Candle Ritual',
        icon: christianIcon,
        description: 'Light a candle to symbolize the light of Christ overcoming darkness.',
        details: `Choose a quiet evening. Light a candle and whisper a prayer for your loved one.\nSit in silence, letting the flame remind you of eternal hope.`,
        image: candleImg
      },
      {
        title: 'Community Memorial Service',
        icon: christianIcon,
        description: 'Gather with others to share prayers, scripture, and memories.',
        details: `Attend or organize a small service: read favorite passages, sing hymns, and offer testimonies.\nCommunity solidarity brings comfort and mutual support.`,
        image: serviceImg
      }
    ]
  },
  Islam: {
    banner: islamImg,
    cards: [
      { title: 'Dua for the Deceased', icon: islamIcon, description: 'A concise prayer seeking Allah’s mercy on the departed.', details: `Recite:\nAllahummaghfirli warhamhu wa'afihi wa'fu 'anhu.\nFocus on sincerity, imagining the soul finding peace.`, image: duaImg },
      { title: 'Sura Al-Fatihah Reflection', icon: islamIcon, description: 'The opening chapter offers comfort and guidance.', details: `Read slowly: "In the name of Allah, the Most Gracious..."\nPonder each attribute of mercy as a balm for grief.`, image: fatihahImg },
      { title: 'Visiting the Grave', icon: islamIcon, description: 'Pay respects and pray for the deceased’s forgiveness.', details: `Stand respectfully at the grave, raise hands in dua, and say prayers requesting pardon and peace.`, image: graveImg },
      { title: 'Charitable Acts in Memory', icon: islamIcon, description: 'Give charity (sadaqah) for the benefit of the departed.', details: `Donate food, water, or support a cause.\nIntend the reward be shared with the loved one’s soul.`, image: charityImg }
    ]
  },
  Hinduism: {
    banner: hinduImg,
    cards: [
      { title: 'Shraddha Ceremony', icon: hinduIcon, description: 'Honoring ancestors through offerings and rituals.', details: `Offer rice, black sesame, and water while chanting your ancestor’s name.\nThis connects you to the lineage and fosters healing.`, image: shraddhaImg },
      { title: 'Mahamrityunjaya Mantra', icon: hinduIcon, description: 'A powerful chant for healing and liberation.', details: `Chant: "Om Tryambakam Yajamahe..."\nRepeat 108 times, focusing on each syllable to calm the mind.`, image: mantraImg },
      { title: 'Oil Lamp Offering (Deepam)', icon: hinduIcon, description: 'Lighting a lamp signifies removing darkness with light.', details: `Light an oil lamp in a safe place.\nReflect on inner light guiding you through grief.`, image: lampImg }
    ]
  },
  Buddhism: {
    banner: buddhistImg,
    cards: [
      { title: 'Metta Meditation', icon: buddhistIcon, description: 'Cultivate loving-kindness for yourself and others.', details: `Silently repeat: "May I be safe. May I be peaceful..."\nExtend these wishes to all beings, including your loved one.`, image: mettaImg },
      { title: 'Merit-Making Acts', icon: buddhistIcon, description: 'Perform good deeds to honor the departed’s memory.', details: `Donate to temples or volunteer.\nDedicate your positive actions as merit for their peaceful rebirth.`, image: meritImg },
      { title: 'Chanting & Silence', icon: buddhistIcon, description: 'Use chanting and silent reflection together.', details: `Chant a short sutra, then sit in silence for several minutes.\nNotice thoughts without attachment.`, image: chantingImg }
    ]
  },
  Judaism: {
    banner: judaismImg,
    cards: [
      { title: 'Mourner’s Kaddish', icon: judaismIcon, description: 'A prayer exalting the divine amidst loss.', details: `Recite in the congregation or privately: introduction, affirmation of holiness, and communal hope.`, image: kaddishImg },
      { title: 'Shiva Practices', icon: judaismIcon, description: 'Seven days of mourning with community support.', details: `Invite close family/friends to share stories.\nSit on low stools, cover mirrors, focus on remembrance.`, image: shivaImg },
      { title: 'Charity (Tzedakah)', icon: judaismIcon, description: 'Give to charity in memory of the departed.', details: `Donate to a cause they valued.\nThis act of justice honors their legacy.`, image: tzedakahImg }
    ]
  },
  Interfaith: {
    banner: interfaithImg,
    cards: [
      { title: 'Candle Lighting', icon: interfaithIcon, description: 'A universal symbol of hope and remembrance.', details: `Light a candle in quiet reflection.\nSpeak your loved one’s name and hold a moment of silence.`, image: candle2Img },
      { title: 'Moment of Silence', icon: interfaithIcon, description: 'Pause to be fully present with your grief.', details: `Set a timer for 5 minutes.\nSit comfortably, breathe deeply, and observe your emotions.`, image: silenceImg },
      { title: 'Memory Jar', icon: interfaithIcon, description: 'Write memories on paper and place them in a jar.', details: `Encourage family/friends to add notes.\nRead them later to celebrate their life.`, image: jarImg }
    ]
  }
};

export default function ReligiousPracticesPage() {
  const [selectedFaith, setSelectedFaith] = useState('Christianity');
  const navigate = useNavigate();
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
          {/* <h1 className="text-4xl md:text-5xl font-calligraphy">Finding Comfort Through Faith</h1> */}
          <p className="mt-2 text-lg md:text-xl">Explore rituals and beliefs across religions to support you in grief.</p>
        </div>
      </section>

      {/* Filter */}
      <div className="max-w-3xl mx-auto flex justify-center">
        <select
          value={selectedFaith}
          onChange={e => setSelectedFaith(e.target.value)}
          className="bg-white/20 text-white px-4 py-2 rounded-full shadow-md focus:outline-none"
        >
          {Object.keys(faithData).map(faith => (
            <option key={faith} value={faith}>{faith}</option>
          ))}
        </select>
      </div>

      {/* Cards */}
      <section className="max-w-5xl mx-auto grid gap-8 md:grid-cols-2">
        {data.cards.map((c, idx) => (
          <FaithCard key={idx} {...c} />
        ))}
      </section>

      {/* Resources */}
      {/* <section className="max-w-4xl mx-auto space-y-4">
        <h2 className="text-2xl font-calligraphy">Additional Resources</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><a href="/assets/prayers.pdf" className="underline">Download Prayers & Readings (PDF)</a></li>
          <li><button onClick={() => navigate('/contacts/chaplain')} className="underline">Contact a Chaplain</button></li>
          <li><a href="/faith-groups-uk" className="underline">Find Local Faith Groups in the UK</a></li>
        </ul>
      </section> */}
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
          <button onClick={() => setOpen(o => !o)} className="text-grey-600 font-bold text-2xl">{open ? '−' : '+'}</button>
        </div>
        <p className="text-sm leading-relaxed mb-2">{description}</p>
        {open && <div className="mt-2 text-sm whitespace-pre-line">{details}</div>}
      </div>
    </div>
  );
}
