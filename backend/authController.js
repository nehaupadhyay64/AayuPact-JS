import crypto from 'node:crypto';
import { getData, saveData } from './store.js';
import { hashPassword, verifyPassword, signToken } from './auth.js';

function normalizeEmail(email = '') {
  return String(email).trim().toLowerCase();
}

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export async function registerUser(req, res) {
  const { name, email, password, role } = req.body || {};
  const cleanEmail = normalizeEmail(email);

  if (!name?.trim() || !cleanEmail || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  if (!cleanEmail.includes('@')) {
    return res.status(400).json({ message: 'Please enter a valid email address.' });
  }

  const safeRole = role === 'caregiver' ? 'caregiver' : 'senior';
  const data = getData();
  const users = Array.isArray(data.users) ? data.users : [];

  const exists = users.some((u) => normalizeEmail(u.email) === cleanEmail);
  if (exists) {
    return res.status(409).json({ message: 'This email is already registered. Please login.' });
  }

  const passwordHash = await hashPassword(password);
  const newUser = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: cleanEmail,
    passwordHash,
    role: safeRole,
  };

  data.users = [...users, newUser];
  saveData(data);

  const token = signToken({ userId: newUser.id, role: newUser.role });
  return res.status(201).json({
    token,
    user: sanitizeUser(newUser),
  });
}

export async function loginUser(req, res) {
  const { email, password } = req.body || {};
  const cleanEmail = normalizeEmail(email);

  if (!cleanEmail || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const data = getData();
  const users = Array.isArray(data.users) ? data.users : [];

  const user = users.find((u) => normalizeEmail(u.email) === cleanEmail);
  if (!user) {
    return res.status(401).json({ message: 'Email not found. Please register first.' });
  }

  const isMatch = await verifyPassword(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ message: 'Incorrect password.' });
  }

  const token = signToken({ userId: user.id, role: user.role });
  return res.json({
    token,
    user: sanitizeUser(user),
  });
}