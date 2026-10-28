const express = require('express');
const db = require('../config/database');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// GET /api/analytics/incidents
router.get('/incidents', authenticate, async (req, res) => {
  try {
    const byType = await db('incidents')
      .join('disaster_types', 'incidents.disaster_type_id', 'disaster_types.id')
      .select('disaster_types.name as disaster_type', 'disaster_types.color')
      .count('incidents.id as count')
      .groupBy('disaster_types.name', 'disaster_types.color');

    const bySeverity = await db('incidents')
      .select('severity')
      .count('id as count')
      .groupBy('severity');

    const byStatus = await db('incidents')
      .select('status')
      .count('id as count')
      .groupBy('status');

    const byDistrict = await db('incidents')
      .select('location_name as location')
      .count('id as count')
      .sum('estimated_affected as affected')
      .sum('casualties as casualties')
      .groupBy('location_name');

    res.json({
      success: true,
      data: {
        by_type: byType,
        by_severity: bySeverity,
        by_status: byStatus,
        by_district: byDistrict
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /api/analytics/response
router.get('/response', authenticate, async (req, res) => {
  try {
    const teamsByType = await db('response_teams')
      .select('type')
      .count('id as total_teams')
      .sum('members_count as total_members')
      .groupBy('type');

    const teamsByStatus = await db('response_teams')
      .select('status')
      .count('id as count')
      .groupBy('status');

    const resourcesByType = await db('resources')
      .select('type')
      .sum('quantity as total_quantity')
      .sum('available_quantity as available_quantity')
      .groupBy('type');

    const requestsByUrgency = await db('resource_requests')
      .select('urgency', 'status')
      .count('id as count')
      .groupBy('urgency', 'status');

    res.json({
      success: true,
      data: {
        teams_by_type: teamsByType,
        teams_by_status: teamsByStatus,
        resources_by_type: resourcesByType,
        requests_by_urgency: requestsByUrgency
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /api/analytics/impact
router.get('/impact', authenticate, async (req, res) => {
  try {
    const damageByInfra = await db('damage_reports')
      .select('infrastructure_type')
      .count('id as count')
      .sum('estimated_loss as loss')
      .sum('affected_families as families')
      .groupBy('infrastructure_type');

    const damageByLevel = await db('damage_reports')
      .select('damage_level')
      .count('id as count')
      .groupBy('damage_level');

    res.json({
      success: true,
      data: {
        damage_by_infra: damageByInfra,
        damage_by_level: damageByLevel
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
