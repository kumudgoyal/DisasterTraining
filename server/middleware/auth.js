const jwt = require('jsonwebtoken');
const db = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'dmecs-secret-key-change-in-production';

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Authentication required' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    db('users')
      .join('roles', 'users.role_id', 'roles.id')
      .leftJoin('organizations', 'users.organization_id', 'organizations.id')
      .where('users.id', decoded.userId)
      .select(
        'users.*',
        'roles.name as role',
        'roles.permissions as role_permissions',
        'organizations.name as organization_name'
      )
      .first()
      .then(user => {
        if (!user || !user.is_active) {
          return res.status(401).json({ success: false, error: 'User not found or inactive' });
        }
        delete user.password_hash;
        req.user = user;
        next();
      })
      .catch(err => {
        console.error('Auth error:', err);
        res.status(500).json({ success: false, error: 'Authentication error' });
      });
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
}

function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  authenticate(req, res, next);
}

module.exports = { authenticate, optionalAuth, JWT_SECRET };
