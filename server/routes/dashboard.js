const express = require('express');
const db = require('../config/database');
const { optionalAuth } = require('../middleware/auth');
const router = express.Router();

// GET /api/dashboard/kpis
router.get('/kpis', optionalAuth, async (req, res) => {
  try {
    // 1. Incidents
    const activeIncidents = await db('incidents')
      .whereNotIn('status', ['resolved', 'closed'])
      .count('id as count')
      .first();

    const criticalIncidents = await db('incidents')
      .where('severity', 'critical')
      .whereNotIn('status', ['resolved', 'closed'])
      .count('id as count')
      .first();

    const impactTotals = await db('incidents')
      .whereNotIn('status', ['resolved', 'closed'])
      .sum({
        affected: 'estimated_affected',
        evacuated: 'evacuated',
        casualties: 'casualties',
        injured: 'injured',
        missing: 'missing_persons'
      })
      .first();

    // 2. Response Teams
    const deployedTeams = await db('response_teams')
      .where('status', 'deployed')
      .count('id as count')
      .first();

    const totalTeams = await db('response_teams')
      .count('id as count')
      .first();

    // 3. Resources
    const availableResources = await db('resources')
      .sum('available_quantity as total')
      .first();

    const pendingRequests = await db('resource_requests')
      .where('status', 'pending')
      .count('id as count')
      .first();

    // 4. Shelters
    const shelterStats = await db('shelters')
      .where('status', '!=', 'closed')
      .sum({
        capacity: 'capacity',
        occupancy: 'current_occupancy'
      })
      .count('id as count')
      .first();

    const shelterCapacity = shelterStats.capacity || 0;
    const shelterOccupancy = shelterStats.occupancy || 0;
    const shelterOccupancyPct = shelterCapacity > 0 ? Math.round((shelterOccupancy / shelterCapacity) * 100) : 0;

    // 5. Alerts
    const now = new Date().toISOString();
    const activeAlerts = await db('alerts')
      .where('status', 'active')
      .andWhere(function() {
        this.whereNull('expiry_time').orWhere('expiry_time', '>', now);
      })
      .count('id as count')
      .first();

    // 6. Preparedness / Training
    const trainedPeople = await db('training_programs')
      .sum('participants_count as total')
      .first();

    // 7. Damage summary
    const damageLoss = await db('damage_reports')
      .sum('estimated_loss as total')
      .first();

    res.json({
      success: true,
      data: {
        active_incidents: activeIncidents.count || 0,
        critical_incidents: criticalIncidents.count || 0,
        total_affected: impactTotals.affected || 0,
        total_evacuated: impactTotals.evacuated || 0,
        total_casualties: impactTotals.casualties || 0,
        total_injured: impactTotals.injured || 0,
        total_missing: impactTotals.missing || 0,
        active_response_teams: deployedTeams.count || 0,
        total_response_teams: totalTeams.count || 0,
        available_resources: availableResources.total || 0,
        pending_requests: pendingRequests.count || 0,
        active_shelters: shelterStats.count || 0,
        shelter_capacity: shelterCapacity,
        shelter_occupancy: shelterOccupancy,
        shelter_occupancy_pct: shelterOccupancyPct,
        active_alerts: activeAlerts.count || 0,
        trained_people: trainedPeople.total || 0,
        total_estimated_loss: damageLoss.total || 0
      }
    });
  } catch (err) {
    console.error('KPI error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /api/dashboard/activity-feed
router.get('/activity-feed', optionalAuth, async (req, res) => {
  try {
    // Collect recent updates from multiple tables
    const updates = await db('incident_updates')
      .join('incidents', 'incident_updates.incident_id', 'incidents.id')
      .leftJoin('users', 'incident_updates.user_id', 'users.id')
      .select(
        'incident_updates.id',
        'incident_updates.created_at',
        'incident_updates.update_text as text',
        'incident_updates.update_type as sub_type',
        'incidents.incident_id as code',
        'incidents.severity',
        'users.full_name as author'
      )
      .orderBy('incident_updates.created_at', 'desc')
      .limit(20);

    const reports = await db('field_reports')
      .leftJoin('users', 'field_reports.submitted_by', 'users.id')
      .select(
        'field_reports.id',
        'field_reports.created_at',
        'field_reports.report_type as sub_type',
        'field_reports.severity',
        'field_reports.location_name as location',
        'field_reports.description as text',
        'users.full_name as author'
      )
      .orderBy('field_reports.created_at', 'desc')
      .limit(15);

    const alerts = await db('alerts')
      .select(
        'id',
        'created_at',
        'title as text',
        'alert_type as sub_type',
        'severity',
        'affected_area as location'
      )
      .orderBy('created_at', 'desc')
      .limit(10);

    // Merge and format into uniform feed events
    const feed = [
      ...updates.map(u => ({
        id: `u-${u.id}`,
        type: 'incident_update',
        title: `Incident ${u.code || ''}`,
        description: u.text,
        sub_type: u.sub_type,
        severity: u.severity || 'moderate',
        author: u.author || 'EOC Official',
        timestamp: u.created_at
      })),
      ...reports.map(r => ({
        id: `r-${r.id}`,
        type: 'field_report',
        title: `Field Report: ${r.sub_type.replace('_', ' ')}`,
        description: `${r.location ? '[' + r.location + '] ' : ''}${r.text}`,
        sub_type: r.sub_type,
        severity: r.severity || 'moderate',
        author: r.author || 'Field Responder',
        timestamp: r.created_at
      })),
      ...alerts.map(a => ({
        id: `a-${a.id}`,
        type: 'alert',
        title: `Emergency Alert Issued`,
        description: `${a.text} (${a.location || 'General'})`,
        sub_type: a.sub_type,
        severity: a.severity || 'high',
        author: 'Disaster Authority',
        timestamp: a.created_at
      }))
    ];

    feed.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    res.json({ success: true, data: feed.slice(0, 30) });
  } catch (err) {
    console.error('Activity feed error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
