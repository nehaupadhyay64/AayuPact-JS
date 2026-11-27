import React from 'react';
import {
  Volume2,
  Check,
  X,
  RotateCcw,
  PhoneCall,
  CalendarClock,
} from 'lucide-react';

function HeartCareBadge() {
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="ap-hero-emblem"
      aria-hidden="true"
    >
      <path
        d="M12 37C12 34.5 14.5 33 17.5 33H29C31.5 33 33.5 34.5 33.5 36.8C33.5 39 31.5 40.5 29 40.5H23"
        stroke="#0f172a"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M12 37L17.5 43.5H31.5L39.5 37.5C41.2 36.2 43.5 36.8 44.2 38.7C44.8 40.3 44 42.1 42.4 43L32.5 48.5H16.5L10 42"
        stroke="#0f172a"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M28 28.5C28 28.5 18 22.3 18 15.6C18 12.4 20.5 10 23.5 10C25.5 10 27.1 11.1 28 12.7C28.9 11.1 30.5 10 32.5 10C35.5 10 38 12.4 38 15.6C38 22.3 28 28.5 28 28.5Z"
        fill="#fda4af"
        stroke="#0f172a"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <circle cx="42" cy="15" r="6.5" fill="#d1fae5" stroke="#0f172a" strokeWidth="2" />
      <path
        d="M39.5 15.2L41.2 17L44.8 13.2"
        stroke="#059669"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function SeniorView({
  senior,
  caregiver,
  meds = [],
  adherence = 85,
  consent = { medLogs: false, missedAlerts: true, appointments: true },
  onToggleConsent,
  onUpdateStatus,
  onResetDay,
  onTriggerSos,
  onSpeak,
}) {
  return (
    <div className="ap-senior-wrap">
      {/* Top Greeting & Adherence Wave Banner */}
      <section className="ap-banner-card">
        <div className="ap-banner-left">
          <HeartCareBadge />
          <div className="ap-banner-info">
            <h2 className="ap-greeting">Namaste, {senior?.name || 'Ramesh'} Ji 🙏</h2>
            <p className="ap-adherence-label">
              Today&apos;s Medication Adherence: <strong>{adherence}%</strong>
            </p>
            <div className="ap-progress-row">
              <div className="ap-progress-track">
                <div
                  className="ap-progress-bar"
                  style={{ width: `${Math.min(100, Math.max(0, adherence))}%` }}
                />
              </div>
              <span className="ap-progress-pct">{adherence}%</span>
            </div>
          </div>
        </div>

        <div className="ap-banner-actions">
          <button type="button" onClick={onResetDay} className="ap-btn-reset">
            <RotateCcw size={16} />
            <span>Reset Day</span>
          </button>

          <button
            type="button"
            onClick={() => onTriggerSos && onTriggerSos(caregiver?.name)}
            className="ap-btn-sos"
          >
            <PhoneCall size={16} />
            <span>Emergency SOS</span>
          </button>
        </div>
      </section>

      {/* Medicine Grid + Next Appointment Card */}
      <section className="ap-cards-grid">
        {meds.map((med) => {
          const isTaken = med.status === 'taken';
          const isSkipped = med.status === 'skipped';

          return (
            <article
              key={med.id}
              className={`ap-med-card ${isTaken ? 'is-taken' : ''} ${
                isSkipped ? 'is-skipped' : ''
              }`}
            >
              <div className="ap-med-top">
                <span className="ap-time-badge">{med.time}</span>
                <button
                  type="button"
                  onClick={() =>
                    onSpeak &&
                    onSpeak(
                      `${med.name}, ${med.dosage || '1 Tablet'}, at ${med.time}, ${
                        med.instruction || ''
                      }`
                    )
                  }
                  className="ap-speak-btn"
                  title="Listen reminder"
                  aria-label={`Listen reminder for ${med.name}`}
                >
                  <Volume2 size={17} />
                </button>
              </div>

              <div className="ap-med-content">
                <h3 className="ap-med-title">{med.name}</h3>
                <p className="ap-med-sub">
                  {med.dosage || '1 Tablet'}
                  {med.instruction ? ` • ${med.instruction}` : ''}
                </p>
              </div>

              <div className="ap-med-actions">
                <button
                  type="button"
                  onClick={() => onUpdateStatus && onUpdateStatus(med.id, 'taken')}
                  className={`ap-btn-taken ${isTaken ? 'selected' : ''}`}
                >
                  <Check size={16} />
                  <span>Taken</span>
                </button>

                <button
                  type="button"
                  onClick={() => onUpdateStatus && onUpdateStatus(med.id, 'skipped')}
                  className={`ap-btn-skip ${isSkipped ? 'selected' : ''}`}
                >
                  <X size={16} />
                  <span>Skip</span>
                </button>
              </div>
            </article>
          );
        })}

        {/* Next Appointment Card */}
        <article className="ap-appointment-card">
          <div className="ap-appt-icon-box">
            <CalendarClock size={34} strokeWidth={1.8} />
          </div>
          <p className="ap-appt-title">Next Appointment: Dr. Mehta,</p>
          <p className="ap-appt-sub">Dec 10, 10:00 AM</p>
        </article>
      </section>

      {/* Consent Vault */}
      <section className="ap-vault-card">
        <h3 className="ap-vault-heading">Consent Vault</h3>

        <div className="ap-vault-row">
          <label className="ap-toggle-item">
            <span>Share Taken Pill Logs</span>
            <span className="ap-switch">
              <input
                type="checkbox"
                checked={Boolean(consent.medLogs)}
                onChange={() => onToggleConsent && onToggleConsent('medLogs')}
              />
              <span className="ap-slider" />
            </span>
          </label>

          <label className="ap-toggle-item">
            <span>Send Missed-Dose Alerts</span>
            <span className="ap-switch">
              <input
                type="checkbox"
                checked={Boolean(consent.missedAlerts)}
                onChange={() => onToggleConsent && onToggleConsent('missedAlerts')}
              />
              <span className="ap-slider" />
            </span>
          </label>

          <label className="ap-toggle-item">
            <span>Share Doctor Notes</span>
            <span className="ap-switch">
              <input
                type="checkbox"
                checked={Boolean(consent.appointments)}
                onChange={() => onToggleConsent && onToggleConsent('appointments')}
              />
              <span className="ap-slider" />
            </span>
          </label>
        </div>
      </section>
    </div>
  );
}