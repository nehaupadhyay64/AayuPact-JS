import { getData, saveData } from './store.js';
import { createMedicine, createAlert, isValidStatus } from './model.js';

export function getAllData(req, res) {
  res.json(getData());
}

export function addMedicine(req, res) {
  const { name, time, dosage, instruction } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Medicine name required hai' });
  }

  const data = getData();
  const newMed = createMedicine({ name, time, dosage, instruction });
  data.meds.push(newMed);

  saveData(data);
  res.json(data.meds);
}

export function deleteMedicine(req, res) {
  const medId = Number(req.params.id);
  const data = getData();
  data.meds = data.meds.filter((med) => med.id !== medId);

  saveData(data);
  res.json(data.meds);
}

export function updateMedicineStatus(req, res) {
  const medId = Number(req.params.id);
  const { status } = req.body;

  if (!isValidStatus(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const data = getData();
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  data.meds = data.meds.map((med) => {
    if (med.id === medId) {
      if (status === 'taken' || status === 'skipped') {
        const msg =
          status === 'skipped'
            ? `🚨 ALERT: ${now} — ${med.name} SKIPPED`
            : `${now} — ${med.name} TAKEN`;

        data.alerts.unshift(createAlert(status, msg));
      }
      return { ...med, status };
    }
    return med;
  });

  saveData(data);
  res.json({ meds: data.meds, alerts: data.alerts });
}

export function resetDayMeds(req, res) {
  const data = getData();
  data.meds = data.meds.map((med) => ({ ...med, status: 'pending' }));

  saveData(data);
  res.json(data.meds);
}

export function updateConsent(req, res) {
  const data = getData();
  data.consent = req.body;

  saveData(data);
  res.json(data.consent);
}