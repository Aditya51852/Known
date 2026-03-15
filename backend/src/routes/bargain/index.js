const express = require('express');
const crypto = require('crypto');
const { requireAuth, requireRole } = require('../../middlewares/authClient');
const { requireDealer } = require('../../middlewares/authDealer');
const BargainSession = require('../../models/BargainSession');
const BargainBulletin = require('../../models/BargainBulletin');
const Notification = require('../../models/Notification');
const Car = require('../../models/Car');
const Dealer = require('../../models/Dealer');
const Inventory = require('../../models/Inventory');

const router = express.Router();

// ──────────────────────────────────────────────
// CLIENT: Show interest in a car → create arena session
// POST /api/bargain/interest
// ──────────────────────────────────────────────
router.post('/interest', requireAuth, async (req, res, next) => {
  try {
    const { carId } = req.body;
    if (!carId) return res.status(400).json({ error: { message: 'carId is required' } });

    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ error: { message: 'Car not found' } });

    // Check for existing open session for same client + car
    const existing = await BargainSession.findOne({
      clientId: req.user.id,
      carId,
      status: 'open',
    });
    if (existing) {
      return res.json({ session: existing, message: 'Session already open' });
    }

    // Find all dealers who have this car brand in inventory or deal in it
    const inventoryDealerIds = await Inventory.distinct('dealerId', {
      status: 'available',
    });

    // Also find dealers whose brands include this car's brand
    const brandDealers = await Dealer.find({}).select('_id');
    const allDealerIds = [...new Set([
      ...inventoryDealerIds.map(String),
      ...brandDealers.map(d => String(d._id)),
    ])];

    const session = await BargainSession.create({
      clientId: req.user.id,
      carId,
      notifiedDealerIds: allDealerIds,
    });

    // Create notifications for all matching dealers
    const notifications = allDealerIds.map(dealerId => ({
      recipientId: dealerId,
      recipientModel: 'Dealer',
      type: 'bargain_arena_open',
      title: 'New Bargain Arena',
      message: `A buyer is interested in ${car.brand} ${car.model}. Submit your best offer!`,
      data: { sessionId: session._id, carId, carBrand: car.brand, carModel: car.model },
    }));
    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    res.status(201).json({
      session,
      dealersNotified: allDealerIds.length,
      car: { brand: car.brand, model: car.model, basePrice: car.basePrice },
    });
  } catch (e) { next(e); }
});

// ──────────────────────────────────────────────
// CLIENT: List my bargain sessions
// GET /api/bargain/sessions
// ──────────────────────────────────────────────
router.get('/sessions', requireAuth, async (req, res, next) => {
  try {
    const sessions = await BargainSession.find({ clientId: req.user.id })
      .populate('carId', 'brand model basePrice images')
      .sort({ createdAt: -1 });
    res.json(sessions);
  } catch (e) { next(e); }
});

// ──────────────────────────────────────────────
// CLIENT: View arena room — see anonymous bulletins (NO dealer info!)
// GET /api/bargain/arena/:sessionId
// ──────────────────────────────────────────────
router.get('/arena/:sessionId', requireAuth, async (req, res, next) => {
  try {
    const session = await BargainSession.findOne({
      _id: req.params.sessionId,
      clientId: req.user.id,
    }).populate('carId', 'brand model basePrice images bodyType fuelType transmission');

    if (!session) return res.status(404).json({ error: { message: 'Session not found' } });

    // Get all bulletins — strip dealer identity!
    const bulletins = await BargainBulletin.find({ sessionId: session._id })
      .select('-dealerId')  // CRITICAL: never expose dealer ID to client
      .sort({ offeredPrice: 1 });

    res.json({
      session,
      bulletins,
      totalOffers: bulletins.length,
    });
  } catch (e) { next(e); }
});

// ──────────────────────────────────────────────
// CLIENT: Lock a bulletin — pay token money
// POST /api/bargain/lock
// ──────────────────────────────────────────────
router.post('/lock', requireAuth, async (req, res, next) => {
  try {
    const { sessionId, anonymousTokenId, tokenPaymentAmount } = req.body;
    if (!sessionId || !anonymousTokenId) {
      return res.status(400).json({ error: { message: 'sessionId and anonymousTokenId are required' } });
    }

    const session = await BargainSession.findOne({
      _id: sessionId,
      clientId: req.user.id,
      status: 'open',
    });
    if (!session) return res.status(404).json({ error: { message: 'Open session not found' } });

    // Find the bulletin by anonymous token
    const bulletin = await BargainBulletin.findOne({
      sessionId,
      anonymousTokenId,
    });
    if (!bulletin) return res.status(404).json({ error: { message: 'Offer not found' } });

    // Lock the bulletin
    bulletin.isLocked = true;
    bulletin.lockedAt = new Date();
    await bulletin.save();

    // Update session
    session.status = 'locked';
    session.lockedBulletinId = bulletin._id;
    session.lockedDealerId = bulletin.dealerId;
    session.tokenPaymentAmount = tokenPaymentAmount || 5000;  // default ₹5000 token
    session.tokenPaymentStatus = 'paid';
    await session.save();

    // Get dealer info — NOW we can reveal it
    const dealer = await Dealer.findById(bulletin.dealerId).select('name email phone company address');

    // Notify winning dealer
    await Notification.create({
      recipientId: bulletin.dealerId,
      recipientModel: 'Dealer',
      type: 'bargain_won',
      title: 'You won a Bargain Arena! 🎉',
      message: 'A client has locked your offer. Prepare for the buying process.',
      data: { sessionId, bulletinId: bulletin._id },
    });

    // Notify losing dealers
    const losingBulletins = await BargainBulletin.find({
      sessionId,
      _id: { $ne: bulletin._id },
    });
    const loserNotifications = losingBulletins.map(lb => ({
      recipientId: lb.dealerId,
      recipientModel: 'Dealer',
      type: 'bargain_lost',
      title: 'Arena Closed',
      message: 'The buyer has selected another offer. Better luck next time!',
      data: { sessionId },
    }));
    if (loserNotifications.length > 0) {
      await Notification.insertMany(loserNotifications);
    }

    res.json({
      success: true,
      session,
      lockedOffer: {
        anonymousTokenId: bulletin.anonymousTokenId,
        offeredPrice: bulletin.offeredPrice,
        priceBreakdown: bulletin.priceBreakdown,
        offers: bulletin.offers,
        discounts: bulletin.discounts,
        financingOptions: bulletin.financingOptions,
        estimatedDeliveryDays: bulletin.estimatedDeliveryDays,
        freeAccessories: bulletin.freeAccessories,
      },
      dealer, // Revealed only after lock-in!
    });
  } catch (e) { next(e); }
});

