// import React, { useState, useMemo } from 'react';
// import { ChevronLeft, ChevronRight } from 'lucide-react';

// export default function CustomCalendar({ entries = [], onDateClick = () => {} }) {
//   const [currentDate, setCurrentDate] = useState(new Date());

//   const year = currentDate.getFullYear();
//   const month = currentDate.getMonth();

//   const startOfMonth = new Date(year, month, 1);
//   const endOfMonth = new Date(year, month + 1, 0);
//   const startDay = startOfMonth.getDay(); // 0 = Sunday
//   const daysInMonth = endOfMonth.getDate();

//   const highlightedDates = useMemo(() => {
//     const safeEntries = Array.isArray(entries) ? entries : [];
//     return new Set(
//       safeEntries.map(e => new Date(e.date).toDateString())
//     );
//   }, [entries]);

//   const days = [];
//   for (let i = 0; i < startDay; i++) {
//     days.push(null); // empty slots before the 1st
//   }
//   for (let d = 1; d <= daysInMonth; d++) {
//     days.push(new Date(year, month, d));
//   }

//   const handlePrev = () => {
//     setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
//   };

//   const handleNext = () => {
//     setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
//   };

//   return (
//     <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 mb-6">
//       <div className="flex justify-between items-center mb-4">
//         <button onClick={handlePrev}>
//           <ChevronLeft className="text-emerald-600 hover:scale-110 transition" />
//         </button>
//         <h2 className="text-xl font-semibold text-white drop-shadow">
//           {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
//         </h2>
//         <button onClick={handleNext}>
//           <ChevronRight className="text-emerald-600 hover:scale-110 transition" />
//         </button>
//       </div>

//       <div className="grid grid-cols-7 text-center text-sm text-gray-300 mb-2">
//         {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
//           <div key={day} className="font-semibold">{day}</div>
//         ))}
//       </div>

//       <div className="grid grid-cols-7 gap-1 text-center">
//         {days.map((date, idx) => {
//           if (!date) return <div key={idx} />;
//           const isToday = new Date().toDateString() === date.toDateString();
//           const isHighlighted = highlightedDates.has(date.toDateString());

//           return (
//             <button
//               key={idx}
//               onClick={() => onDateClick(date)}
//               className={`
//                 aspect-square rounded-lg transition text-sm
//                 ${isToday ? 'border border-emerald-400' : ''}
//                 ${isHighlighted ? 'bg-emerald-200 text-emerald-900 font-bold' : 'hover:bg-gray-100'}
//               `}
//             >
//               {date.getDate()}
//             </button>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CustomCalendar({
  onDateClick = () => {},
  entries = [],
  highlightDates,
  highlightMode = "bg", // options: "bg", "ring", "dot"
}) {

  const computedHighlightDates = useMemo(() => {
    if (highlightDates) return highlightDates;
    const safeEntries = Array.isArray(entries) ? entries : [];
    return new Set(safeEntries.map(e => new Date(e.date).toDateString()));
  }, [entries, highlightDates]);

  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0);
  const startDay = startOfMonth.getDay();
  const daysInMonth = endOfMonth.getDate();

  // const highlightedDates = useMemo(() => {
  //   const safeEntries = Array.isArray(entries) ? entries : [];
  //   return new Set(safeEntries.map(e => new Date(e.date).toDateString()));
  // }, [entries]);

  const days = [];
  for (let i = 0; i < startDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, month, d));

  const handlePrev = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  const handleNext = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  return (
    <div className="bg-white/20 backdrop-blur-lg rounded-xl p-4 shadow-lg w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrev}>
          <ChevronLeft className="text-white hover:scale-110 transition" />
        </button>
        <h2 className="text-lg font-medium text-white">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={handleNext}>
          <ChevronRight className="text-white hover:scale-110 transition" />
        </button>
      </div>

      <div className="grid grid-cols-7 text-center text-xs text-gray-300 mb-1 font-semibold">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5 text-center">
        {days.map((date, idx) => {
          if (!date) return <div key={idx} />;
          // const isToday = new Date().toDateString() === date.toDateString();
          // const isHighlighted = highlightedDates.has(date.toDateString());

          const isToday = new Date().toDateString() === date.toDateString();
const isHighlighted = computedHighlightDates.has(date.toDateString())

let highlightClass = "";
if (isHighlighted) {
  if (highlightMode === "bg") {
    highlightClass = "bg-emerald-300 text-emerald-900 font-bold shadow";
  } else if (highlightMode === "ring") {
    highlightClass = "ring-2 ring-emerald-400 text-white";
  } else if (highlightMode === "dot") {
    highlightClass = "relative after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:bg-emerald-400 after:rounded-full";
  }
}


          return (
            <button
              key={idx}
              onClick={() => onDateClick(date)}
              className={`
                h-8 w-8 flex items-center justify-center rounded-md transition text-xs
                ${isToday ? 'border border-emerald-400 text-white' : ''}
                ${highlightClass || 'hover:bg-white/10 text-white'}
              `}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
