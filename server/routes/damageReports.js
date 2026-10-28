const express = require('express');
const db = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { requireMinRole } = require('../middleware/rbac');
const { logAction } = require('../middleware/audit');
const router = express.Router();

// GET /api/damage-reports
router.get('/', authenticate, async (req, res) => {
  try {
    const { incident_id, infrastructure_type, status, district } = req.query;
    let query = db('damage_reports')
      .leftJoin('incidents', 'damage_reports.incident_id', 'incidents.id')
      .leftJoin('users', 'damage_reports.reported_by', 'users.id')
      .select(
        'damage_reports.*',
        'incidents.incident_id as incident_code',
        'incidents.title as incident_title',
        'users.full_name as reported_by_name'
      );

    if (incident_id) query = query.where('damage_reports.incident_id', incident_id);
    if (infrastructure_type) query = query.where('damage_reports.infrastructure_type', infrastructure_type);
    if (status) query = query.where('damage_reports.status', status);
    if (district) query = query.where('damage_reports.district', 'like', `%${district}%`);

    const reports = await query.orderBy('damage_reports.created_at', 'desc');
    res.json({ success: true, data: reports });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// POST /api/damage-reports
router.post('/', authenticate, async (req, res) => {
  try {
    const { incident_id, infrastructure_type, damage_level, description, latitude, longitude, location_name, district, affected_families, estimated_loss, photos } = req.body;
    if (!incident_id || !infrastructure_type || !damage_level) {
      return res.status(400).json({ success: false, error: 'incident_id, infrastructure_type, and damage_level required' });
    }

    const now = new Date().toISOString();
    const [id] = await db('damage_reports').insert({
      incident_id: parseInt(incident_id),
      reported_by: req.user.id,
      infrastructure_type,
      damage_level,
      description: description || '',
      latitude: latitude || null,
      longitude: longitude || null,
      location_name: location_name || '',
      district: district || '',
      affected_families: parseInt(affected_families) || 0,
      estimated_loss: parseFloat(estimated_loss) || 0,
      status: 'reported',
      photos: photos || null,
      created_at: now,
      updated_at: now
    });

    const report = await db('damage_reports').where('id', id).first();
    const io = req.app.get('io');
    if (io) io.emit('damage_report:created', report);

    await logAction(req.user.id, 'damage_report_created', 'damage_report', id, `Submitted damage report for incident ${incident_id}`, req.ip);

    res.status(201).json({ success: true, data: report });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// PUT /api/damage-reports/:id/status
router.put('/:id/status', authenticate, requireMinRole('EOC Operator'), async (req, res) => {
  try {
    const { status } = req.body;
    if (!['reported', 'verified', 'assigned', 'in_progress', 'resolved'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }

    await db('damage_reports').where('id', req.params.id).update({
      status,
      updated_at: new Date().toISOString()
    });

    const updated = await db('damage_reports').where('id', req.params.id).first();
    const io = req.app.get('io');
    if (io) io.emit('damage_report:updated', updated);

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
