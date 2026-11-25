import express from 'express';
import cors from 'cors';
import {
  getAllData,
  addMedicine,
  deleteMedicine,
  updateMedicineStatus,
  resetDayMeds,
  updateConsent
} from './controller.js';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get('/api/data', getAllData);
app.post('/api/meds', addMedicine);
app.delete('/api/meds/:id', deleteMedicine);
app.patch('/api/meds/:id/status', updateMedicineStatus);
app.post('/api/meds/reset', resetDayMeds);
app.put('/api/consent', updateConsent);

app.listen(PORT, () => {
  console.log(`Server is running: http://localhost:${PORT}`);
});