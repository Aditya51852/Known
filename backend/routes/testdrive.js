const express = require('express');
const TestDriveCart = require('../models/TestDriveCart');
const TestDriveRequest = require('../models/TestDriveRequest');

const router = express.Router();

function getUserId(req) {
  return req.header('x-user-id');
}

function pricePerCar(count) {
  return count >= 3 ? 399 : 450;
}

router.get('/cart', async (req, res, next) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: { message: 'Unauthorized' } });
    let cart = await TestDriveCart.findOne({ userId });
    if (!cart) cart = await TestDriveCart.create({ userId, items: [] });
    res.json(cart);
  } catch (e) { next(e); }
});

router.post('/cart/items', async (req, res, next) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: { message: 'Unauthorized' } });
    let cart = await TestDriveCart.findOne({ userId });
    if (!cart) cart = await TestDriveCart.create({ userId, items: [] });
    const exists = cart.items.find(i => String(i.carId) === String(req.body.carId));
    const count = cart.items.length + (exists ? 0 : 1);
    const price = pricePerCar(count);
    if (!exists) cart.items.push({ carId: req.body.carId, priceApplied: price });
    cart.items = cart.items.map(i => ({ ...i.toObject(), priceApplied: pricePerCar(cart.items.length) }));
    await cart.save();
    res.status(201).json(cart);
  } catch (e) { next(e); }
});

router.delete('/cart/items/:carId', async (req, res, next) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: { message: 'Unauthorized' } });
    let cart = await TestDriveCart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: { message: 'Not Found' } });
    cart.items = cart.items.filter(i => String(i.carId) !== String(req.params.carId));
    cart.items = cart.items.map(i => ({ ...i.toObject(), priceApplied: pricePerCar(cart.items.length) }));
    await cart.save();
    res.json(cart);
  } catch (e) { next(e); }
});

router.get('/pricing-summary', async (req, res, next) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: { message: 'Unauthorized' } });
    let cart = await TestDriveCart.findOne({ userId });
    if (!cart) cart = await TestDriveCart.create({ userId, items: [] });
    const totalCars = cart.items.length;
    const price = pricePerCar(totalCars);
    const basePrice = 450;
    const totalAmount = totalCars * price;
    const savings = totalCars >= 3 ? totalCars * (basePrice - price) : 0;
    res.json({ totalCars, pricePerCar: price, totalAmount, savings, hasDiscount: totalCars >= 3 });
  } catch (e) { next(e); }
});

router.post('/checkout', async (req, res, next) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: { message: 'Unauthorized' } });
    const cart = await TestDriveCart.findOne({ userId });
    if (!cart || cart.items.length === 0) return res.status(400).json({ error: { message: 'Cart is empty' } });
    const totalCars = cart.items.length;
    const price = pricePerCar(totalCars);
    const items = cart.items.map(i => ({ carId: i.carId, priceApplied: price }));
    const totalAmount = totalCars * price;
    const reqDoc = await TestDriveRequest.create({ userId, items, totalAmount, status: 'pending', preferredTime: req.body.preferredTime || null, location: req.body.location || null });
    cart.items = [];
    await cart.save();
    res.status(201).json(reqDoc);
  } catch (e) { next(e); }
});

module.exports = router;
