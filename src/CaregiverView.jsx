import React, { useState } from 'react';
import {
  Pill,
  Plus,
  Trash2,
  Bell,
  Sparkles,
  Send,
  ShieldCheck,
} from 'lucide-react';

const CO_PILOT_ANSWERS = {
  'Telma 40 Timing?':
    'Telma 40 (Telmisartan) usually subah ek hi fix time par li jaati hai—khane ke saath ya bina khane ke, jaisa doctor ne advise kiya ho. Sudden skip ya double dose na lein.',
  'Glycomet Meal Rule?':
    'Glycomet (Metformin) aksar meal ke saath ya meal ke turant baad lene ki salah di jaati hai taaki stomach upset ya acidity kam rahe. Doctor ki prescription follow karein.',
};

export default function CaregiverView({
  meds = [],
  adherence = 0,
  consent = { medLogs: true, missedAlerts: true, appointments: false },
  alerts = [],
  onAddMed,
  onDeleteMed,
}) {
  const [medName, setMedName] = useState('');
  const [medTime, setMedTime] = useState('06:00 PM');
  const [promptInput, setPromptInput] = useState('');
  const [coPilotReply, setCoPilotReply] = useState('');

  const handleCreateMed = (e) => {
    e.preventDefault();
    if (!medName.trim()) return;
    onAddMed && onAddMed({ name: medName.trim(), time: medTime.trim() || '06:00 PM' });
    setMedName('');
  };

  const handleAskCoPilot = (questionText) => {
    const q = (questionText ?? promptInput).trim();
    if (!q) return;

    if (CO_PILOT_ANSWERS[q]) {
      setCoPilotReply(CO_PILOT_ANSWERS[q]);
    } else if (q.toLowerCase().includes('telma')) {
      setCoPilotReply(CO_PILOT_ANSWERS['Telma 40 Timing?']);
    } else if (q.toLowerCase().includes('glycomet')) {
      setCoPilotReply(CO_PILOT_ANSWERS['Glycomet Meal Rule?']);
    } else {
      setCoPilotReply(
        `"${q}" ke liye senior ki current prescription aur doctor ki timing instructions check karein; koi side effect ya missed dose pattern ho toh doctor se confirm karein.`
      );
    }
    setPromptInput('');
  };

  return (
    <div className="ap-cg-wrap">
      {/* Top Caregiver Summary Strip */}
      <section className="ap-cg-summary">
        <div className="ap-cg-summary-left">
          <div className="ap-cg-avatar-box">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h2 className="ap-cg-heading">Caregiver Command Center</h2>
            <p className="ap-cg-sub">
              Manage daily medication schedules, review consent-gated alerts, and check quick guidance.
            </p>
          </div>
        </div>

        <div className="ap-cg-metrics">
          <div className="ap-metric-chip">
            <span className="ap-metric-label">Adherence</span>
            <strong className="ap-metric-value">{adherence}%</strong>
          </div>
          <div className="ap-metric-chip">
            <span className="ap-metric-label">Active Meds</span>
            <strong className="ap-metric-value">{meds.length}</strong>
          </div>
          <div className="ap-metric-chip">
            <span className="ap-metric-label">Logs Consent</span>
            <strong className="ap-metric-value">{consent?.medLogs ? 'Allowed' : 'Restricted'}</strong>
          </div>
        </div>
      </section>

      {/* Main Two-Column Workspace */}
      <div className="ap-cg-grid">
        {/* Left: Medication Plan */}
        <section className="ap-cg-card">
          <div className="ap-cg-card-header">
            <div className="ap-cg-title-group">
              <Pill size={18} className="ap-cg-teal-icon" />
              <h3 className="ap-cg-card-title">Medication Plan</h3>
            </div>
            <span className="ap-adherence-pill">{adherence}% Adherence</span>
          </div>

          <form onSubmit={handleCreateMed} className="ap-cg-form">
            <input
              type="text"
              value={medName}
              onChange={(e) => setMedName(e.target.value)}
              placeholder="Medicine name (e.g. Dolo 650)"
              className="ap-cg-input"
            />
            <input
              type="text"
              value={medTime}
              onChange={(e) => setMedTime(e.target.value)}
              placeholder="06:00 PM"
              className="ap-cg-input ap-cg-time-input"
            />
            <button type="submit" className="ap-cg-add-btn">
              <Plus size={16} />
              <span>Add</span>
            </button>
          </form>

          <div className="ap-med-list">
            {meds.length === 0 ? (
              <p className="ap-empty-note">No medicines scheduled yet. Add one above.</p>
            ) : (
              meds.map((med) => {
                const st = (med.status || 'pending').toLowerCase();
                return (
                  <div key={med.id} className="ap-med-row-item">
                    <div className="ap-med-row-info">
                      <span className="ap-med-row-name">{med.name}</span>
                      <span className="ap-med-row-time">({med.time})</span>
                    </div>

                    <div className="ap-med-row-right">
                      <span className={`ap-status-badge is-${st}`}>{st.toUpperCase()}</span>
                      <button
                        type="button"
                        onClick={() => onDeleteMed && onDeleteMed(med.id)}
                        className="ap-delete-btn"
                        title={`Delete ${med.name}`}
                        aria-label={`Delete ${med.name}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Right: Consent-Gated Live Alerts + AI Care Co-Pilot */}
        <div className="ap-cg-right-col">
          <section className="ap-cg-card">
            <div className="ap-cg-card-header">
              <div className="ap-cg-title-group">
                <Bell size={18} className="ap-cg-teal-icon" />
                <h3 className="ap-cg-card-title">Consent-Gated Live Alerts</h3>
              </div>
            </div>

            {!consent?.medLogs && !consent?.missedAlerts ? (
              <div className="ap-alert-box is-locked">
                Senior ne abhi pill logs aur missed-dose alerts share karne ki permission off rakhi hai.
              </div>
            ) : alerts.length === 0 ? (
              <div className="ap-alert-box">No new alerts right now.</div>
            ) : (
              <div className="ap-alert-stack">
                {alerts.map((alert) => (
                  <div key={alert.id} className="ap-alert-box">
                    {alert.text}
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="ap-cg-card">
            <div className="ap-cg-card-header">
              <div className="ap-cg-title-group">
                <Sparkles size={18} className="ap-cg-teal-icon" />
                <h3 className="ap-cg-card-title">AI Care Co-Pilot</h3>
              </div>
            </div>

            <div className="ap-chip-row">
              <button
                type="button"
                onClick={() => handleAskCoPilot('Telma 40 Timing?')}
                className="ap-prompt-chip"
              >
                Telma 40 Timing?
              </button>
              <button
                type="button"
                onClick={() => handleAskCoPilot('Glycomet Meal Rule?')}
                className="ap-prompt-chip"
              >
                Glycomet Meal Rule?
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAskCoPilot();
              }}
              className="ap-copilot-form"
            >
              <input
                type="text"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="Ask me anything about pill timings or food interactions!"
                className="ap-cg-input"
              />
              <button
                type="submit"
                className="ap-copilot-send"
                title="Ask Co-Pilot"
                aria-label="Ask Co-Pilot"
              >
                <Send size={15} />
              </button>
            </form>

            {coPilotReply && <div className="ap-copilot-answer">{coPilotReply}</div>}
          </section>
        </div>
      </div>
    </div>
  );
}