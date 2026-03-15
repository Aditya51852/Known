const express = require('express');
const { requireAuth } = require('../../middlewares/authClient');
const Notification = require('../../models/Notification');

const router = express.Router();

// ──────────────────────────────────────────────
// Get my notifications
// GET /api/notifications
// ──────────────────────────────────────────────
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const { page = 1, limit = 20, unreadOnly } = req.query;
    const query = { recipientId: req.user.id };
    if (unreadOnly === 'true') query.read = false;

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip((+page - 1) * +limit)
      .limit(+limit);

    const total = await Notification.countDocuments(query);
    const unread = await Notification.countDocuments({ recipientId: req.user.id, read: false });

    res.json({ notifications, total, unread, page: +page, pages: Math.ceil(total / +limit) });
  } catch (e) { next(e); }
});

// ──────────────────────────────────────────────
// Mark notification as read
// PATCH /api/notifications/:id/read
// ──────────────────────────────────────────────
router.patch('/:id/read', requireAuth, async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipientId: req.user.id },
      { read: true, readAt: new Date() },
      { new: true }
    );
    if (!notification) return res.status(404).json({ error: { message: 'Notification not found' } });
    res.json(notification);
  } catch (e) { next(e); }
});

// ──────────────────────────────────────────────
// Mark all as read
// POST /api/notifications/read-all
// ──────────────────────────────────────────────
router.post('/read-all', requireAuth, async (req, res, next) => {
  try {
    await Notification.updateMany(
      { recipientId: req.user.id, read: false },
      { read: true, readAt: new Date() }
    );
    res.json({ success: true });
  } catch (e) { next(e); }
});

// ──────────────────────────────────────────────
// Delete notification
// DELETE /api/notifications/:id
// ──────────────────────────────────────────────
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipientId: req.user.id,
    });
    if (!notification) return res.status(404).json({ error: { message: 'Notification not found' } });
    res.json({ success: true });
  } catch (e) { next(e); }
});

module.exports = router;
