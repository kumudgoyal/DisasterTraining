const express = require('express');
const db = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { requireMinRole } = require('../middleware/rbac');
const { logAction } = require('../middleware/audit');
const { notifyRole } = require('../services/notificationService');
const router = express.Router();

// GET /api/resources
router.get('/', authenticate, async (req, res) => {
  try {
    const { type, status, organization_id } = req.query;
    let query = db('resources')
      .leftJoin('organizations', 'resources.organization_id', 'organizations.id')
      .leftJoin('incidents', 'resources.assigned_incident_id', 'incidents.id')
      .select(
        'resources.*',
        'organizations.name as organization_name',
        'incidents.incident_id as assigned_incident_code',
        'incidents.title as assigned_incident_title'
      );

    if (type) query = query.where('resources.type', type);
    if (status) query = query.where('resources.status', status);
    if (organization_id) query = query.where('resources.organization_id', organization_id);

    const resources = await query.orderBy('resources.name', 'asc');
    res.json({ success: true, data: resources });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// POST /api/resources
router.post('/', authenticate, requireMinRole('NGO Admin'), async (req, res) => {
  try {
    const { name, type, quantity, available_quantity, location, latitude, longitude, organization_id } = req.body;
    if (!name || !type || quantity === undefined) {
      return res.status(400).json({ success: false, error: 'Name, type and quantity are required' });
    }

    const orgId = req.user.role === 'Super Admin' || req.user.role === 'State Admin' 
      ? (organization_id || req.user.organization_id)
      : req.user.organization_id;

    const [id] = await db('resources').insert({
      name, type,
      quantity: parseInt(quantity),
      available_quantity: available_quantity !== undefined ? parseInt(available_quantity) : parseInt(quantity),
      location: location || '',
      latitude: latitude || null,
      longitude: longitude || null,
      status: 'available',
      organization_id: orgId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    const created = await db('resources').where('id', id).first();
    const io = req.app.get('io');
    if (io) io.emit('resource:created', created);

    res.status(201).json({ success: true, data: created });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// PUT /api/resources/:id
router.put('/:id', authenticate, requireMinRole('NGO Admin'), async (req, res) => {
  try {
    const updateData = { ...req.body, updated_at: new Date().toISOString() };
    delete updateData.id;
    await db('resources').where('id', req.params.id).update(updateData);
    const updated = await db('resources').where('id', req.params.id).first();
    
    const io = req.app.get('io');
    if (io) io.emit('resource:updated', updated);

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /api/resources/requests
router.get('/requests/all', authenticate, async (req, res) => {
  try {
    const { incident_id, status, urgency } = req.query;
    let query = db('resource_requests')
      .join('incidents', 'resource_requests.incident_id', 'incidents.id')
      .leftJoin('users as requester', 'resource_requests.requested_by', 'requester.id')
      .leftJoin('users as approver', 'resource_requests.approved_by', 'approver.id')
      .leftJoin('resources', 'resource_requests.assigned_resource_id', 'resources.id')
      .select(
        'resource_requests.*',
        'incidents.incident_id as incident_code',
        'incidents.title as incident_title',
        'incidents.severity as incident_severity',
        'requester.full_name as requested_by_name',
        'approver.full_name as approved_by_name',
        'resources.name as assigned_resource_name'
      );

    if (incident_id) query = query.where('resource_requests.incident_id', incident_id);
    if (status) query = query.where('resource_requests.status', status);
    if (urgency) query = query.where('resource_requests.urgency', urgency);

    const requests = await query.orderBy('resource_requests.created_at', 'desc');
    res.json({ success: true, data: requests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// POST /api/resources/requests
router.post('/requests', authenticate, async (req, res) => {
  try {
    const { incident_id, resource_type, quantity, urgency, description } = req.body;
    if (!incident_id || !resource_type || !quantity) {
      return res.status(400).json({ success: false, error: 'Incident ID, resource type, and quantity required' });
    }

    const now = new Date().toISOString();
    const [id] = await db('resource_requests').insert({
      incident_id: parseInt(incident_id),
      requested_by: req.user.id,
      resource_type,
      quantity: parseInt(quantity),
      urgency: urgency || 'medium',
      description: description || '',
      status: 'pending',
      created_at: now,
      updated_at: now
    });

    const request = await db('resource_requests')
      .join('incidents', 'resource_requests.incident_id', 'incidents.id')
      .where('resource_requests.id', id)
      .select('resource_requests.*', 'incidents.title as incident_title', 'incidents.incident_id as incident_code')
      .first();

    const io = req.app.get('io');
    if (io) io.emit('resource:requested', request);

    await notifyRole('EOC Operator', {
      category: urgency === 'critical' ? 'critical' : 'high',
      title: `Resource Requested: ${quantity}x ${resource_type}`,
      message: `Request for Incident ${request.incident_code}: ${request.incident_title} (${urgency} urgency)`,
      related_type: 'resource',
      related_id: id
    });

    await logAction(req.user.id, 'resource_request_created', 'resource_request', id, `Requested ${quantity} ${resource_type} for incident ${incident_id}`, req.ip);

    res.status(201).json({ success: true, data: request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// PUT /api/resources/requests/:id/assign
router.put('/requests/:id/assign', authenticate, requireMinRole('EOC Operator'), async (req, res) => {
  try {
    const { resource_id } = req.body;
    if (!resource_id) return res.status(400).json({ success: false, error: 'resource_id required' });

    const request = await db('resource_requests').where('id', req.params.id).first();
    if (!request) return res.status(404).json({ success: false, error: 'Request not found' });

    const resource = await db('resources').where('id', resource_id).first();
    if (!resource) return res.status(404).json({ success: false, error: 'Resource not found' });

    const now = new Date().toISOString();
    const allocQuantity = Math.min(resource.available_quantity, request.quantity);

    // Update request
    await db('resource_requests').where('id', req.params.id).update({
      assigned_resource_id: resource.id,
      approved_by: req.user.id,
      status: 'assigned',
      updated_at: now
    });

    // Update resource availability
    const newAvail = Math.max(0, resource.available_quantity - allocQuantity);
    await db('resources').where('id', resource.id).update({
      available_quantity: newAvail,
      status: newAvail === 0 ? 'deployed' : 'reserved',
      assigned_incident_id: request.incident_id,
      updated_at: now
    });

    // Record timeline update in incident
    await db('incident_updates').insert({
      incident_id: request.incident_id,
      user_id: req.user.id,
      update_text: `Resource allocated: ${allocQuantity}x ${resource.name} (${resource.type})`,
      update_type: 'resource',
      created_at: now
    });

    const io = req.app.get('io');
    if (io) {
      io.emit('resource:assigned', { request_id: request.id, resource_id: resource.id });
      io.emit('incident:update_added', { incident_id: request.incident_id });
    }

    await logAction(req.user.id, 'resource_assigned', 'resource_request', request.id, `Assigned resource ${resource.name} to incident ${request.incident_id}`, req.ip);

    res.json({ success: true, message: 'Resource successfully assigned' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// PUT /api/resources/requests/:id/status
router.put('/requests/:id/status', authenticate, requireMinRole('EOC Operator'), async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'assigned', 'fulfilled', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }

    await db('resource_requests').where('id', req.params.id).update({
      status,
      approved_by: req.user.id,
      updated_at: new Date().toISOString()
    });

    res.json({ success: true, data: { status } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
