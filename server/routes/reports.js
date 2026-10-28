const express = require('express');
const db = require('../config/database');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// GET /api/reports/sitrep (Comprehensive Situation Report)
router.get('/sitrep', authenticate, async (req, res) => {
  try {
    const activeIncidents = await db('incidents')
      .join('disaster_types', 'incidents.disaster_type_id', 'disaster_types.id')
      .whereNotIn('incidents.status', ['resolved', 'closed'])
      .select('incidents.*', 'disaster_types.name as disaster_type');

    const deployedTeams = await db('response_teams')
      .leftJoin('organizations', 'response_teams.organization_id', 'organizations.id')
      .where('response_teams.status', 'deployed')
      .select('response_teams.*', 'organizations.name as organization_name');

    const activeShelters = await db('shelters').where('status', 'active');
    const now = new Date().toISOString();
    const activeAlerts = await db('alerts')
      .where('status', 'active')
      .andWhere(function() {
        this.whereNull('expiry_time').orWhere('expiry_time', '>', now);
      });

    const damageSummary = await db('damage_reports')
      .select('infrastructure_type')
      .sum('estimated_loss as loss')
      .count('id as count')
      .groupBy('infrastructure_type');

    const sitrep = {
      generated_at: new Date().toISOString(),
      generated_by: req.user.full_name,
      issuing_authority: 'State Emergency Operations Centre (SEOC)',
      overview: {
        active_incidents_count: activeIncidents.length,
        deployed_teams_count: deployedTeams.length,
        active_shelters_count: activeShelters.length,
        active_alerts_count: activeAlerts.length,
        total_evacuated: activeIncidents.reduce((sum, inc) => sum + (inc.evacuated || 0), 0),
        total_casualties: activeIncidents.reduce((sum, inc) => sum + (inc.casualties || 0), 0),
        total_injured: activeIncidents.reduce((sum, inc) => sum + (inc.injured || 0), 0),
        total_affected: activeIncidents.reduce((sum, inc) => sum + (inc.estimated_affected || 0), 0),
      },
      incidents: activeIncidents,
      deployed_teams: deployedTeams,
      shelters: activeShelters.map(s => ({
        ...s,
        occupancy_rate: s.capacity > 0 ? Math.round((s.current_occupancy / s.capacity) * 100) : 0
      })),
      alerts: activeAlerts,
      damage_summary: damageSummary
    };

    res.json({ success: true, data: sitrep });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /api/reports/incident/:id
router.get('/incident/:id', authenticate, async (req, res) => {
  try {
    const incident = await db('incidents')
      .join('disaster_types', 'incidents.disaster_type_id', 'disaster_types.id')
      .leftJoin('organizations', 'incidents.reporting_org_id', 'organizations.id')
      .leftJoin('users', 'incidents.reported_by', 'users.id')
      .where('incidents.id', req.params.id)
      .select(
        'incidents.*',
        'disaster_types.name as disaster_type',
        'organizations.name as reporting_org',
        'users.full_name as reported_by_name'
      )
      .first();

    if (!incident) return res.status(404).json({ success: false, error: 'Incident not found' });

    const timeline = await db('incident_updates')
      .leftJoin('users', 'incident_updates.user_id', 'users.id')
      .where('incident_updates.incident_id', incident.id)
      .select('incident_updates.*', 'users.full_name as author')
      .orderBy('incident_updates.created_at', 'asc');

    const teams = await db('response_teams')
      .where('assigned_incident_id', incident.id);

    const damage = await db('damage_reports')
      .where('incident_id', incident.id);

    const resourceRequests = await db('resource_requests')
      .leftJoin('resources', 'resource_requests.assigned_resource_id', 'resources.id')
      .where('resource_requests.incident_id', incident.id)
      .select('resource_requests.*', 'resources.name as resource_name');

    const fieldReports = await db('field_reports')
      .where('incident_id', incident.id);

    res.json({
      success: true,
      data: {
        incident,
        timeline,
        teams,
        damage,
        resourceRequests,
        fieldReports,
        generated_at: new Date().toISOString(),
        generated_by: req.user.full_name
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
