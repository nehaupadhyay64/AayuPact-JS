export function createMedicine({ name, time, dosage = '1 Tablet', instruction = 'After Meal' }) {
  return {
    id: Date.now(),
    name: name.trim(),
    dosage,
    time: time || '06:00 PM',
    instruction,
    status: 'pending'
  };
}

export function createAlert(type, text) {
  return {
    id: Date.now(),
    type,
    text
  };
}

export function isValidStatus(status) {
  return ['pending', 'taken', 'skipped'].includes(status);
}