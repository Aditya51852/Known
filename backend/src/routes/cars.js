const express = require('express');
const multer = require('multer');
const path = require('path');
const Car = require('../models/Car');

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/cars/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'car-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  }
});

router.get('/', async (req, res, next) => {
  try {
    const q = {};
    if (req.query.brand) q.brand = req.query.brand;
    if (req.query.type) q.bodyType = req.query.type;
    if (req.query.fuelType) q.fuelType = req.query.fuelType;
    if (req.query.transmission) q.transmission = req.query.transmission;
    if (req.query.seating) q.seating = Number(req.query.seating);
    if (req.query.q) q.$text = { $search: req.query.q };
    if (req.query.priceMin || req.query.priceMax) {
      q.basePrice = {};
      if (req.query.priceMin) q.basePrice.$gte = Number(req.query.priceMin);
      if (req.query.priceMax) q.basePrice.$lte = Number(req.query.priceMax);
    }
    const cars = await Car.find(q).limit(50);
    res.json(cars);
  } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ error: { message: 'Not Found' } });
    res.json(car);
  } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try {
    const car = await Car.create(req.body);
    res.status(201).json(car);
  } catch (e) { next(e); }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!car) return res.status(404).json({ error: { message: 'Not Found' } });
    res.json(car);
  } catch (e) { next(e); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) return res.status(404).json({ error: { message: 'Not Found' } });
    res.json({ success: true });
  } catch (e) { next(e); }
});

// Upload images for a car
router.post('/:id/images', upload.array('images', 10), async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ error: { message: 'Car not found' } });
    
    const imageUrls = req.files.map(file => ({
      url: `/uploads/cars/${file.filename}`,
      type: req.body.type || 'exterior',
      alt: req.body.alt || `${car.brand} ${car.model}`
    }));
    
    car.images.push(...imageUrls);
    await car.save();
    
    res.status(201).json({ success: true, images: imageUrls, car });
  } catch (e) { next(e); }
});

module.exports = router;
