const express = require('express');
const db = require('../config/database');
const { authenticate, optionalAuth } = require('../middleware/auth');
const { requireMinRole } = require('../middleware/rbac');
const { logAction } = require('../middleware/audit');
const { notifyRole } = require('../services/notificationService');
const router = express.Router();

// GET /api/alerts
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { severity, status, alert_type, active_only } = req.query;
    let query = db('alerts')
      .leftJoin('users', 'alerts.issued_by', 'users.id')
      .select('alerts.*', 'users.full_name as issued_by_name');

    if (severity) query = query.where('alerts.severity', severity);
    if (status) query = query.where('alerts.status', status);
    if (alert_type) query = query.where('alerts.alert_type', alert_type);

    if (active_only === 'true') {
      const now = new Date().toISOString();
      query = query.where('alerts.status', 'active')
        .andWhere(function() {
          this.whereNull('alerts.expiry_time').orWhere('alerts.expiry_time', '>', now);
        });
    }

    const alerts = await query.orderBy('alerts.created_at', 'desc');
    res.json({ success: true, data: alerts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /api/alerts/active
router.get('/active', optionalAuth, async (req, res) => {
  try {
    const now = new Date().toISOString();
    const alerts = await db('alerts')
      .leftJoin('users', 'alerts.issued_by', 'users.id')
      .where('alerts.status', 'active')
      .andWhere(function() {
        this.whereNull('alerts.expiry_time').orWhere('alerts.expiry_time', '>', now);
      })
      .select('alerts.*', 'users.full_name as issued_by_name')
      .orderBy('alerts.created_at', 'desc');

    res.json({ success: true, data: alerts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// POST /api/alerts
router.post('/', authenticate, requireMinRole('District Admin'), async (req, res) => {
  try {
    const { alert_type, severity, title, message, affected_area, latitude, longitude, radius_km, issuing_authority, start_time, expiry_time } = req.body;
    if (!alert_type || !severity || !title || !message) {
      return res.status(400).json({ success: false, error: 'alert_type, severity, title, and message are required' });
    }

    const now = new Date().toISOString();
    const [id] = await db('alerts').insert({
      alert_type, severity, title, message,
      affected_area: affected_area || 'Statewide',
      latitude: latitude || null,
      longitude: longitude || null,
      radius_km: radius_km ? parseFloat(radius_km) : null,
      issued_by: req.user.id,
      issuing_authority: issuing_authority || req.user.organization_name || 'Emergency Operations Centre',
      status: 'active',
      start_time: start_time || now,
      expiry_time: expiry_time || null,
      created_at: now
    });

    const alert = await db('alerts').where('id', id).first();
    const io = req.app.get('io');
    if (io) io.emit('alert:created', alert);

    // Broadcast notifications to response stakeholders
    await notifyRole('EOC Operator', {
      category: severity === 'critical' ? 'critical' : 'high',
      title: `🚨 Emergency Alert: ${title}`,
      message: `${message} (Area: ${affected_area || 'General'})`,
      related_type: 'alert',
      related_id: id
    });
    await notifyRole('Field Officer', {
      category: severity === 'critical' ? 'critical' : 'high',
      title: `🚨 Alert: ${title}`,
      message,
      related_type: 'alert',
      related_id: id
    });

    await logAction(req.user.id, 'alert_created', 'alert', id, `Issued alert: ${title}`, req.ip);

    res.status(201).json({ success: true, data: alert });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// PUT /api/alerts/:id/cancel
router.put('/:id/cancel', authenticate, requireMinRole('District Admin'), async (req, res) => {
  try {
    await db('alerts').where('id', req.params.id).update({
      status: 'cancelled'
    });

    const io = req.app.get('io');
    if (io) io.emit('alert:cancelled', { id: parseInt(req.params.id) });

    await logAction(req.user.id, 'alert_cancelled', 'alert', req.params.id, 'Cancelled alert', req.ip);
    res.json({ success: true, message: 'Alert cancelled' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
