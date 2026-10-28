const ROLE_HIERARCHY = {
  'Super Admin': 8,
  'State Admin': 7,
  'District Admin': 6,
  'EOC Operator': 5,
  'NGO Admin': 4,
  'Field Officer': 3,
  'Volunteer': 2,
  'Public User': 1,
};

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ success: false, error: 'Authentication required' });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: 'Insufficient permissions' });
    }
    next();
  };
}

function requireMinRole(minRole) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ success: false, error: 'Authentication required' });
    const userLevel = ROLE_HIERARCHY[req.user.role] || 0;
    const requiredLevel = ROLE_HIERARCHY[minRole] || 0;
    if (userLevel < requiredLevel) {
      return res.status(403).json({ success: false, error: 'Insufficient permissions' });
    }
    next();
  };
}

module.exports = { requireRole, requireMinRole, ROLE_HIERARCHY };
