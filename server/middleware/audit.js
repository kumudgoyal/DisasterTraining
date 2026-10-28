const db = require('../config/database');

async function logAction(userId, action, entityType, entityId, details, ipAddress) {
  try {
    await db('audit_logs').insert({
      user_id: userId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      details,
      ip_address: ipAddress || null,
      created_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Audit log error:', err);
  }
}

function auditLog(action, entityType) {
  return (req, res, next) => {
    const originalJson = res.json.bind(res);
    res.json = function(data) {
      if (res.statusCode < 400 && req.user) {
        const entityId = data?.data?.id || req.params?.id || null;
        logAction(req.user.id, action, entityType, entityId, JSON.stringify({ method: req.method, path: req.path }), req.ip);
      }
      return originalJson(data);
    };
    next();
  };
}

module.exports = { auditLog, logAction };
