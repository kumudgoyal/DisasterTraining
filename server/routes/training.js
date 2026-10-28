const express = require('express');
const db = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { requireMinRole } = require('../middleware/rbac');
const { logAction } = require('../middleware/audit');
const router = express.Router();

// GET /api/training
router.get('/', authenticate, async (req, res) => {
  try {
    const { district, disaster_type_id, organization_id } = req.query;
    let query = db('training_programs')
      .leftJoin('organizations', 'training_programs.organization_id', 'organizations.id')
      .leftJoin('disaster_types', 'training_programs.disaster_type_id', 'disaster_types.id')
      .select(
        'training_programs.*',
        'organizations.name as organization_name',
        'disaster_types.name as disaster_type_name',
        'disaster_types.icon as disaster_type_icon'
      );

    if (district) query = query.where('training_programs.district', 'like', `%${district}%`);
    if (disaster_type_id) query = query.where('training_programs.disaster_type_id', disaster_type_id);
    if (organization_id) query = query.where('training_programs.organization_id', organization_id);

    const programs = await query.orderBy('training_programs.training_date', 'desc');
    res.json({ success: true, data: programs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /api/training/analytics
router.get('/analytics', authenticate, async (req, res) => {
  try {
    const totalPrograms = await db('training_programs').count('id as total').first();
    const totalParticipants = await db('training_programs').sum('participants_count as total').first();

    const byDistrict = await db('training_programs')
      .select('district')
      .count('id as programs_count')
      .sum('participants_count as participants_count')
      .groupBy('district');

    const byDisasterType = await db('training_programs')
      .leftJoin('disaster_types', 'training_programs.disaster_type_id', 'disaster_types.id')
      .select(db.raw('COALESCE(disaster_types.name, "Multi-hazard / General") as type_name'))
      .count('training_programs.id as count')
      .sum('training_programs.participants_count as participants')
      .groupBy('type_name');

    const byOrganization = await db('training_programs')
      .leftJoin('organizations', 'training_programs.organization_id', 'organizations.id')
      .select('organizations.name as org_name')
      .count('training_programs.id as count')
      .sum('training_programs.participants_count as participants')
      .groupBy('org_name');

    res.json({
      success: true,
      data: {
        total_programs: totalPrograms.total || 0,
        total_participants: totalParticipants.total || 0,
        by_district: byDistrict,
        by_disaster_type: byDisasterType,
        by_organization: byOrganization
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// POST /api/training
router.post('/', authenticate, requireMinRole('Volunteer'), async (req, res) => {
  try {
    const { title, organization_id, trainer_name, location, latitude, longitude, district, state, disaster_type_id, training_date, end_date, participants_count, participant_categories, outcome, photos } = req.body;
    if (!title || !training_date) {
      return res.status(400).json({ success: false, error: 'Title and training date required' });
    }

    const [id] = await db('training_programs').insert({
      title,
      organization_id: organization_id || req.user.organization_id,
      trainer_name: trainer_name || '',
      location: location || '',
      latitude: latitude || null,
      longitude: longitude || null,
      district: district || 'Rohtak',
      state: state || 'Haryana',
      disaster_type_id: disaster_type_id || null,
      training_date,
      end_date: end_date || null,
      participants_count: parseInt(participants_count) || 0,
      participant_categories: participant_categories || '',
      outcome: outcome || '',
      photos: photos || null,
      created_at: new Date().toISOString()
    });

    const program = await db('training_programs').where('id', id).first();
    const io = req.app.get('io');
    if (io) io.emit('training:created', program);

    await logAction(req.user.id, 'training_created', 'training_program', id, `Registered training: ${title}`, req.ip);

    res.status(201).json({ success: true, data: program });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
