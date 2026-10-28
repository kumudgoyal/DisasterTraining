const db = require('../config/database');

async function createNotification({ user_id, category, title, message, related_type, related_id }) {
  try {
    await db('notifications').insert({
      user_id, category: category || 'information', title, message,
      related_type, related_id, is_read: false, created_at: new Date().toISOString(),
    });
  } catch (err) { console.error('Notification error:', err); }
}

async function notifyRole(roleName, data) {
  try {
    const users = await db('users').join('roles', 'users.role_id', 'roles.id')
      .where('roles.name', roleName).andWhere('users.is_active', true).select('users.id');
    for (const user of users) {
      await createNotification({ ...data, user_id: user.id });
    }
  } catch (err) { console.error('Notify role error:', err); }
}

async function notifyOrg(orgId, data) {
  try {
    const users = await db('users').where('organization_id', orgId).andWhere('is_active', true).select('id');
    for (const user of users) {
      await createNotification({ ...data, user_id: user.id });
    }
  } catch (err) { console.error('Notify org error:', err); }
}

module.exports = { createNotification, notifyRole, notifyOrg };