// ──────────────────────────────────────────────
// DEALER: Get arena sessions where I can participate
// GET /api/bargain/dealer/open-arenas
// ──────────────────────────────────────────────
router.get('/dealer/open-arenas', requireDealer, async (req, res, next) => {
  try {
    const sessions = await BargainSession.find({
      status: 'open',
      notifiedDealerIds: req.dealer.id,
    }).populate('carId', 'brand model basePrice images bodyType fuelType');

    // Check which ones I already submitted a bulletin for
    const myBulletins = await BargainBulletin.find({
      dealerId: req.dealer.id,
      sessionId: { $in: sessions.map(s => s._id) },
    });
    const submittedSessionIds = new Set(myBulletins.map(b => String(b.sessionId)));

    const result = sessions.map(s => ({
      ...s.toObject(),
      alreadySubmitted: submittedSessionIds.has(String(s._id)),
    }));

    res.json(result);
  } catch (e) { next(e); }
});

// ──────────────────────────────────────────────
// DEALER: Submit a bulletin (anonymous offer)
// POST /api/bargain/bulletin
// ──────────────────────────────────────────────
router.post('/bulletin', requireDealer, async (req, res, next) => {
  try {
    const {
      sessionId,
      offeredPrice,
      priceBreakdown,
      offers,
      discounts,
      financingOptions,
      estimatedDeliveryDays,
      freeAccessories,
    } = req.body;

    if (!sessionId || !offeredPrice) {
      return res.status(400).json({ error: { message: 'sessionId and offeredPrice are required' } });
    }

    const session = await BargainSession.findOne({ _id: sessionId, status: 'open' });
    if (!session) return res.status(404).json({ error: { message: 'Open session not found' } });

    // Check if dealer was notified for this session
    if (!session.notifiedDealerIds.map(String).includes(String(req.dealer.id))) {
      return res.status(403).json({ error: { message: 'You are not invited to this arena' } });
    }

    // Generate fresh anonymous token ID
    const anonymousTokenId = 'TKN-' + crypto.randomBytes(4).toString('hex').toUpperCase();

    // Upsert: allow dealer to update their bulletin
    const bulletin = await BargainBulletin.findOneAndUpdate(
      { sessionId, dealerId: req.dealer.id },
      {
        sessionId,
        dealerId: req.dealer.id,
        anonymousTokenId,  // refresh token every time
        offeredPrice,
        priceBreakdown: priceBreakdown || {},
        offers: offers || [],
        discounts: discounts || [],
        financingOptions: financingOptions || {},
        estimatedDeliveryDays,
        freeAccessories: freeAccessories || [],
      },
      { upsert: true, new: true, runValidators: true }
    );

    // Notify client that a new bulletin arrived
    await Notification.create({
      recipientId: session.clientId,
      recipientModel: 'User',
      type: 'bargain_bulletin_received',
      title: 'New Offer Received!',
      message: `A dealer has submitted an offer of ₹${offeredPrice.toLocaleString('en-IN')} for your arena.`,
      data: { sessionId, anonymousTokenId },
    });

    res.status(201).json({
      success: true,
      bulletinId: bulletin._id,
      anonymousTokenId: bulletin.anonymousTokenId,
    });
  } catch (e) { next(e); }
});

// ──────────────────────────────────────────────
// DEALER: View my bulletin for a session
// GET /api/bargain/dealer/bulletin/:sessionId
// ──────────────────────────────────────────────
router.get('/dealer/bulletin/:sessionId', requireDealer, async (req, res, next) => {
  try {
    const bulletin = await BargainBulletin.findOne({
      sessionId: req.params.sessionId,
      dealerId: req.dealer.id,
    });
    if (!bulletin) return res.status(404).json({ error: { message: 'No bulletin submitted yet' } });
    res.json(bulletin);
  } catch (e) { next(e); }
});

// ──────────────────────────────────────────────
// CLIENT: Cancel a session
// POST /api/bargain/cancel/:sessionId
// ──────────────────────────────────────────────
router.post('/cancel/:sessionId', requireAuth, async (req, res, next) => {
  try {
    const session = await BargainSession.findOneAndUpdate(
      { _id: req.params.sessionId, clientId: req.user.id, status: 'open' },
      { status: 'cancelled' },
      { new: true }
    );
    if (!session) return res.status(404).json({ error: { message: 'Open session not found' } });
    res.json({ success: true, session });
  } catch (e) { next(e); }
});

module.exports = router;
