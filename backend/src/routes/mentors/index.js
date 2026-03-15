const express = require('express');
const { requireAuth, requireRole } = require('../../middlewares/authClient');
const MentorConsultation = require('../../models/MentorConsultation');
const ChatMessage = require('../../models/ChatMessage');
const Review = require('../../models/Review');
const Notification = require('../../models/Notification');
const User = require('../../models/User');

const router = express.Router();

// ──────────────────────────────────────────────
// PUBLIC: List mentors
// GET /api/mentors
// ──────────────────────────────────────────────
router.get('/', async (req, res, next) => {
  try {
    const { specialization, minRating, page = 1, limit = 20 } = req.query;
    const query = { role: 'mentor' };
    if (specialization) query['mentorInfo.specialization'] = specialization;
    if (minRating) query['mentorInfo.rating'] = { $gte: Number(minRating) };

    const mentors = await User.find(query)
      .select('name email phone avatar mentorInfo address')
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .sort({ 'mentorInfo.rating': -1 });

    const total = await User.countDocuments(query);
    res.json({ mentors, total, page: +page, pages: Math.ceil(total / +limit) });
  } catch (e) { next(e); }
});

// ──────────────────────────────────────────────
// PUBLIC: Get mentor profile
// GET /api/mentors/:mentorId
// ──────────────────────────────────────────────
router.get('/:mentorId', async (req, res, next) => {
  try {
    const mentor = await User.findOne({ _id: req.params.mentorId, role: 'mentor' })
      .select('name email phone avatar mentorInfo address');
    if (!mentor) return res.status(404).json({ error: { message: 'Mentor not found' } });

    // Get reviews for this mentor
    const reviews = await Review.find({ targetId: mentor._id, targetModel: 'User' })
      .populate('reviewerId', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(20);

    const reviewStats = await Review.aggregate([
      { $match: { targetId: mentor._id, targetModel: 'User' } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);

    res.json({
      mentor,
      reviews,
      stats: reviewStats[0] || { avgRating: 0, count: 0 },
    });
  } catch (e) { next(e); }
});

// ──────────────────────────────────────────────
// CLIENT: Request consultation
// POST /api/mentors/:mentorId/consult
// ──────────────────────────────────────────────
router.post('/:mentorId/consult', requireAuth, async (req, res, next) => {
  try {
    const { carId, scheduledAt, clientMessage } = req.body;

    const mentor = await User.findOne({ _id: req.params.mentorId, role: 'mentor' });
    if (!mentor) return res.status(404).json({ error: { message: 'Mentor not found' } });

    // Check for duplicate pending consultation
    const existing = await MentorConsultation.findOne({
      clientId: req.user.id,
      mentorId: req.params.mentorId,
      status: { $in: ['requested', 'accepted', 'in_progress'] },
    });
    if (existing) {
      return res.json({ consultation: existing, message: 'Consultation already exists' });
    }

    const consultation = await MentorConsultation.create({
      clientId: req.user.id,
      mentorId: req.params.mentorId,
      carId: carId || null,
      scheduledAt: scheduledAt || null,
      clientMessage: clientMessage || '',
    });

    // Notify mentor
    await Notification.create({
      recipientId: req.params.mentorId,
      recipientModel: 'User',
      type: 'mentor_request',
      title: 'New Consultation Request',
      message: clientMessage || 'A client wants your guidance.',
      data: { consultationId: consultation._id, clientId: req.user.id },
    });

    res.status(201).json(consultation);
  } catch (e) { next(e); }
});

// ──────────────────────────────────────────────
// CLIENT: List my consultations
// GET /api/mentors/consultations/mine
// ──────────────────────────────────────────────
router.get('/consultations/mine', requireAuth, async (req, res, next) => {
  try {
    const consultations = await MentorConsultation.find({ clientId: req.user.id })
      .populate('mentorId', 'name avatar mentorInfo')
      .populate('carId', 'brand model basePrice')
      .sort({ createdAt: -1 });
    res.json(consultations);
  } catch (e) { next(e); }
});

// ──────────────────────────────────────────────
// MENTOR: List consultations assigned to me
// GET /api/mentors/consultations/assigned
// ──────────────────────────────────────────────
router.get('/consultations/assigned', requireAuth, requireRole('mentor'), async (req, res, next) => {
  try {
    const consultations = await MentorConsultation.find({ mentorId: req.user.id })
      .populate('clientId', 'name avatar phone email')
      .populate('carId', 'brand model basePrice')
      .sort({ createdAt: -1 });
    res.json(consultations);
  } catch (e) { next(e); }
});

// ──────────────────────────────────────────────
// MENTOR: Accept or update consultation status
// PATCH /api/mentors/consultations/:id/status
// ──────────────────────────────────────────────
router.patch('/consultations/:id/status', requireAuth, requireRole('mentor'), async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const allowed = ['accepted', 'in_progress', 'completed', 'cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: { message: `Status must be: ${allowed.join(', ')}` } });
    }

    const update = { status };
    if (notes) update.notes = notes;
    if (status === 'completed') update.completedAt = new Date();

    const consultation = await MentorConsultation.findOneAndUpdate(
      { _id: req.params.id, mentorId: req.user.id },
      update,
      { new: true }
    );
    if (!consultation) return res.status(404).json({ error: { message: 'Consultation not found' } });

    // Notify client
    await Notification.create({
      recipientId: consultation.clientId,
      recipientModel: 'User',
      type: 'mentor_accepted',
      title: status === 'accepted' ? 'Mentor Accepted! 🎉' : `Consultation ${status}`,
      message: `Your consultation status has been updated to: ${status}`,
      data: { consultationId: consultation._id },
    });

    res.json(consultation);
  } catch (e) { next(e); }
});

// ──────────────────────────────────────────────
// CHAT: Send a message
// POST /api/mentors/chat/:consultationId
// ──────────────────────────────────────────────
router.post('/chat/:consultationId', requireAuth, async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: { message: 'message is required' } });

    const consultation = await MentorConsultation.findOne({
      _id: req.params.consultationId,
      $or: [{ clientId: req.user.id }, { mentorId: req.user.id }],
    });
    if (!consultation) return res.status(404).json({ error: { message: 'Consultation not found' } });

    const senderRole = String(consultation.clientId) === String(req.user.id) ? 'client' : 'mentor';

    const chatMsg = await ChatMessage.create({
      consultationId: req.params.consultationId,
      senderId: req.user.id,
      senderRole,
      message,
    });

    res.status(201).json(chatMsg);
  } catch (e) { next(e); }
});

