import React from 'react';
import { ShieldCheck, Volume2, Check, X, PhoneCall, RotateCcw } from 'lucide-react';

export default function SeniorView({
  senior = { name: 'Ramesh', age: 72 },
  caregiver = { name: 'Priya' },
  meds,
  adherence,
  consent,
  onToggleConsent,
  onUpdateStatus,
  onResetDay,
  onTriggerSos,
  onSpeak,
}) {
  return (
    <div className="space-y-6">
      <div className="aayu-card p-6 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Namaste, {senior.name} Ji 🙏</h2>
          <p className="text-slate-600">
            Today's Medication Adherence: <span className="font-bold text-teal-700">{adherence}%</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onResetDay}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-4 py-3.5 rounded-2xl flex items-center gap-2 text-sm transition"
          >
            <RotateCcw className="w-4 h-4" /> Reset Day
          </button>
          <button
            type="button"
            onClick={() => onTriggerSos(caregiver.name)}
            className="aayu-sos-btn hover:opacity-95 text-white font-bold px-6 py-3.5 rounded-2xl flex items-center gap-2 text-lg transition"
          >
            <PhoneCall className="w-6 h-6" /> Emergency SOS
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {meds.map((med) => (
          <div key={med.id} className="aayu-card p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="aayu-pill-badge text-sm font-bold px-3 py-1 rounded-full">{med.time}</span>
                <button
                  type="button"
                  onClick={() => onSpeak(`Time for ${med.name}, ${med.dosage}, ${med.instruction}`)}
                  className="p-2 bg-slate-100 hover:bg-teal-100 rounded-full text-teal-700 transition"
                  title="Listen reminder"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mt-2">{med.name}</h3>
              <p className="text-slate-600 font-medium">{med.dosage} • {med.instruction}</p>
            </div>

            <div className="mt-6">
              {med.status === 'pending' ? (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onUpdateStatus(med.id, 'taken')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-1 transition"
                  >
                    <Check className="w-5 h-5" /> Taken
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateStatus(med.id, 'skipped')}
                    className="bg-slate-200 hover:bg-red-100 hover:text-red-700 text-slate-700 font-bold py-3 rounded-xl flex items-center justify-center gap-1 transition"
                  >
                    <X className="w-5 h-5" /> Skip
                  </button>
                </div>
              ) : (
                <div
                  className={`text-center py-2.5 rounded-xl font-bold uppercase text-sm ${
                    med.status === 'taken' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {med.status === 'taken' ? '✓ Dose Taken' : '✕ Skipped'}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="aayu-card p-6 rounded-2xl">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="w-6 h-6 text-teal-700" />
          <h3 className="text-lg font-bold">My Privacy & Caregiver Consent (AayuPact Vault)</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { key: 'medLogs', label: 'Share Taken Pill Logs' },
            { key: 'missedAlerts', label: 'Send Missed-Dose Alerts' },
            { key: 'appointments', label: 'Share Doctor Notes' },
          ].map((item) => (
            <label
              key={item.key}
              className="flex items-center justify-between p-4 rounded-xl border border-slate-200 cursor-pointer hover:bg-teal-50/40 transition"
            >
              <span className="font-semibold text-sm">{item.label}</span>
              <input
                type="checkbox"
                checked={Boolean(consent[item.key])}
                onChange={() => onToggleConsent(item.key)}
                className="w-5 h-5 accent-teal-700"
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}


