const express = require('express');
const db = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { requireMinRole } = require('../middleware/rbac');
const router = express.Router();

// GET /api/admin/users
router.get('/users', authenticate, requireMinRole('District Admin'), async (req, res) => {
  try {
    const { role, search } = req.query;
    let query = db('users')
      .join('roles', 'users.role_id', 'roles.id')
      .leftJoin('organizations', 'users.organization_id', 'organizations.id')
      .select(
        'users.id', 'users.email', 'users.full_name', 'users.phone', 'users.district', 'users.state',
        'users.is_active', 'users.last_login', 'users.created_at',
        'roles.id as role_id', 'roles.name as role',
        'organizations.id as organization_id', 'organizations.name as organization_name'
      );

    if (role) query = query.where('roles.name', role);
    if (search) {
      query = query.where(function() {
        this.where('users.full_name', 'like', `%${search}%`)
          .orWhere('users.email', 'like', `%${search}%`)
          .orWhere('users.district', 'like', `%${search}%`);
      });
    }

    const users = await query.orderBy('users.created_at', 'desc');
    const roles = await db('roles').select('id', 'name');
    const organizations = await db('organizations').select('id', 'name');

    res.json({ success: true, data: { users, roles, organizations } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// PUT /api/admin/users/:id
router.put('/users/:id', authenticate, requireMinRole('State Admin'), async (req, res) => {
  try {
    const { role_id, organization_id, is_active, district } = req.body;
    const updateData = {};
    if (role_id !== undefined) updateData.role_id = role_id;
    if (organization_id !== undefined) updateData.organization_id = organization_id;
    if (is_active !== undefined) updateData.is_active = is_active;
    if (district !== undefined) updateData.district = district;

    await db('users').where('id', req.params.id).update(updateData);
    const updated = await db('users')
      .join('roles', 'users.role_id', 'roles.id')
      .leftJoin('organizations', 'users.organization_id', 'organizations.id')
      .where('users.id', req.params.id)
      .select(
        'users.id', 'users.email', 'users.full_name', 'users.phone', 'users.district', 'users.is_active',
        'roles.name as role', 'organizations.name as organization_name'
      )
      .first();

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /api/admin/audit-logs
router.get('/audit-logs', authenticate, requireMinRole('District Admin'), async (req, res) => {
  try {
    const { action, entity_type, limit = 100 } = req.query;
    let query = db('audit_logs')
      .leftJoin('users', 'audit_logs.user_id', 'users.id')
      .select(
        'audit_logs.*',
        'users.full_name as user_name',
        'users.email as user_email'
      );

    if (action) query = query.where('audit_logs.action', action);
    if (entity_type) query = query.where('audit_logs.entity_type', entity_type);

    const logs = await query.orderBy('audit_logs.created_at', 'desc').limit(parseInt(limit));
    res.json({ success: true, data: logs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
