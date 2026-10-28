const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { authenticate, JWT_SECRET } = require('../middleware/auth');
const { logAction } = require('../middleware/audit');
const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, error: 'Email and password required' });

    const user = await db('users')
      .join('roles', 'users.role_id', 'roles.id')
      .leftJoin('organizations', 'users.organization_id', 'organizations.id')
      .where('users.email', email)
      .select('users.*', 'roles.name as role', 'organizations.name as organization_name')
      .first();

    if (!user) return res.status(401).json({ success: false, error: 'Invalid credentials' });
    if (!user.is_active) return res.status(401).json({ success: false, error: 'Account is inactive' });

    const valid = bcrypt.compareSync(password, user.password_hash);
    if (!valid) return res.status(401).json({ success: false, error: 'Invalid credentials' });

    await db('users').where('id', user.id).update({ last_login: new Date().toISOString() });
    await logAction(user.id, 'login', 'user', user.id, 'Login successful', req.ip);

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    delete user.password_hash;
    res.json({ success: true, data: { token, user } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, full_name, phone, district, state } = req.body;
    if (!email || !password || !full_name) return res.status(400).json({ success: false, error: 'Email, password, and full name required' });

    const exists = await db('users').where('email', email).first();
    if (exists) return res.status(400).json({ success: false, error: 'Email already registered' });

    const publicRole = await db('roles').where('name', 'Public User').first();
    const password_hash = bcrypt.hashSync(password, 10);

    const [id] = await db('users').insert({
      email, password_hash, full_name, phone: phone || null,
      role_id: publicRole.id, district: district || null, state: state || null,
      is_active: true, created_at: new Date().toISOString(),
    });

    const user = await db('users').join('roles', 'users.role_id', 'roles.id')
      .where('users.id', id).select('users.*', 'roles.name as role').first();
    delete user.password_hash;

    const token = jwt.sign({ userId: id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    res.status(201).json({ success: true, data: { token, user } });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /api/auth/me
router.get('/me', authenticate, (req, res) => {
  res.json({ success: true, data: req.user });
});

module.exports = router;
