const express = require('express');
const db = require('../config/database');
const { optionalAuth } = require('../middleware/auth');
const router = express.Router();

// GET /api/gis/layers
// Unified fast query for all interactive GIS layers
router.get('/layers', optionalAuth, async (req, res) => {
  try {
    const isPublic = !req.user || req.user.role === 'Public User';

    // 1. Incidents
    let incidentQuery = db('incidents')
      .join('disaster_types', 'incidents.disaster_type_id', 'disaster_types.id')
      .whereNotNull('incidents.latitude')
      .whereNotNull('incidents.longitude')
      .select(
        'incidents.id', 'incidents.incident_id', 'incidents.title', 'incidents.severity',
        'incidents.status', 'incidents.latitude', 'incidents.longitude', 'incidents.location_name',
        'incidents.estimated_affected', 'incidents.casualties', 'incidents.evacuated',
        'incidents.verification_status', 'incidents.detected_at',
        'disaster_types.name as disaster_type', 'disaster_types.icon as disaster_icon', 'disaster_types.color as disaster_color'
      );

    if (isPublic) {
      incidentQuery = incidentQuery.where('incidents.verification_status', 'verified');
    }
    const incidents = await incidentQuery;

    // 2. Shelters
    const shelters = await db('shelters')
      .whereNotNull('latitude')
      .whereNotNull('longitude')
      .select('*');

    const formattedShelters = shelters.map(s => ({
      ...s,
      available_capacity: Math.max(0, s.capacity - s.current_occupancy),
      occupancy_pct: s.capacity > 0 ? Math.round((s.current_occupancy / s.capacity) * 100) : 0
    }));

    // 3. Response Teams (Operational)
    let teams = [];
    if (!isPublic) {
      teams = await db('response_teams')
        .leftJoin('organizations', 'response_teams.organization_id', 'organizations.id')
        .whereNotNull('response_teams.latitude')
        .whereNotNull('response_teams.longitude')
        .select(
          'response_teams.id', 'response_teams.name', 'response_teams.type',
          'response_teams.members_count', 'response_teams.specialization', 'response_teams.status',
          'response_teams.current_location', 'response_teams.latitude', 'response_teams.longitude',
          'response_teams.assigned_incident_id',
          'organizations.name as organization_name'
        );
    }

    // 4. Resources
    let resources = [];
    if (!isPublic) {
      resources = await db('resources')
        .leftJoin('organizations', 'resources.organization_id', 'organizations.id')
        .whereNotNull('resources.latitude')
        .whereNotNull('resources.longitude')
        .select(
          'resources.id', 'resources.name', 'resources.type', 'resources.quantity',
          'resources.available_quantity', 'resources.status', 'resources.location',
          'resources.latitude', 'resources.longitude',
          'organizations.name as organization_name'
        );
    }

    // 5. Active Alerts
    const now = new Date().toISOString();
    const alerts = await db('alerts')
      .where('status', 'active')
      .whereNotNull('latitude')
      .whereNotNull('longitude')
      .andWhere(function() {
        this.whereNull('expiry_time').orWhere('expiry_time', '>', now);
      })
      .select('id', 'title', 'alert_type', 'severity', 'affected_area', 'latitude', 'longitude', 'radius_km', 'message');

    // 6. Training Activities (Preparedness footprints)
    let trainings = [];
    if (!isPublic) {
      trainings = await db('training_programs')
        .leftJoin('disaster_types', 'training_programs.disaster_type_id', 'disaster_types.id')
        .whereNotNull('training_programs.latitude')
        .whereNotNull('training_programs.longitude')
        .select(
          'training_programs.id', 'training_programs.title', 'training_programs.trainer_name',
          'training_programs.district', 'training_programs.latitude', 'training_programs.longitude',
          'training_programs.participants_count', 'training_programs.training_date',
          'disaster_types.name as disaster_type_name'
        );
    }

    res.json({
      success: true,
      data: {
        incidents,
        shelters: formattedShelters,
        teams,
        resources,
        alerts,
        trainings
      }
    });
  } catch (err) {
    console.error('GIS layers error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
