import React, { useState } from 'react';
import { Pill, Bell, Plus, Sparkles, Lock, Trash2 } from 'lucide-react';

export default function CaregiverView({ meds, adherence, consent, alerts, onAddMed, onDeleteMed }) {
  const [newName, setNewName] = useState('');
  const [newTime, setNewTime] = useState('06:00 PM');
  const [aiReply, setAiReply] = useState('Ask me anything about pill timings or food interactions!');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onAddMed({ name: newName.trim(), time: newTime.trim() || '06:00 PM' });
    setNewName('');
  };

  const visibleAlerts = alerts.filter((alert) => {
    if (alert.type === 'taken') return consent.medLogs;
    if (alert.type === 'skipped') return consent.missedAlerts;
    return true;
  });

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="aayu-card p-6 rounded-2xl space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Pill className="w-5 h-5 text-teal-700" /> Medication Plan
          </h3>
          <span className="aayu-pill-badge font-bold px-3 py-1 rounded-full text-sm">
            {adherence}% Adherence
          </span>
        </div>

        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
          <div className="aayu-progress-fill h-full rounded-full" style={{ width: `${adherence}%` }} />
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Medicine name (e.g. Dolo 650)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="flex-1 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-teal-600"
          />
          <input
            type="text"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            className="w-24 border border-slate-300 rounded-xl px-2 py-2 text-sm focus:outline-none focus:border-teal-600"
          />
          <button
            type="submit"
            className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-1 transition"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </form>

        <ul className="divide-y divide-slate-100">
          {meds.map((m) => (
            <li key={m.id} className="py-2.5 flex items-center justify-between text-sm">
              <div>
                <span className="font-bold">{m.name}</span> <span className="text-slate-500">({m.time})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="uppercase text-xs font-bold px-2 py-0.5 rounded bg-slate-100">{m.status}</span>
                <button
                  type="button"
                  onClick={() => onDeleteMed(m.id)}
                  className="text-slate-400 hover:text-red-600 transition"
                  title="Delete medicine"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-6">
        <div className="aayu-card p-6 rounded-2xl">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-3">
            <Bell className="w-5 h-5 text-teal-700" /> Consent-Gated Live Alerts
          </h3>
          {!consent.medLogs && !consent.missedAlerts ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm flex items-center gap-2">
              <Lock className="w-4 h-4" /> Senior has paused live log sharing in AayuPact Vault.
            </div>
          ) : visibleAlerts.length === 0 ? (
            <p className="text-sm text-slate-500">No permitted alerts right now.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {visibleAlerts.map((a) => (
                <li key={a.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">{a.text}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="aayu-card p-6 rounded-2xl">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-teal-700" /> AI Care Co-Pilot
          </h3>
          <div className="flex flex-wrap gap-2 mb-3">
            <button
              type="button"
              onClick={() => setAiReply('Telma 40 is best taken every morning at 8 AM after breakfast to keep BP steady.')}
              className="text-xs bg-teal-50 hover:bg-teal-100 text-teal-800 font-semibold px-3 py-1.5 rounded-lg transition"
            >
              Telma 40 Timing?
            </button>
            <button
              type="button"
              onClick={() => setAiReply('Glycomet GP 1 should be taken 15 mins before lunch to prevent post-meal sugar spikes.')}
              className="text-xs bg-teal-50 hover:bg-teal-100 text-teal-800 font-semibold px-3 py-1.5 rounded-lg transition"
            >
              Glycomet Meal Rule?
            </button>
          </div>
          <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">{aiReply}</p>
        </div>
      </div>
    </div>
  );
}

