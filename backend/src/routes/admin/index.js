const express = require('express');
const { requireAuth, requireRole } = require('../../middlewares/authClient');
const { requireDealer } = require('../../middlewares/authDealer');
const User = require('../../models/User');
const Dealer = require('../../models/Dealer');
const Car = require('../../models/Car');
const BargainSession = require('../../models/BargainSession');
const BargainBulletin = require('../../models/BargainBulletin');
const MentorConsultation = require('../../models/MentorConsultation');
const TestDriveRequest = require('../../models/TestDriveRequest');
const Booking = require('../../models/Booking');
const Review = require('../../models/Review');
const Notification = require('../../models/Notification');

const router = express.Router();

// ──────────────────────────────────────────────
// ADMIN: Platform overview stats
// GET /api/admin/stats
// ──────────────────────────────────────────────
router.get('/stats', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalDealers,
      totalCars,
      totalMentors,
      openArenas,
      lockedArenas,
      totalConsultations,
      totalTestDrives,
      totalBookings,
      totalReviews,
    ] = await Promise.all([
      User.countDocuments(),
      Dealer.countDocuments(),
      Car.countDocuments(),
      User.countDocuments({ role: 'mentor' }),
      BargainSession.countDocuments({ status: 'open' }),
      BargainSession.countDocuments({ status: 'locked' }),
      MentorConsultation.countDocuments(),
      TestDriveRequest.countDocuments(),
      Booking.countDocuments(),
      Review.countDocuments(),
    ]);

    res.json({
      users: { total: totalUsers, dealers: totalDealers, mentors: totalMentors },
      cars: totalCars,
      bargainArena: { open: openArenas, locked: lockedArenas },
      consultations: totalConsultations,
      testDrives: totalTestDrives,
      bookings: totalBookings,
      reviews: totalReviews,
    });
  } catch (e) { next(e); }
});

// ──────────────────────────────────────────────
// ADMIN: List users with filters
// GET /api/admin/users
// ──────────────────────────────────────────────
router.get('/users', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const { role, page = 1, limit = 20, q } = req.query;
    const query = {};
    if (role) query.role = role;
    if (q) query.$or = [
      { name: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } },
      { phone: { $regex: q, $options: 'i' } },
    ];

    const users = await User.find(query)
      .select('-passwordHash')
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);
    res.json({ users, total, page: +page, pages: Math.ceil(total / +limit) });
  } catch (e) { next(e); }
});

// ──────────────────────────────────────────────
// ADMIN: Update user role
// PATCH /api/admin/users/:userId/role
// ──────────────────────────────────────────────
router.patch('/users/:userId/role', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const { role } = req.body;
    const allowed = ['client', 'dealer', 'mentor', 'service_provider', 'admin'];
    if (!allowed.includes(role)) {
      return res.status(400).json({ error: { message: `Role must be: ${allowed.join(', ')}` } });
    }
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { role },
      { new: true }
    ).select('-passwordHash');
    if (!user) return res.status(404).json({ error: { message: 'User not found' } });
    res.json(user);
  } catch (e) { next(e); }
});

// ──────────────────────────────────────────────
// ADMIN: List all bargain sessions
// GET /api/admin/bargain-sessions
// ──────────────────────────────────────────────
router.get('/bargain-sessions', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;

    const sessions = await BargainSession.find(query)
      .populate('clientId', 'name email phone')
      .populate('carId', 'brand model basePrice')
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .sort({ createdAt: -1 });

    const total = await BargainSession.countDocuments(query);
    res.json({ sessions, total, page: +page, pages: Math.ceil(total / +limit) });
  } catch (e) { next(e); }
});

// ──────────────────────────────────────────────
// DEALER: Dashboard stats
// GET /api/admin/dealer-stats
// ──────────────────────────────────────────────
router.get('/dealer-stats', requireDealer, async (req, res, next) => {
  try {
    const dealerId = req.dealer.id;
    const [
      totalInventory,
      availableInventory,
      totalBookings,
      pendingBookings,
      arenasWon,
      arenasParticipated,
      unreadNotifications,
    ] = await Promise.all([
      Booking.countDocuments({ dealerId }),
      Booking.countDocuments({ dealerId, status: 'available' }),
      Booking.countDocuments({ dealerId }),
      Booking.countDocuments({ dealerId, status: 'pending' }),
      BargainSession.countDocuments({ lockedDealerId: dealerId, status: { $in: ['locked', 'completed'] } }),
      BargainBulletin.countDocuments({ dealerId }),
      Notification.countDocuments({ recipientId: dealerId, read: false }),
    ]);

    res.json({
      inventory: { total: totalInventory, available: availableInventory },
      bookings: { total: totalBookings, pending: pendingBookings },
      bargainArena: { won: arenasWon, participated: arenasParticipated },
      unreadNotifications,
    });
  } catch (e) { next(e); }
});

module.exports = router;
