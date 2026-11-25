import React, { useState, useEffect } from 'react';
import './aayupact.css';
import Header from './Header';
import SeniorView from './SeniorView';
import CaregiverView from './CaregiverView';

const API_URL = 'http://localhost:5000/api';

const SENIORS = [
  { id: 'ramesh', name: 'Ramesh', age: 72 },
  { id: 'sunita', name: 'Sunita', age: 68 },
  { id: 'harish', name: 'Harish', age: 75 },
  { id: 'kavita', name: 'Kavita', age: 70 },
];

const CAREGIVERS = [
  { id: 'priya', name: 'Priya' },
  { id: 'rohan', name: 'Rohan' },
  { id: 'ananya', name: 'Ananya' },
  { id: 'vikram', name: 'Vikram' },
];

export default function App() {
  const [role, setRole] = useState('senior');
  const [selectedSeniorId, setSelectedSeniorId] = useState(SENIORS[0].id);
  const [selectedCaregiverId, setSelectedCaregiverId] = useState(CAREGIVERS[0].id);

  const [meds, setMeds] = useState([]);
  const [consent, setConsent] = useState({ medLogs: true, missedAlerts: true, appointments: false });
  const [alerts, setAlerts] = useState([]);
  const [sosActive, setSosActive] = useState(false);
  const [backendError, setBackendError] = useState('');

  const currentSenior = SENIORS.find((s) => s.id === selectedSeniorId) || SENIORS[0];
  const currentCaregiver = CAREGIVERS.find((c) => c.id === selectedCaregiverId) || CAREGIVERS[0];

  useEffect(() => {
    fetch(`${API_URL}/data`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load backend data');
        return res.json();
      })
      .then((data) => {
        setMeds(data.meds || []);
        setConsent(data.consent || { medLogs: true, missedAlerts: true, appointments: false });
        setAlerts(data.alerts || []);
        setBackendError('');
      })
      .catch(() => {
        setBackendError('Backend (http://localhost:5000) band hai. Dusre terminal mein "npm start" ya "node server.js" chalao.');
      });
  }, []);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
    }
  };

  const handleUpdateStatus = async (id, status) => {
    const res = await fetch(`${API_URL}/meds/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const data = await res.json();
      setMeds(data.meds);
      setAlerts(data.alerts);
    }
  };

  const handleAddMed = async ({ name, time }) => {
    const res = await fetch(`${API_URL}/meds`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, time }),
    });
    if (res.ok) {
      const updated = await res.json();
      setMeds(updated);
    }
  };

  const handleDeleteMed = async (id) => {
    const res = await fetch(`${API_URL}/meds/${id}`, { method: 'DELETE' });
    if (res.ok) {
      const updated = await res.json();
      setMeds(updated);
    }
  };

  const handleToggleConsent = async (key) => {
    const updatedConsent = { ...consent, [key]: !consent[key] };
    setConsent(updatedConsent);
    await fetch(`${API_URL}/consent`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedConsent),
    });
  };

  const handleResetDay = async () => {
    const res = await fetch(`${API_URL}/meds/reset`, { method: 'POST' });
    if (res.ok) {
      const updated = await res.json();
      setMeds(updated);
    }
  };

  const handleTriggerSos = (caregiverName = currentCaregiver.name) => {
    setSosActive(true);
    speak(`Emergency SOS alert sent to ${caregiverName}.`);
  };

  const takenCount = meds.filter((m) => m.status === 'taken').length;
  const adherence = meds.length ? Math.round((takenCount / meds.length) * 100) : 0;

  return (
    <div className="aayu-shell text-slate-900 font-sans">
      <Header
        role={role}
        setRole={setRole}
        seniors={SENIORS}
        caregivers={CAREGIVERS}
        selectedSeniorId={selectedSeniorId}
        setSelectedSeniorId={setSelectedSeniorId}
        selectedCaregiverId={selectedCaregiverId}
        setSelectedCaregiverId={setSelectedCaregiverId}
      />

      <main className="max-w-5xl mx-auto p-6 space-y-6">
        {backendError && (
          <div className="bg-amber-100 border border-amber-300 text-amber-900 px-4 py-3 rounded-xl text-sm font-medium">
            {backendError}
          </div>
        )}

        {sosActive && (
          <div className="bg-red-600 text-white p-4 rounded-2xl flex items-center justify-between animate-pulse">
            <span className="font-bold text-lg">
              🚨 EMERGENCY SOS SENT TO {currentCaregiver.name.toUpperCase()} & DR. MEHTA!
            </span>
            <button
              type="button"
              onClick={() => setSosActive(false)}
              className="bg-white text-red-700 px-3 py-1 rounded-lg font-bold text-sm"
            >
              Cancel
            </button>
          </div>
        )}

        {role === 'senior' ? (
          <SeniorView
            senior={currentSenior}
            caregiver={currentCaregiver}
            meds={meds}
            adherence={adherence}
            consent={consent}
            onToggleConsent={handleToggleConsent}
            onUpdateStatus={handleUpdateStatus}
            onResetDay={handleResetDay}
            onTriggerSos={handleTriggerSos}
            onSpeak={speak}
          />
        ) : (
          <CaregiverView
            meds={meds}
            adherence={adherence}
            consent={consent}
            alerts={alerts}
            onAddMed={handleAddMed}
            onDeleteMed={handleDeleteMed}
          />
        )}
      </main>
    </div>
  );
}