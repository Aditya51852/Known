const express = require('express');
const { requireDealer, requireOwnerParam } = require('../../middlewares/authDealer');
const Dealer = require('../../models/Dealer');
const Inventory = require('../../models/Inventory');
const Booking = require('../../models/Booking');

const router = express.Router();

// List dealers with basic filters
router.get('/', async (req, res, next) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    const query = {};
    if (q) query.$text = { $search: q };
    const dealers = await Dealer.find(query)
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .select('name email company avatarUrl address');
    res.json(dealers);
  } catch (e) { next(e); }
});

// Get dealer by id
router.get('/:id', async (req, res, next) => {
  try {
    const d = await Dealer.findById(req.params.id).select('-passwordHash');
    if (!d) return res.status(404).json({ error: 'USER_NOT_FOUND', message: 'Dealer not found' });
    res.json(d);
  } catch (e) { next(e); }
});

// Update dealer (owner only)
router.put('/:id', requireDealer, requireOwnerParam('id'), async (req, res, next) => {
  try {
    const disallowed = ['roles', 'passwordHash', 'email'];
    disallowed.forEach(k => delete req.body[k]);
    const d = await Dealer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).select('-passwordHash');
    if (!d) return res.status(404).json({ error: 'USER_NOT_FOUND', message: 'Dealer not found' });
    res.json(d);
  } catch (e) { next(e); }
});

// Inventory list
router.get('/:id/inventory', async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const q = { dealerId: req.params.id };
    if (status) q.status = status;
    const items = await Inventory.find(q).skip((+page - 1) * +limit).limit(+limit);
    res.json(items);
  } catch (e) { next(e); }
});

// Inventory create (owner)
router.post('/:id/inventory', requireDealer, requireOwnerParam('id'), async (req, res, next) => {
  try {
    const payload = { ...req.body };
    payload.dealerId = req.params.id;
    const created = await Inventory.create(payload);
    res.status(201).json(created);
  } catch (e) { next(e); }
});

// Inventory update (owner)
router.put('/:id/inventory/:itemId', requireDealer, requireOwnerParam('id'), async (req, res, next) => {
  try {
    const updated = await Inventory.findOneAndUpdate({ _id: req.params.itemId, dealerId: req.params.id }, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'NOT_FOUND', message: 'Inventory not found' });
    res.json(updated);
  } catch (e) { next(e); }
});

// Inventory read
router.get('/:id/inventory/:itemId', async (req, res, next) => {
  try {
    const item = await Inventory.findOne({ _id: req.params.itemId, dealerId: req.params.id });
    if (!item) return res.status(404).json({ error: 'NOT_FOUND', message: 'Inventory not found' });
    res.json(item);
  } catch (e) { next(e); }
});

// Inventory delete (owner)
router.delete('/:id/inventory/:itemId', requireDealer, requireOwnerParam('id'), async (req, res, next) => {
  try {
    const deleted = await Inventory.findOneAndDelete({ _id: req.params.itemId, dealerId: req.params.id });
    if (!deleted) return res.status(404).json({ error: 'NOT_FOUND', message: 'Inventory not found' });
    res.json({ success: true });
  } catch (e) { next(e); }
});

// Bookings list (dealer auth)
router.get('/:id/bookings', requireDealer, requireOwnerParam('id'), async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const q = { dealerId: req.params.id };
    if (status) q.status = status;
    const items = await Booking.find(q).skip((+page - 1) * +limit).limit(+limit);
    res.json(items);
  } catch (e) { next(e); }
});

// Booking create (customer side)
router.post('/:id/bookings', async (req, res, next) => {
  try {
    const { inventoryId, startDate, endDate, priceQuoted, customer } = req.body || {};
    if (!inventoryId || !startDate || !endDate) return res.status(400).json({ error: 'MISSING_FIELDS', message: 'inventoryId, startDate, endDate required' });
    const inv = await Inventory.findOne({ _id: inventoryId, dealerId: req.params.id });
    if (!inv) return res.status(404).json({ error: 'NOT_FOUND', message: 'Inventory not found for dealer' });
    const created = await Booking.create({ dealerId: req.params.id, inventoryId, startDate, endDate, priceQuoted, customer });
    res.status(201).json(created);
  } catch (e) { next(e); }
});

// Booking update (dealer)
router.put('/:id/bookings/:bookingId', requireDealer, requireOwnerParam('id'), async (req, res, next) => {
  try {
    const allowed = ['status', 'priceQuoted', 'notes', 'startDate', 'endDate'];
    const update = {};
    for (const k of allowed) if (k in req.body) update[k] = req.body[k];
    const b = await Booking.findOneAndUpdate({ _id: req.params.bookingId, dealerId: req.params.id }, update, { new: true });
    if (!b) return res.status(404).json({ error: 'NOT_FOUND', message: 'Booking not found' });
    res.json(b);
  } catch (e) { next(e); }
});

// Booking read
router.get('/:id/bookings/:bookingId', requireDealer, requireOwnerParam('id'), async (req, res, next) => {
  try {
    const b = await Booking.findOne({ _id: req.params.bookingId, dealerId: req.params.id });
    if (!b) return res.status(404).json({ error: 'NOT_FOUND', message: 'Booking not found' });
    res.json(b);
  } catch (e) { next(e); }
});

module.exports = router;
