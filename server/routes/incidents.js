const express = require('express');
const db = require('../config/database');
const { authenticate, optionalAuth } = require('../middleware/auth');
const { requireMinRole } = require('../middleware/rbac');
const { logAction } = require('../middleware/audit');
const { notifyRole } = require('../services/notificationService');
const router = express.Router();

const DISASTER_PREFIXES = { 1: 'FLD', 2: 'EQ', 3: 'CYC', 4: 'LND', 5: 'FIR', 6: 'HW', 7: 'CB', 8: 'IND', 9: 'BLD', 10: 'EPI', 11: 'TRN', 12: 'OTH' };

// GET /api/incidents
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { disaster_type_id, severity, status, district, state, verification_status, search, page = 1, limit = 50 } = req.query;
    let query = db('incidents')
      .join('disaster_types', 'incidents.disaster_type_id', 'disaster_types.id')
      .leftJoin('organizations', 'incidents.reporting_org_id', 'organizations.id')
      .leftJoin('users', 'incidents.reported_by', 'users.id')
      .select(
        'incidents.*', 'disaster_types.name as disaster_type', 'disaster_types.icon as disaster_icon',
        'disaster_types.color as disaster_color', 'organizations.name as reporting_org',
        'users.full_name as reported_by_name'
      );

    if (!req.user || req.user.role === 'Public User') {
      query = query.where('incidents.verification_status', 'verified');
    }
    if (disaster_type_id) query = query.where('incidents.disaster_type_id', disaster_type_id);
    if (severity) query = query.where('incidents.severity', severity);
    if (status) query = query.where('incidents.status', status);
    if (district) query = query.where('incidents.affected_districts', 'like', `%${district}%`);
    if (state) query = query.where('incidents.state', state);
    if (verification_status) query = query.where('incidents.verification_status', verification_status);
    if (search) query = query.where(function() {
      this.where('incidents.title', 'like', `%${search}%`)
        .orWhere('incidents.incident_id', 'like', `%${search}%`)
        .orWhere('incidents.location_name', 'like', `%${search}%`)
        .orWhere('incidents.description', 'like', `%${search}%`);
    });

    const total = (await query.clone().count('incidents.id as count').first()).count;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const data = await query.orderBy('incidents.created_at', 'desc').limit(parseInt(limit)).offset(offset);
    res.json({ success: true, data, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) } });
  } catch (err) { console.error(err); res.status(500).json({ success: false, error: 'Server error' }); }
});

// POST /api/incidents
router.post('/', authenticate, requireMinRole('Volunteer'), async (req, res) => {
  try {
    const { disaster_type_id, severity, title, description, latitude, longitude, location_name, affected_districts, state, estimated_affected, casualties, missing_persons, injured, evacuated, detected_at } = req.body;
    if (!disaster_type_id || !severity || !title) return res.status(400).json({ success: false, error: 'disaster_type_id, severity, and title are required' });

    const prefix = DISASTER_PREFIXES[disaster_type_id] || 'OTH';
    const year = new Date().getFullYear();
    const count = (await db('incidents').where('disaster_type_id', disaster_type_id).count('id as c').first()).c;
    const incident_id = `${prefix}-${year}-${String(count + 1).padStart(3, '0')}`;
    const now = new Date().toISOString();

    const [id] = await db('incidents').insert({
      incident_id, disaster_type_id, severity, status: 'reported', title, description: description || '',
      latitude: latitude || null, longitude: longitude || null, location_name: location_name || '',
      affected_districts: affected_districts || '', state: state || '', estimated_affected: estimated_affected || 0,
      casualties: casualties || 0, missing_persons: missing_persons || 0, injured: injured || 0, evacuated: evacuated || 0,
      reporting_org_id: req.user.organization_id, reported_by: req.user.id,
      verification_status: req.user.role === 'Public User' ? 'submitted' : 'under_verification',
      response_status: 'pending', detected_at: detected_at || now, created_at: now, updated_at: now,
    });

    await db('incident_updates').insert({ incident_id: id, user_id: req.user.id, update_text: `Incident "${title}" reported with ${severity} severity.`, update_type: 'info', created_at: now });

    const io = req.app.get('io');
    const created = await db('incidents').join('disaster_types', 'incidents.disaster_type_id', 'disaster_types.id')
      .where('incidents.id', id).select('incidents.*', 'disaster_types.name as disaster_type', 'disaster_types.icon as disaster_icon', 'disaster_types.color as disaster_color').first();
    if (io) io.emit('incident:created', created);

    if (severity === 'critical' || severity === 'high') {
      await notifyRole('EOC Operator', { category: severity === 'critical' ? 'critical' : 'high', title: `New ${severity} incident: ${title}`, message: `${title} reported at ${location_name || 'Unknown location'}.`, related_type: 'incident', related_id: id });
      await notifyRole('Super Admin', { category: severity === 'critical' ? 'critical' : 'high', title: `New ${severity} incident: ${title}`, message: `${title} reported at ${location_name || 'Unknown location'}.`, related_type: 'incident', related_id: id });
    }
    await logAction(req.user.id, 'incident_created', 'incident', id, `Created ${incident_id}: ${title}`, req.ip);
    res.status(201).json({ success: true, data: created });
  } catch (err) { console.error(err); res.status(500).json({ success: false, error: 'Server error' }); }
});

