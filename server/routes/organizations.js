const express = require('express');
const db = require('../config/database');
const { authenticate, optionalAuth } = require('../middleware/auth');
const { requireMinRole } = require('../middleware/rbac');
const router = express.Router();

// GET /api/organizations
router.get('/', optionalAuth, async (req, res) => {
  try {
    const orgs = await db('organizations')
      .where('is_active', true)
      .select('*')
      .orderBy('name', 'asc');

    // Attach summary stats (teams count, resources count)
    const orgsWithStats = await Promise.all(orgs.map(async (org) => {
      const teamsCount = await db('response_teams').where('organization_id', org.id).count('id as c').first();
      const resourcesCount = await db('resources').where('organization_id', org.id).count('id as c').first();
      const trainingCount = await db('training_programs').where('organization_id', org.id).count('id as c').first();
      return {
        ...org,
        teams_count: teamsCount.c || 0,
        resources_count: resourcesCount.c || 0,
        training_count: trainingCount.c || 0
      };
    }));

    res.json({ success: true, data: orgsWithStats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /api/organizations/:id
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const org = await db('organizations').where('id', req.params.id).first();
    if (!org) return res.status(404).json({ success: false, error: 'Organization not found' });

    const teams = await db('response_teams').where('organization_id', org.id);
    const resources = await db('resources').where('organization_id', org.id);
    const trainings = await db('training_programs').where('organization_id', org.id);

    res.json({ success: true, data: { ...org, teams, resources, trainings } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// POST /api/organizations
router.post('/', authenticate, requireMinRole('State Admin'), async (req, res) => {
  try {
    const { name, type, contact_email, contact_phone, address, operating_region, specializations, website } = req.body;
    if (!name || !type) return res.status(400).json({ success: false, error: 'Name and type are required' });

    const [id] = await db('organizations').insert({
      name, type, contact_email, contact_phone, address, operating_region, specializations, website,
      is_active: true, created_at: new Date().toISOString()
    });

    const created = await db('organizations').where('id', id).first();
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
