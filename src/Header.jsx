import React from 'react';
import { HeartPulse, UserCheck, Users } from 'lucide-react';

export default function Header({
  role,
  setRole,
  seniors = [],
  caregivers = [],
  selectedSeniorId,
  setSelectedSeniorId,
  selectedCaregiverId,
  setSelectedCaregiverId,
}) {
  const activeSenior =
    seniors.find((s) => s.id === selectedSeniorId) || seniors[0] || { name: 'Ramesh', age: 72 };
  const activeCaregiver =
    caregivers.find((c) => c.id === selectedCaregiverId) || caregivers[0] || { name: 'Priya' };

  return (
    <header className="bg-teal-800 text-white px-6 py-4 shadow-md">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <HeartPulse className="w-8 h-8 text-emerald-300 shrink-0" />
          <div>
            <h1 className="text-xl font-bold tracking-tight">AayuPact</h1>
            <p className="text-xs text-teal-200">Consent-First Smart Pill &amp; Senior Care</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {seniors.length > 0 && (
            <select
              value={selectedSeniorId}
              onChange={(e) => setSelectedSeniorId(e.target.value)}
              className="bg-teal-900 text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-teal-600 focus:outline-none"
              title="Choose Senior Profile"
            >
              {seniors.map((s) => (
                <option key={s.id} value={s.id}>
                  Senior: {s.name}, {s.age}
                </option>
              ))}
            </select>
          )}

          {caregivers.length > 0 && (
            <select
              value={selectedCaregiverId}
              onChange={(e) => setSelectedCaregiverId(e.target.value)}
              className="bg-teal-900 text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-teal-600 focus:outline-none"
              title="Choose Caregiver Profile"
            >
              {caregivers.map((c) => (
                <option key={c.id} value={c.id}>
                  Caregiver: {c.name}
                </option>
              ))}
            </select>
          )}

          <div className="flex items-center gap-1.5 bg-teal-900/90 p-1.5 rounded-xl border border-teal-600">
            <button
              type="button"
              onClick={() => setRole('senior')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
                role === 'senior' ? 'bg-white text-teal-900 shadow' : 'text-teal-100 hover:text-white'
              }`}
            >
              <UserCheck className="w-4 h-4 shrink-0" />
              <span>Senior View ({activeSenior.name}, {activeSenior.age})</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('caregiver')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
                role === 'caregiver' ? 'bg-white text-teal-900 shadow' : 'text-teal-100 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span>Caregiver ({activeCaregiver.name})</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

