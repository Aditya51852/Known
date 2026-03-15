const express = require('express');
const { requireAuth, requireRole } = require('../../middlewares/authClient');
const { requireDealer } = require('../../middlewares/authDealer');
const Review = require('../../models/Review');
const Notification = require('../../models/Notification');

const router = express.Router();

// ──────────────────────────────────────────────
// Get reviews for a target (mentor, dealer, or car)
// GET /api/reviews?targetId=xxx&targetModel=User
// ──────────────────────────────────────────────
router.get('/', async (req, res, next) => {
  try {
    const { targetId, targetModel, page = 1, limit = 20 } = req.query;
    if (!targetId || !targetModel) {
      return res.status(400).json({ error: { message: 'targetId and targetModel are required' } });
    }

    const query = { targetId, targetModel };
    const reviews = await Review.find(query)
      .populate('reviewerId', 'name avatar')
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .sort({ createdAt: -1 });

    const stats = await Review.aggregate([
      { $match: { targetId: require('mongoose').Types.ObjectId.createFromHexString(targetId), targetModel } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);

    res.json({
      reviews,
      stats: stats[0] || { avgRating: 0, count: 0 },
    });
  } catch (e) { next(e); }
});

// ──────────────────────────────────────────────
// Submit a review (for car or dealer)
// POST /api/reviews
// ──────────────────────────────────────────────
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { targetId, targetModel, rating, title, comment } = req.body;
    if (!targetId || !targetModel || !rating) {
      return res.status(400).json({ error: { message: 'targetId, targetModel, and rating are required' } });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: { message: 'rating must be 1-5' } });
    }

    const review = await Review.findOneAndUpdate(
      { reviewerId: req.user.id, targetId, targetModel },
      { reviewerId: req.user.id, targetId, targetModel, rating, title: title || '', comment: comment || '' },
      { upsert: true, new: true, runValidators: true }
    );

    // Notify the target
    await Notification.create({
      recipientId: targetId,
      recipientModel: targetModel,
      type: 'review_received',
      title: 'New Review',
      message: `You received a ${rating}-star review${title ? ': ' + title : ''}`,
      data: { reviewId: review._id },
    });

    res.status(201).json(review);
  } catch (e) { next(e); }
});

module.exports = router;
