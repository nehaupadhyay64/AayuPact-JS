import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FILE_PATH = path.join(__dirname, 'db.json');

const defaultData = {
  users: [],
  meds: [
    { id: 1, name: 'Telma 40 (BP)', dosage: '1 Tablet', time: '08:00 AM', instruction: 'After Breakfast', status: 'taken' },
    { id: 2, name: 'Glycomet GP 1', dosage: '1 Tablet', time: '01:30 PM', instruction: 'Before Lunch', status: 'pending' },
    { id: 3, name: 'Ecosprin 75mg', dosage: '1 Tablet', time: '09:00 PM', instruction: 'After Dinner', status: 'pending' }
  ],
  consent: {
    medLogs: true,
    missedAlerts: true,
    appointments: false
  },
  alerts: [
    { id: 101, type: 'taken', text: '08:05 AM — Ramesh ji took Telma 40 (Verified)' }
  ]
};

export function getData() {
  if (!fs.existsSync(FILE_PATH)) {
    saveData(defaultData);
    return structuredClone(defaultData);
  }
  const text = fs.readFileSync(FILE_PATH, 'utf-8');
  const parsed = JSON.parse(text || '{}');

  return {
    ...defaultData,
    ...parsed,
    users: Array.isArray(parsed.users) ? parsed.users : [],
    meds: Array.isArray(parsed.meds) ? parsed.meds : defaultData.meds,
    consent: { ...defaultData.consent, ...(parsed.consent || {}) },
    alerts: Array.isArray(parsed.alerts) ? parsed.alerts : defaultData.alerts
  };
}

export function saveData(data) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
}