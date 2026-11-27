import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { registerUser, loginUser } from './authController.js';
import { requireAuth } from './auth.js';
import {
  getAllData,
  addMedicine,
  deleteMedicine,
  updateMedicineStatus,
  resetDayMeds,
  updateConsent,
} from './controller.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Auth routes (Register & Login with bcrypt + JWT)
app.post('/api/auth/register', registerUser);
app.post('/api/auth/login', loginUser);

// Protected dashboard routes
app.get('/api/data', requireAuth, getAllData);
app.post('/api/meds', requireAuth, addMedicine);
app.delete('/api/meds/:id', requireAuth, deleteMedicine);
app.patch('/api/meds/:id/status', requireAuth, updateMedicineStatus);
app.post('/api/meds/reset', requireAuth, resetDayMeds);
app.put('/api/consent', requireAuth, updateConsent);

app.listen(PORT, () => {
  console.log(`Server is running: http://localhost:${PORT}`);
});