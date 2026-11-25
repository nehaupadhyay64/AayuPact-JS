import fs from 'node:fs';

const FILE_PATH = './db.json';

const defaultData = {
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
    return defaultData;
  }
  const text = fs.readFileSync(FILE_PATH, 'utf-8');
  return JSON.parse(text);
}

export function saveData(data) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
}