// GET /api/incidents/:id
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const incident = await db('incidents')
      .join('disaster_types', 'incidents.disaster_type_id', 'disaster_types.id')
      .leftJoin('organizations', 'incidents.reporting_org_id', 'organizations.id')
      .leftJoin('users', 'incidents.reported_by', 'users.id')
      .where('incidents.id', req.params.id)
      .select('incidents.*', 'disaster_types.name as disaster_type', 'disaster_types.icon as disaster_icon', 'disaster_types.color as disaster_color', 'organizations.name as reporting_org', 'users.full_name as reported_by_name')
      .first();
    if (!incident) return res.status(404).json({ success: false, error: 'Incident not found' });

    const updates = await db('incident_updates').join('users', 'incident_updates.user_id', 'users.id')
      .where('incident_id', incident.id).select('incident_updates.*', 'users.full_name as user_name').orderBy('incident_updates.created_at', 'desc');
    const teams = await db('response_teams').leftJoin('organizations', 'response_teams.organization_id', 'organizations.id')
      .where('assigned_incident_id', incident.id).select('response_teams.*', 'organizations.name as organization_name');
    const resourceRequests = await db('resource_requests').leftJoin('users', 'resource_requests.requested_by', 'users.id')
      .where('resource_requests.incident_id', incident.id).select('resource_requests.*', 'users.full_name as requested_by_name');
    const fieldReports = await db('field_reports').leftJoin('users', 'field_reports.submitted_by', 'users.id')
      .where('field_reports.incident_id', incident.id).select('field_reports.*', 'users.full_name as submitted_by_name').orderBy('created_at', 'desc');
    const damageReports = await db('damage_reports').where('incident_id', incident.id).orderBy('created_at', 'desc');

    res.json({ success: true, data: { ...incident, updates, teams, resourceRequests, fieldReports, damageReports } });
  } catch (err) { console.error(err); res.status(500).json({ success: false, error: 'Server error' }); }
});

