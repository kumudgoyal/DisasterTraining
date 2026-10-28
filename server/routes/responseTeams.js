const express = require('express');
const db = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { requireMinRole } = require('../middleware/rbac');
const { logAction } = require('../middleware/audit');
const router = express.Router();

// GET /api/response-teams
router.get('/', authenticate, async (req, res) => {
  try {
    const { type, status, organization_id, incident_id } = req.query;
    let query = db('response_teams')
      .leftJoin('organizations', 'response_teams.organization_id', 'organizations.id')
      .leftJoin('incidents', 'response_teams.assigned_incident_id', 'incidents.id')
      .select(
        'response_teams.*',
        'organizations.name as organization_name',
        'incidents.incident_id as incident_code',
        'incidents.title as incident_title'
      );

    if (type) query = query.where('response_teams.type', type);
    if (status) query = query.where('response_teams.status', status);
    if (organization_id) query = query.where('response_teams.organization_id', organization_id);
    if (incident_id) query = query.where('response_teams.assigned_incident_id', incident_id);

    const teams = await query.orderBy('response_teams.name', 'asc');
    res.json({ success: true, data: teams });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// POST /api/response-teams
router.post('/', authenticate, requireMinRole('District Admin'), async (req, res) => {
  try {
    const { name, type, organization_id, members_count, specialization, current_location, latitude, longitude, contact_person, contact_phone } = req.body;
    if (!name || !type) return res.status(400).json({ success: false, error: 'Team name and type required' });

    const [id] = await db('response_teams').insert({
      name, type,
      organization_id: organization_id || req.user.organization_id,
      members_count: parseInt(members_count) || 0,
      specialization: specialization || '',
      status: 'available',
      current_location: current_location || '',
      latitude: latitude || null,
      longitude: longitude || null,
      contact_person, contact_phone,
      created_at: new Date().toISOString()
    });

    const team = await db('response_teams').where('id', id).first();
    const io = req.app.get('io');
    if (io) io.emit('team:created', team);

    res.status(201).json({ success: true, data: team });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// PUT /api/response-teams/:id/assign
router.put('/:id/assign', authenticate, requireMinRole('EOC Operator'), async (req, res) => {
  try {
    const { incident_id } = req.body;
    if (!incident_id) return res.status(400).json({ success: false, error: 'incident_id required' });

    const team = await db('response_teams').where('id', req.params.id).first();
    if (!team) return res.status(404).json({ success: false, error: 'Team not found' });

    const incident = await db('incidents').where('id', incident_id).first();
    if (!incident) return res.status(404).json({ success: false, error: 'Incident not found' });

    const now = new Date().toISOString();
    await db('response_teams').where('id', req.params.id).update({
      assigned_incident_id: incident_id,
      status: 'deployed',
      deployed_at: now
    });

    await db('incidents').where('id', incident_id).update({
      response_status: 'in_progress',
      updated_at: now
    });

    await db('incident_updates').insert({
      incident_id,
      user_id: req.user.id,
      update_text: `Team "${team.name}" (${team.members_count} members, ${team.specialization}) deployed to incident.`,
      update_type: 'team',
      created_at: now
    });

    const io = req.app.get('io');
    if (io) {
      io.emit('team:assigned', { team_id: team.id, incident_id });
      io.emit('incident:update_added', { incident_id });
    }

    await logAction(req.user.id, 'team_deployed', 'response_team', team.id, `Deployed team ${team.name} to incident ${incident.incident_id}`, req.ip);

    res.json({ success: true, message: 'Team successfully deployed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// PUT /api/response-teams/:id/unassign
router.put('/:id/unassign', authenticate, requireMinRole('EOC Operator'), async (req, res) => {
  try {
    const team = await db('response_teams').where('id', req.params.id).first();
    if (!team) return res.status(404).json({ success: false, error: 'Team not found' });

    const prevIncidentId = team.assigned_incident_id;
    const now = new Date().toISOString();

    await db('response_teams').where('id', req.params.id).update({
      assigned_incident_id: null,
      status: 'available',
      deployed_at: null
    });

    if (prevIncidentId) {
      await db('incident_updates').insert({
        incident_id: prevIncidentId,
        user_id: req.user.id,
        update_text: `Team "${team.name}" relieved and marked available.`,
        update_type: 'team',
        created_at: now
      });
    }

    const io = req.app.get('io');
    if (io) io.emit('team:unassigned', { team_id: team.id });

    res.json({ success: true, message: 'Team marked available' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
