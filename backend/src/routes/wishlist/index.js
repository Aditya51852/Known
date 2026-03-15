const express = require('express');
const { requireAuth } = require('../../middlewares/authClient');
const Wishlist = require('../../models/Wishlist');

const router = express.Router();

// ──────────────────────────────────────────────
// Get my wishlist
// GET /api/wishlist
// ──────────────────────────────────────────────
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const items = await Wishlist.find({ userId: req.user.id })
      .populate('carId', 'brand model basePrice images bodyType fuelType transmission')
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (e) { next(e); }
});

// ──────────────────────────────────────────────
// Add to wishlist
// POST /api/wishlist
// ──────────────────────────────────────────────
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { carId } = req.body;
    if (!carId) return res.status(400).json({ error: { message: 'carId is required' } });

    const existing = await Wishlist.findOne({ userId: req.user.id, carId });
    if (existing) return res.json({ item: existing, message: 'Already in wishlist' });

    const item = await Wishlist.create({ userId: req.user.id, carId });
    res.status(201).json(item);
  } catch (e) { next(e); }
});

// ──────────────────────────────────────────────
// Remove from wishlist
// DELETE /api/wishlist/:carId
// ──────────────────────────────────────────────
router.delete('/:carId', requireAuth, async (req, res, next) => {
  try {
    const item = await Wishlist.findOneAndDelete({
      userId: req.user.id,
      carId: req.params.carId,
    });
    if (!item) return res.status(404).json({ error: { message: 'Not in wishlist' } });
    res.json({ success: true });
  } catch (e) { next(e); }
});

// ──────────────────────────────────────────────
// Check if car is in wishlist
// GET /api/wishlist/check/:carId
// ──────────────────────────────────────────────
router.get('/check/:carId', requireAuth, async (req, res, next) => {
  try {
    const item = await Wishlist.findOne({ userId: req.user.id, carId: req.params.carId });
    res.json({ inWishlist: !!item });
  } catch (e) { next(e); }
});

module.exports = router;
