const express = require('express');
const db = require('../config/database');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// GET /api/notifications
router.get('/', authenticate, async (req, res) => {
  try {
    const { limit = 40 } = req.query;
    const notifications = await db('notifications')
      .where('user_id', req.user.id)
      .orderBy('created_at', 'desc')
      .limit(parseInt(limit));

    const unreadCount = await db('notifications')
      .where('user_id', req.user.id)
      .where('is_read', false)
      .count('id as c')
      .first();

    res.json({
      success: true,
      data: {
        notifications,
        unread_count: unreadCount.c || 0
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// PUT /api/notifications/:id/read
router.put('/:id/read', authenticate, async (req, res) => {
  try {
    await db('notifications')
      .where('id', req.params.id)
      .where('user_id', req.user.id)
      .update({ is_read: true });

    res.json({ success: true, message: 'Notification marked as read' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// PUT /api/notifications/read-all
router.put('/read-all', authenticate, async (req, res) => {
  try {
    await db('notifications')
      .where('user_id', req.user.id)
      .update({ is_read: true });

    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