// PUT /api/incidents/:id
router.put('/:id', authenticate, requireMinRole('Field Officer'), async (req, res) => {
  try {
    const incident = await db('incidents').where('id', req.params.id).first();
    if (!incident) return res.status(404).json({ success: false, error: 'Incident not found' });
    const now = new Date().toISOString();
    const updates = { ...req.body, updated_at: now };
    delete updates.id; delete updates.incident_id; delete updates.created_at;
    await db('incidents').where('id', req.params.id).update(updates);

    // Track status changes
    if (req.body.status && req.body.status !== incident.status) {
      await db('incident_updates').insert({ incident_id: incident.id, user_id: req.user.id, update_text: `Status changed from "${incident.status}" to "${req.body.status}"`, update_type: 'status_change', old_value: incident.status, new_value: req.body.status, created_at: now });
    }
    if (req.body.severity && req.body.severity !== incident.severity) {
      await db('incident_updates').insert({ incident_id: incident.id, user_id: req.user.id, update_text: `Severity changed from "${incident.severity}" to "${req.body.severity}"`, update_type: 'info', old_value: incident.severity, new_value: req.body.severity, created_at: now });
    }

    const io = req.app.get('io');
    const updated = await db('incidents').join('disaster_types', 'incidents.disaster_type_id', 'disaster_types.id').where('incidents.id', req.params.id).select('incidents.*', 'disaster_types.name as disaster_type', 'disaster_types.icon as disaster_icon', 'disaster_types.color as disaster_color').first();
    if (io) io.emit('incident:updated', updated);
    await logAction(req.user.id, 'incident_updated', 'incident', incident.id, `Updated ${incident.incident_id}`, req.ip);
    res.json({ success: true, data: updated });
  } catch (err) { console.error(err); res.status(500).json({ success: false, error: 'Server error' }); }
});

// POST /api/incidents/:id/updates
router.post('/:id/updates', authenticate, async (req, res) => {
  try {
    const { update_text, update_type } = req.body;
    if (!update_text) return res.status(400).json({ success: false, error: 'update_text is required' });
    const [id] = await db('incident_updates').insert({ incident_id: parseInt(req.params.id), user_id: req.user.id, update_text, update_type: update_type || 'general', created_at: new Date().toISOString() });
    await db('incidents').where('id', req.params.id).update({ updated_at: new Date().toISOString() });
    const io = req.app.get('io');
    if (io) io.emit('incident:update_added', { incident_id: parseInt(req.params.id), update_text });
    res.status(201).json({ success: true, data: { id } });
  } catch (err) { console.error(err); res.status(500).json({ success: false, error: 'Server error' }); }
});

// PUT /api/incidents/:id/verify
router.put('/:id/verify', authenticate, requireMinRole('EOC Operator'), async (req, res) => {
  try {
    const { verification_status } = req.body;
    if (!['verified', 'rejected', 'under_verification'].includes(verification_status)) return res.status(400).json({ success: false, error: 'Invalid status' });
    const now = new Date().toISOString();
    await db('incidents').where('id', req.params.id).update({ verification_status, updated_at: now });
    await db('incident_updates').insert({ incident_id: parseInt(req.params.id), user_id: req.user.id, update_text: `Verification status changed to "${verification_status}"`, update_type: 'status_change', new_value: verification_status, created_at: now });
    const io = req.app.get('io');
    if (io) io.emit('incident:verified', { id: parseInt(req.params.id), verification_status });
    res.json({ success: true, data: { verification_status } });
  } catch (err) { console.error(err); res.status(500).json({ success: false, error: 'Server error' }); }
});

// PUT /api/incidents/:id/assign-team
router.put('/:id/assign-team', authenticate, requireMinRole('EOC Operator'), async (req, res) => {
  try {
    const { team_id } = req.body;
    if (!team_id) return res.status(400).json({ success: false, error: 'team_id required' });
    const now = new Date().toISOString();
    await db('response_teams').where('id', team_id).update({ assigned_incident_id: parseInt(req.params.id), status: 'deployed', deployed_at: now });
    await db('incidents').where('id', req.params.id).update({ response_status: 'teams_assigned', updated_at: now });
    const team = await db('response_teams').where('id', team_id).first();
    await db('incident_updates').insert({ incident_id: parseInt(req.params.id), user_id: req.user.id, update_text: `Response team "${team.name}" assigned to this incident.`, update_type: 'team', created_at: now });
    const io = req.app.get('io');
    if (io) io.emit('team:assigned', { incident_id: parseInt(req.params.id), team });
    res.json({ success: true, data: team });
  } catch (err) { console.error(err); res.status(500).json({ success: false, error: 'Server error' }); }
});

module.exports = router;