// ──────────────────────────────────────────────
// CHAT: Get messages for a consultation
// GET /api/mentors/chat/:consultationId
// ──────────────────────────────────────────────
router.get('/chat/:consultationId', requireAuth, async (req, res, next) => {
  try {
    const consultation = await MentorConsultation.findOne({
      _id: req.params.consultationId,
      $or: [{ clientId: req.user.id }, { mentorId: req.user.id }],
    });
    if (!consultation) return res.status(404).json({ error: { message: 'Consultation not found' } });

    const messages = await ChatMessage.find({ consultationId: req.params.consultationId })
      .populate('senderId', 'name avatar')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (e) { next(e); }
});

// ──────────────────────────────────────────────
// REVIEW: Submit review for a mentor
// POST /api/mentors/:mentorId/review
// ──────────────────────────────────────────────
router.post('/:mentorId/review', requireAuth, async (req, res, next) => {
  try {
    const { rating, title, comment, consultationId } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: { message: 'rating (1-5) is required' } });
    }

    const review = await Review.findOneAndUpdate(
      { reviewerId: req.user.id, targetId: req.params.mentorId, targetModel: 'User' },
      {
        reviewerId: req.user.id,
        targetId: req.params.mentorId,
        targetModel: 'User',
        rating,
        title: title || '',
        comment: comment || '',
        consultationId: consultationId || null,
      },
      { upsert: true, new: true, runValidators: true }
    );

    // Update mentor's average rating
    const stats = await Review.aggregate([
      { $match: { targetId: review.targetId, targetModel: 'User' } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } },
    ]);
    if (stats[0]) {
      await User.findByIdAndUpdate(req.params.mentorId, {
        'mentorInfo.rating': Math.round(stats[0].avgRating * 10) / 10,
      });
    }

    // Notify mentor
    await Notification.create({
      recipientId: req.params.mentorId,
      recipientModel: 'User',
      type: 'review_received',
      title: 'New Review',
      message: `You received a ${rating}-star review${title ? ': ' + title : ''}`,
      data: { reviewId: review._id },
    });

    res.status(201).json(review);
  } catch (e) { next(e); }
});

module.exports = router;
