import React, { useState, useEffect, useCallback } from 'react';
import Header from './Header';
import SeniorView from './SeniorView';
import CaregiverView from './CaregiverView';
import AuthPage from './AuthPage';
import './aayupact.css';

const API_URL =
  import.meta.env.VITE_API_URL || 'https://aayupact-js.onrender.com/api';

const SENIORS = [
  { id: 'ramesh', name: 'Ramesh', age: 72 },
  { id: 'sunita', name: 'Sunita', age: 68 },
  { id: 'harish', name: 'Harish', age: 75 },
];

const CAREGIVERS = [
  { id: 'priya', name: 'Priya' },
  { id: 'rohan', name: 'Rohan' },
  { id: 'ananya', name: 'Ananya' },
];

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('aayupact_token') || '');
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('aayupact_user') || 'null');
    } catch {
      return null;
    }
  });

  const [role, setRole] = useState(() => currentUser?.role || 'senior');
  const [selectedSeniorId, setSelectedSeniorId] = useState(SENIORS[0].id);
  const [selectedCaregiverId, setSelectedCaregiverId] = useState(CAREGIVERS[0].id);

  const [meds, setMeds] = useState([]);
  const [consent, setConsent] = useState({ medLogs: true, missedAlerts: true, appointments: false });
  const [alerts, setAlerts] = useState([]);
  const [sosActive, setSosActive] = useState(false);
  const [backendError, setBackendError] = useState('');

  const handleLogout = useCallback(() => {
    localStorage.removeItem('aayupact_token');
    localStorage.removeItem('aayupact_user');
    setToken('');
    setCurrentUser(null);
  }, []);

  const handleAuthSuccess = (newToken, user) => {
    localStorage.setItem('aayupact_token', newToken);
    localStorage.setItem('aayupact_user', JSON.stringify(user));
    setToken(newToken);
    setCurrentUser(user);
    if (user?.role === 'caregiver' || user?.role === 'senior') {
      setRole(user.role);
    }
  };

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    if (!token) return;

    fetch(`${API_URL}/data`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401) {
          handleLogout();
          throw new Error('Session expired');
        }
        if (!res.ok) throw new Error('Failed to load backend data');
        return res.json();
      })
      .then((data) => {
        setMeds(data.meds || []);
        setConsent(data.consent || { medLogs: true, missedAlerts: true, appointments: false });
        setAlerts(data.alerts || []);
        setBackendError('');
      })
      .catch((err) => {
        if (err.message !== 'Session expired') {
          setBackendError('Backend (http://localhost:5000) band hai. Dusre terminal mein "npm start" chalao.');
        }
      });
  }, [token, handleLogout]);

  if (!token) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  const currentSenior = SENIORS.find((s) => s.id === selectedSeniorId) || SENIORS[0];
  const currentCaregiver = CAREGIVERS.find((c) => c.id === selectedCaregiverId) || CAREGIVERS[0];

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
    }
  };

  const handleUpdateStatus = async (id, status) => {
    const res = await fetch(`${API_URL}/meds/${id}/status`, {
      method: 'PATCH',
      headers: authHeaders,
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
      headers: authHeaders,
      body: JSON.stringify({ name, time }),
    });
    if (res.ok) {
      const updated = await res.json();
      setMeds(updated);
    }
  };

  const handleDeleteMed = async (id) => {
    const res = await fetch(`${API_URL}/meds/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
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
      headers: authHeaders,
      body: JSON.stringify(updatedConsent),
    });
  };

  const handleResetDay = async () => {
    const res = await fetch(`${API_URL}/meds/reset`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
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
    <div className="app-shell">
      <div
        style={{
          backgroundColor: '#042f2e',
          color: '#ccfbf1',
          fontSize: '12px',
          padding: '6px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span>
          Signed in as <strong>{currentUser?.name || currentUser?.email}</strong> ({currentUser?.role || role})
        </span>
        <button
          type="button"
          onClick={handleLogout}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#99f6e4',
            textDecoration: 'underline',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          Logout
        </button>
      </div>

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

      <main className="main-container">
        {backendError && (
          <div className="notice-banner" style={{ marginBottom: '16px' }}>
            {backendError}
          </div>
        )}

        {sosActive && (
          <div
            style={{
              backgroundColor: '#dc2626',
              color: '#ffffff',
              padding: '14px 18px',
              borderRadius: '14px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontWeight: 700,
            }}
          >
            <span>🚨 EMERGENCY SOS SENT TO {currentCaregiver.name.toUpperCase()} &amp; DR. MEHTA!</span>
            <button
              type="button"
              onClick={() => setSosActive(false)}
              style={{
                backgroundColor: '#ffffff',
                color: '#b91c1c',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
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