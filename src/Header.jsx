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
    <header className="ap-header">
      <div className="ap-header-inner">
        <div className="ap-brand">
          <span className="ap-brand-icon">
            <HeartPulse size={22} strokeWidth={2.2} />
          </span>
          <div>
            <h1 className="ap-brand-title">AayuPact</h1>
            <p className="ap-brand-sub">Consent-First Smart Pill &amp; Senior Care</p>
          </div>
        </div>

        <div className="ap-header-controls">
          {seniors.length > 0 && (
            <select
              value={selectedSeniorId}
              onChange={(e) => setSelectedSeniorId(e.target.value)}
              className="ap-select"
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
              className="ap-select"
              title="Choose Caregiver Profile"
            >
              {caregivers.map((c) => (
                <option key={c.id} value={c.id}>
                  Caregiver: {c.name}
                </option>
              ))}
            </select>
          )}

          <div className="ap-role-switch">
            <button
              type="button"
              onClick={() => setRole('senior')}
              className={`ap-role-btn ${role === 'senior' ? 'is-active' : ''}`}
            >
              <UserCheck size={16} />
              <span>
                Senior View ({activeSenior.name}, {activeSenior.age})
              </span>
            </button>

            <button
              type="button"
              onClick={() => setRole('caregiver')}
              className={`ap-role-btn ${role === 'caregiver' ? 'is-active' : ''}`}
            >
              <Users size={16} />
              <span>Caregiver ({activeCaregiver.name})</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}