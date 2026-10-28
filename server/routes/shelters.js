const express = require('express');
const db = require('../config/database');
const { authenticate, optionalAuth } = require('../middleware/auth');
const { requireMinRole } = require('../middleware/rbac');
const { logAction } = require('../middleware/audit');
const { notifyRole } = require('../services/notificationService');
const router = express.Router();

// GET /api/shelters
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { district, status, min_capacity } = req.query;
    let query = db('shelters').select('*');
    if (district) query = query.where('district', 'like', `%${district}%`);
    if (status) query = query.where('status', status);
    if (min_capacity) query = query.where('capacity', '>=', parseInt(min_capacity));

    const shelters = await query.orderBy('name', 'asc');
    // Calculate availability stats for each
    const data = shelters.map(s => ({
      ...s,
      available_capacity: Math.max(0, s.capacity - s.current_occupancy),
      occupancy_rate: s.capacity > 0 ? Math.round((s.current_occupancy / s.capacity) * 100) : 0
    }));

    res.json({ success: true, data });
  } catch (err) {
    console.error('Shelters error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /api/shelters/:id
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const shelter = await db('shelters').where('id', req.params.id).first();
    if (!shelter) return res.status(404).json({ success: false, error: 'Shelter not found' });
    
    shelter.available_capacity = Math.max(0, shelter.capacity - shelter.current_occupancy);
    shelter.occupancy_rate = shelter.capacity > 0 ? Math.round((shelter.current_occupancy / shelter.capacity) * 100) : 0;

    res.json({ success: true, data: shelter });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// POST /api/shelters
router.post('/', authenticate, requireMinRole('District Admin'), async (req, res) => {
  try {
    const { name, location_name, district, state, latitude, longitude, capacity, current_occupancy, food_available, water_available, medical_facility, electricity, toilets, contact_person, contact_phone, status } = req.body;
    if (!name || !capacity) return res.status(400).json({ success: false, error: 'Name and capacity required' });

    const [id] = await db('shelters').insert({
      name, location_name, district, state: state || 'Haryana',
      latitude: latitude || null, longitude: longitude || null,
      capacity: parseInt(capacity), current_occupancy: parseInt(current_occupancy) || 0,
      food_available: food_available !== undefined ? !!food_available : true,
      water_available: water_available !== undefined ? !!water_available : true,
      medical_facility: medical_facility !== undefined ? !!medical_facility : false,
      electricity: electricity !== undefined ? !!electricity : true,
      toilets: parseInt(toilets) || 0,
      contact_person, contact_phone, status: status || 'active',
      created_at: new Date().toISOString(), updated_at: new Date().toISOString()
    });

    const created = await db('shelters').where('id', id).first();
    const io = req.app.get('io');
    if (io) io.emit('shelter:created', created);
    await logAction(req.user.id, 'shelter_created', 'shelter', id, `Created shelter ${name}`, req.ip);

    res.status(201).json({ success: true, data: created });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// PUT /api/shelters/:id/occupancy
router.put('/:id/occupancy', authenticate, requireMinRole('Field Officer'), async (req, res) => {
  try {
    const { current_occupancy } = req.body;
    if (current_occupancy === undefined || isNaN(current_occupancy)) {
      return res.status(400).json({ success: false, error: 'Valid current_occupancy required' });
    }

    const shelter = await db('shelters').where('id', req.params.id).first();
    if (!shelter) return res.status(404).json({ success: false, error: 'Shelter not found' });

    const newOcc = Math.max(0, parseInt(current_occupancy));
    const newStatus = newOcc >= shelter.capacity ? 'full' : (shelter.status === 'full' ? 'active' : shelter.status);

    await db('shelters').where('id', req.params.id).update({
      current_occupancy: newOcc,
      status: newStatus,
      updated_at: new Date().toISOString()
    });

    const updated = await db('shelters').where('id', req.params.id).first();
    const occRate = Math.round((newOcc / shelter.capacity) * 100);

    const io = req.app.get('io');
    if (io) io.emit('shelter:updated', updated);

    // Notify EOC if above 85%
    if (occRate >= 85) {
      await notifyRole('EOC Operator', {
        category: 'high',
        title: `Shelter High Occupancy Alert: ${shelter.name}`,
        message: `${shelter.name} is currently at ${occRate}% capacity (${newOcc}/${shelter.capacity}).`,
        related_type: 'shelter',
        related_id: shelter.id
      });
    }

    await logAction(req.user.id, 'shelter_occupancy_update', 'shelter', shelter.id, `Updated occupancy to ${newOcc}/${shelter.capacity}`, req.ip);

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// PUT /api/shelters/:id
router.put('/:id', authenticate, requireMinRole('District Admin'), async (req, res) => {
  try {
    const updateData = { ...req.body, updated_at: new Date().toISOString() };
    delete updateData.id;
    await db('shelters').where('id', req.params.id).update(updateData);
    const updated = await db('shelters').where('id', req.params.id).first();
    
    const io = req.app.get('io');
    if (io) io.emit('shelter:updated', updated);
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
