const express = require('express');
const db = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { requireMinRole } = require('../middleware/rbac');
const { notifyRole } = require('../services/notificationService');
const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const { report_type, severity, verification_status, incident_id, district, page = 1, limit = 50 } = req.query;
    let query = db('field_reports').leftJoin('users', 'field_reports.submitted_by', 'users.id')
      .leftJoin('incidents', 'field_reports.incident_id', 'incidents.id')
      .select('field_reports.*', 'users.full_name as submitted_by_name', 'incidents.incident_id as linked_incident_id', 'incidents.title as incident_title');
    if (report_type) query = query.where('field_reports.report_type', report_type);
    if (severity) query = query.where('field_reports.severity', severity);
    if (verification_status) query = query.where('field_reports.verification_status', verification_status);
    if (incident_id) query = query.where('field_reports.incident_id', incident_id);
    if (district) query = query.where('field_reports.district', 'like', `%${district}%`);
    const total = (await query.clone().count('field_reports.id as count').first()).count;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const data = await query.orderBy('field_reports.created_at', 'desc').limit(parseInt(limit)).offset(offset);
    res.json({ success: true, data, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) } });
  } catch (err) { console.error(err); res.status(500).json({ success: false, error: 'Server error' }); }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { incident_id, report_type, category, severity, description, latitude, longitude, location_name, district, state, photos } = req.body;
    if (!report_type || !description) return res.status(400).json({ success: false, error: 'report_type and description required' });
    const count = (await db('field_reports').count('id as c').first()).c;
    const report_id = `FR-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;
    const now = new Date().toISOString();
    const [id] = await db('field_reports').insert({
      report_id, incident_id: incident_id || null, submitted_by: req.user.id, report_type,
      category: category || null, severity: severity || 'moderate', description,
      latitude: latitude || null, longitude: longitude || null, location_name: location_name || '',
      district: district || '', state: state || '', photos: photos || null,
      verification_status: req.user.role === 'Public User' ? 'submitted' : 'under_verification',
      created_at: now,
    });
    const io = req.app.get('io');
    const created = await db('field_reports').where('id', id).first();
    if (io) io.emit('field_report:created', created);
    if (severity === 'critical' || severity === 'high') {
      await notifyRole('EOC Operator', { category: 'high', title: `Field Report: ${report_type}`, message: `${severity} ${report_type} report at ${location_name || 'Unknown'}. ${description.substring(0, 100)}...`, related_type: 'field_report', related_id: id });
    }
    res.status(201).json({ success: true, data: created });
  } catch (err) { console.error(err); res.status(500).json({ success: false, error: 'Server error' }); }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const report = await db('field_reports').leftJoin('users', 'field_reports.submitted_by', 'users.id')
      .where('field_reports.id', req.params.id).select('field_reports.*', 'users.full_name as submitted_by_name').first();
    if (!report) return res.status(404).json({ success: false, error: 'Report not found' });
    res.json({ success: true, data: report });
  } catch (err) { console.error(err); res.status(500).json({ success: false, error: 'Server error' }); }
});

router.put('/:id/verify', authenticate, requireMinRole('EOC Operator'), async (req, res) => {
  try {
    const { verification_status, incident_id } = req.body;
    const updates = { verification_status, verified_by: req.user.id };
    if (incident_id) updates.incident_id = incident_id;
    await db('field_reports').where('id', req.params.id).update(updates);
    res.json({ success: true, data: { verification_status } });
  } catch (err) { console.error(err); res.status(500).json({ success: false, error: 'Server error' }); }
});

module.exports = router;
