// src/pages/ProfileWeeklyHabits.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
// import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import CustomCalendar from "../components/CustomCalendar";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

export default function ProfileWeeklyHabits() {
  const { userId } = useParams();
  const [habits, setHabits] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showHabitEditor, setShowHabitEditor] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);

  const [showLogEditor, setShowLogEditor] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  // holds the initial checked state so we diff on save
  const initialLogState = useRef({});

  // today @ midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // ─── load habits & logs ─────────────────────────
  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      const token = localStorage.getItem("token");
      // habits
      const resH = await fetch(
        `https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/habits?userId=${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const habitsData = await resH.json();
      setHabits(habitsData);

      // logs per habit
      const allLogs = await Promise.all(
        habitsData.map((h) =>
          fetch(`https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/habits/${h._id}/logs`, {
            headers: { Authorization: `Bearer ${token}` },
          }).then((r) => r.json())
        )
      );
      setLogs(allLogs.flat());
      setLoading(false);
    }
    fetchAll();
  }, [userId]);

  // ─── which dates have any log? ──────────────────
  const dateSet = useMemo(() => {
    const s = new Set();
    logs.forEach((l) => s.add(new Date(l.date).toDateString()));
    return s;
  }, [logs]);

  // ─── streak for a habit ─────────────────────────
  const computeStreak = (habit) => {
    let count = 0,
      day = new Date();
    while (true) {
      const ds = day.toDateString();
      const done = logs.some(
        (l) =>
          l.habitId === habit._id && new Date(l.date).toDateString() === ds
      );
      if (!done) break;
      count++;
      day.setDate(day.getDate() - 1);
    }
    return `${count}d`;
  };

  // ─── Monday-of-this-(or-selected)-week ─────────
  const weekStart = useMemo(() => {
    const d = selectedDate ? new Date(selectedDate) : new Date();
    const day = d.getDay(),
      diff = (day + 6) % 7;
    d.setDate(d.getDate() - diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [selectedDate]);

  // ─── build headers for Mon→Sun ─────────────────
  const headers = useMemo(
    () =>
      [...Array(7)].map((_, i) => {
        const d = new Date(weekStart);
        d.setDate(d.getDate() + i);
        return {
          label: d.toLocaleDateString(undefined, {
            weekday: "short",
            day: "numeric",
          }),
          date: d,
        };
      }),
    [weekStart]
  );

  // ─── save (create/edit) a habit ────────────────
  const handleHabitSave = async (payload) => {
    const token = localStorage.getItem("token");
    const method = editingHabit ? "PUT" : "POST";
    const url = editingHabit
      ? `https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/habits/${editingHabit._id}`
      : `https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/habits`;
    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...payload, userId }),
    });
    setShowHabitEditor(false);
    setEditingHabit(null);
    // refresh list
    const res = await fetch(
      `https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/habits?userId=${userId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setHabits(await res.json());
  };

  // ─── delete a habit ────────────────────────────
  const handleHabitDelete = async (id) => {
    if (!confirm("Delete this habit?")) return;
    const token = localStorage.getItem("token");
    await fetch(`https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/habits/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setHabits((h) => h.filter((x) => x._id !== id));
  };

  // ─── save logs (only those changed) ────────────
  const handleLogSave = async (date, state) => {
    const token = localStorage.getItem("token");
    const init = initialLogState.current;
    await Promise.all(
      Object.entries(state)
        .filter(([hid, val]) => init[hid] !== val)
        .map(([habitId, completed]) =>
          fetch(`https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/habits/${habitId}/log`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ date, completed }),
          })
        )
    );
    setShowLogEditor(false);
    // refresh logs
    const allLogs = await Promise.all(
      habits.map((h) =>
        fetch(`https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/habits/${h._id}/logs`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then((r) => r.json())
      )
    );
    setLogs(allLogs.flat());
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="space-y-6 p-6"
    >
      {/* header + new */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-calligraphy text-white">
          My Weekly Practices
        </h2>
        <button
          onClick={() => {
            setEditingHabit(null);
            setShowHabitEditor(true);
          }}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full"
        >
          <Plus /> New Practice
        </button>
      </div>

      {/* editors */}
      <AnimatePresence>
        {showHabitEditor && (
          <HabitEditor
            habit={editingHabit}
            onSave={handleHabitSave}
            onCancel={() => setShowHabitEditor(false)}
          />
        )}
        {showLogEditor && (
          <HabitLogEditor
            date={selectedDate || new Date()}
            habits={habits}
            logs={logs}
            onSave={handleLogSave}
            onCancel={() => setShowLogEditor(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Monthly Calendar ── */}
      <div className="flex justify-center mb-6">
      <CustomCalendar
  highlightDates={dateSet}
  highlightMode="ring"
          // value={selectedDate || new Date()}
          onDateClick={(d) => {
            if (d <= today) {
              // capture per-habit initial state for this day
              const dstr = d.toDateString();
              const init = {};
              habits.forEach((h) => {
                init[h._id] = logs.some(
                  (l) =>
                    l.habitId === h._id &&
                    new Date(l.date).toDateString() === dstr
                );
              });
              initialLogState.current = init;

              setSelectedDate(d);
              setShowLogEditor(true);
            }
          }}
          prevLabel={<ChevronLeft className="text-emerald-600" />}
          nextLabel={<ChevronRight className="text-emerald-600" />}
          tileClassName={({ date, view }) =>
            view === "month" && dateSet.has(date.toDateString())
              ? "bg-emerald-100 text-black"
              : ""
          }
          tileDisabled={({ date, view }) =>
            view === "month" && date > today
          }
          className="react-calendar bg-white/80 backdrop-blur rounded-2xl p-4 text-black"
        />
      </div>

      {/* loading or weekly table */}
      {loading ? (
        <p className="text-gray-600">Loading…</p>
      ) : (
        <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 overflow-auto text-gray-800">
          <table className="w-full table-fixed">
            <thead>
              <tr>
                <th className="text-left">Habit</th>
                {headers.map((h) => (
                  <th key={h.label} className="text-center px-2">
                    {h.label}
                  </th>
                ))}
                <th className="text-center">🔥 Streak</th>
              </tr>
            </thead>
            <tbody>
              {habits.map((h) => (
                <tr key={h._id} className="hover:bg-white/80">
                  <td className="py-2">{h.name}</td>
                  {headers.map((hd) => {
                    const done = logs.some(
                      (l) =>
                        l.habitId === h._id &&
                        new Date(l.date).toDateString() ===
                          hd.date.toDateString()
                    );
                    const isFuture = hd.date > today;
                    return (
                      <td key={hd.label} className="text-center">
                        <button
                          disabled={isFuture}
                          onClick={() => {
                            if (!isFuture) {
                              // build initialLogState before opening
                              const dstr = hd.date.toDateString();
                              const init = {};
                              habits.forEach((x) => {
                                init[x._id] = logs.some(
                                  (l) =>
                                    l.habitId === x._id &&
                                    new Date(l.date).toDateString() ===
                                      dstr
                                );
                              });
                              initialLogState.current = init;

                              setSelectedDate(hd.date);
                              setShowLogEditor(true);
                            }
                          }}
                          className={`inline-block w-6 h-6 rounded-full border ${
                            done
                              ? "bg-emerald-600 border-emerald-600"
                              : "border-gray-400"
                          } ${isFuture ? "opacity-50 cursor-not-allowed" : ""}`}
                        />
                      </td>
                    );
                  })}
                  <td className="text-center">{computeStreak(h)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  )
}

// …then inline HabitEditor and HabitLogEditor exactly as before…


// ─── HabitEditor ─────────────────────────────────────
function HabitEditor({ habit, onSave, onCancel }) {
  const [name, setName] = useState(habit?.name || "");
  const [description, setDescription] = useState(
    habit?.description || ""
  );
  const [frequency, setFrequency] = useState(
    habit?.frequency || "daily"
  );
  const [weekdays, setWeekdays] = useState(
    habit?.schedule?.weekdays || []
  );
  const [color, setColor] = useState(habit?.color || "#10B981");
  const [icon, setIcon] = useState(habit?.icon || "🌱");

  const toggleWeekday = (d) =>
    setWeekdays((w) =>
      w.includes(d) ? w.filter((x) => x !== d) : [...w, d]
    );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...habit,
      name,
      description,
      frequency,
      schedule: { weekdays },
      color,
      icon,
    });
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={fadeInUp}
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
      <motion.form
        onSubmit={handleSubmit}
        variants={fadeInUp}
        className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 w-full max-w-lg mx-4 text-gray-800"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {habit ? "Edit Habit" : "New Habit"}
          </h2>
          <button onClick={onCancel} className="text-gray-600 text-xl">
            ×
          </button>
        </div>
        <div className="space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Habit name"
            required
            className="w-full border rounded px-3 py-2"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            rows={2}
            className="w-full border rounded px-3 py-2"
          />
          <div>
            <label className="block font-semibold mb-1">
              Frequency
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          {frequency === "weekly" && (
            <div>
              <label className="block font-semibold mb-1">
                Weekdays
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  "Sun",
                  "Mon",
                  "Tue",
                  "Wed",
                  "Thu",
                  "Fri",
                  "Sat",
                ].map((d, i) => (
                  <button
                    type="button"
                    key={d}
                    onClick={() => toggleWeekday(i)}
                    className={`px-3 py-1 rounded ${
                      weekdays.includes(i)
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-semibold mb-1">
                Color
              </label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full h-10 p-0 border-none"
              />
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-1">
                Icon
              </label>
              <input
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full border rounded px-3 py-2 text-xl text-center"
                maxLength={2}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Save
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
}

// ─── HabitLogEditor ───────────────────────────────────
function HabitLogEditor({ date, habits, logs, onSave, onCancel }) {
  const [state, setState] = useState({});

  useEffect(() => {
    const dstr = date.toDateString();
    const init = {};
    habits.forEach((h) => {
      init[h._id] = logs.some(
        (l) =>
          l.habitId === h._id &&
          new Date(l.date).toDateString() === dstr
      );
    });
    setState(init);
  }, [date, habits, logs]);

  const toggle = (id) => setState((s) => ({ ...s, [id]: !s[id] }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(date, state);
  };

  const label = date.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={fadeInUp}
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-40"
    >
      <motion.form
        onSubmit={handleSubmit}
        variants={fadeInUp}
        className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl w-full max-w-md text-gray-800"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">
            Log Habits on {label}
          </h3>
          <button onClick={onCancel} className="text-gray-600 text-xl">
            ×
          </button>
        </div>
        <div className="space-y-3">
          {habits.map((h) => (
            <label key={h._id} className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={!!state[h._id]}
                onChange={() => toggle(h._id)}
                className="h-5 w-5 text-emerald-600"
              />
              <span style={{ color: h.color }} className="font-semibold">
                {h.icon} {h.name}
              </span>
            </label>
          ))}
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Save
          </button>
          </div>
        </motion.form>
      </motion.div>
)
}