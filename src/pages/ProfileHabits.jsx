// src/pages/ProfileHabits.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Plus, Edit2, Trash2 } from "lucide-react";
import CustomCalendar from "../components/CustomCalendar";

export default function ProfileHabits() {
  const { userId } = useParams();
  const [habits, setHabits] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showEditor, setShowEditor] = useState(false);
  const [editHabit, setEditHabit] = useState(null);

  const [showLogEditor, setShowLogEditor] = useState(false);
  const [logDate, setLogDate] = useState(new Date());

  // ─── Fetch habits & logs ─────────────────────
  const loadAll = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const hRes = await fetch("https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/habits", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const hData = await hRes.json();
    setHabits(hData);

    const all = await Promise.all(
      hData.map((h) =>
        fetch(`https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/habits/${h._id}/logs`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then((r) => r.json())
      )
    );
    setLogs(all.flat());
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  // ─── Calendar dot set ────────────────────────
  const dateSet = useMemo(() => {
    const s = new Set();
    logs.forEach((l) => s.add(new Date(l.date).toDateString()));
    return s;
  }, [logs]);

  // ─── Compute streak ──────────────────────────
  const streakFor = (h) => {
    let cnt = 0;
    for (let i = 0; ; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      if (
        logs.some(
          (l) =>
            l.habitId === h._id &&
            new Date(l.date).toDateString() === d.toDateString()
        )
      ) {
        cnt++;
      } else break;
    }
    return cnt;
  };

  // ─── Handlers ───────────────────────────────
  const saveHabit = async (data) => {
    const token = localStorage.getItem("token");
    const method = data._id ? "PUT" : "POST";
    const url = data._id
      ? `https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/habits/${data._id}`
      : "https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/habits";
    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    setShowEditor(false);
    setEditHabit(null);
    loadAll();
  };

  const deleteHabit = async (id) => {
    if (!confirm("Delete this habit?")) return;
    const token = localStorage.getItem("token");
    await fetch(`https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/habits/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    loadAll();
  };

  const toggleToday = async (hid, done) => {
    const token = localStorage.getItem("token");
    await fetch(`https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/habits/${hid}/log`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ date: new Date().toISOString(), completed: done }),
    });
    loadAll();
  };

  const saveLog = async (date, state) => {
    const token = localStorage.getItem("token");
    await Promise.all(
      Object.entries(state).map(([hid, done]) =>
        fetch(`https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/habits/${hid}/log`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ date, completed: done }),
        })
      )
    );
    setShowLogEditor(false);
    loadAll();
  };

  if (loading)
    return <p className="p-6 text-center text-gray-600">Loading habits…</p>;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Habits</h1>
        <button
          onClick={() => {
            setEditHabit(null);
            setShowEditor(true);
          }}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg"
        >
          <Plus size={16} /> New Habit
        </button>
      </div>

      {/* Calendar */}
      <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-4 mb-6">
        <CustomCalendar
          prevLabel={<ChevronLeft className="text-emerald-600" />}
          nextLabel={<ChevronRight className="text-emerald-600" />}
          onDateClick={(d) => {
            setLogDate(d);
            setShowLogEditor(true);
          }}
          tileClassName={({ date, view }) =>
            view === "month" && dateSet.has(date.toDateString())
              ? "bg-emerald-100 rounded"
              : ""
          }
        />
      </div>

      {/* Habit Cards */}
      <div className="space-y-4">
        {habits.map((h) => {
          const done = logs.some(
            (l) =>
              l.habitId === h._id &&
              new Date(l.date).toDateString() === new Date().toDateString()
          );
          const streak = streakFor(h);
          return (
            <div
              key={h._id}
              className="bg-white/20 backdrop-blur-lg rounded-2xl p-4 flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold text-lg">{h.name}</h2>
                {h.tags?.length > 0 && (
                  <p className="text-sm text-gray-700">
                    Tags: {h.tags.join(", ")}
                  </p>
                )}
                <p className="text-sm text-gray-600 mt-1">
                  🔥 Streak: {streak} day{streak !== 1 && "s"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleToday(h._id, !done)}
                  className={`px-3 py-1 rounded ${
                    done ? "bg-emerald-600 text-white" : "bg-gray-200"
                  }`}
                >
                  {done ? "Done Today" : "Mark Done"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditHabit(h);
                    setShowEditor(true);
                  }}
                >
                  <Edit2 className="text-emerald-600" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteHabit(h._id)}
                >
                  <Trash2 className="text-red-600" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Habit Editor Modal */}
      {showEditor && (
        <HabitEditor
          habit={editHabit}
          onSave={saveHabit}
          onCancel={() => setShowEditor(false)}
        />
      )}

      {/* Log Editor Modal */}
      {showLogEditor && (
        <HabitLogEditor
          date={logDate}
          habits={habits}
          logs={logs}
          onSave={saveLog}
          onCancel={() => setShowLogEditor(false)}
        />
      )}
    </div>
  );
}

// ─── Habit Editor ───────────────────────────────
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
  const [tags, setTags] = useState(habit?.tags || []);

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
      tags,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 w-full max-w-lg"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {habit ? "Edit Habit" : "New Habit"}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-600 text-xl"
          >
            ×
          </button>
        </div>
        <div className="space-y-4">
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <textarea
            className="w-full border rounded px-3 py-2"
            rows={2}
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div>
            <label className="block mb-1">Tags (comma-separated)</label>
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="e.g. wellness, water"
              value={tags.join(", ")}
              onChange={(e) =>
                setTags(
                  e.target.value
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)
                )
              }
            />
          </div>

          <div>
            <label className="block mb-1">Frequency</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {frequency === "weekly" && (
            <div>
              <label className="block mb-1">Weekdays</label>
              <div className="flex flex-wrap gap-2">
                {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d,i)=>(
                  <button
                    key={d}
                    type="button"
                    onClick={()=>toggleWeekday(i)}
                    className={`px-3 py-1 rounded ${
                      weekdays.includes(i)
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-200"
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
              <label className="block mb-1">Color</label>
              <input
                type="color"
                className="w-full h-10 border-0 p-0"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1">Icon</label>
              <input
                className="w-full border rounded px-3 py-2 text-xl text-center"
                maxLength={2}
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

// ─── Habit Log Editor ──────────────────────────
function HabitLogEditor({ date, habits, logs, onSave, onCancel }) {
  const [state, setState] = useState({});

  useEffect(() => {
    const key = date.toDateString();
    const initial = {};
    habits.forEach(h => {
      initial[h._id] = logs.some(
        l => 
          l.habitId === h._id &&
          new Date(l.date).toDateString() === key
      );
    });
    setState(initial);
  }, [date, habits, logs]);

  const toggle = id => setState(s => ({ ...s, [id]: !s[id] }));

  const submit = e => {
    e.preventDefault();
    onSave(date, state);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40">
      <form
        onSubmit={submit}
        className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            Log for {date.toLocaleDateString()}
          </h3>
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-600 text-xl"
          >
            ×
          </button>
        </div>
        <div className="space-y-2 mb-4 max-h-64 overflow-auto">
          {habits.map(h => (
            <label key={h._id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!state[h._id]}
                onChange={()=>toggle(h._id)}
                className="h-5 w-5 text-emerald-600"
              />
              <span style={{color:h.color}} className="font-medium">
                {h.icon} {h.name}
              </span>
            </label>
          ))}
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
